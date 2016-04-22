module.exports = function (grunt) {
    "use strict";
    /*eslint-env node*/

    // This will measure the time spent in each task
    require("time-grunt")(grunt);

    /**
     * Force grunt to continue after failing a task
     * ** IT IS NOT RECOMMENDED TO USE THIS **
     * I just want to make sure that all tasks are evaluated whatever happens
     */
    grunt.option("force", true);

    //region copy implementation

    var path = require("path"),
        fs = require("fs");

    function copyFile (from, name) {
        name += ".js";
        fs.writeFileSync("src/" + name, fs.readFileSync(from + "/" + name).toString());
    }

    function copy (ref) {
        ref = "ref/" + ref;
        var stats;
        try {
            stats = fs.statSync(ref);
        } catch (e) {
            return false;
        }
        if (!stats.isDirectory()) {
            return false;
        }
        copyFile(ref, "sinon");
        copyFile(ref, "test");
        return true;
    }

    //endregion

    // This is used to pre-allocate empty configurations (note that each object must be unique, hence the function)
    function genEmptyNotifyConfig () {
        return {
            options: {
                message: ""
            }
        };
    }

    // This will configure each task individually
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // https://www.npmjs.com/package/grunt-serve
        connect: {
            server: {
                options: {
                    port: 9000,
                    open: true,
                    middleware: function (connect, options, middlewares) {

                        middlewares.unshift(
                            // Hello world ! example
                            function (req, res, next) {
                                if (req.url !== "/hello") {
                                    return next();
                                }
                                res.end("Hello world !");
                            },
                            // Copy handler
                            function (req, res, next) {
                                if (0 === req.url.indexOf("/copy?")) {
                                    res.end(copy(req.url.substr(6)).toString());
                                }
                                return next();
                            }
                        );

                        return middlewares;
                    }
                }
            }
        },

        // https://www.npmjs.com/package/grunt-eslint
        eslint: {
            json: {
                options: {
                    format: "json",
                    outputFile: "tmp/eslint.json",
                    quiet: true
                },
                files: {
                    src: ["src/*.js"]
                }
            },
            target: {
                files: {
                    src: ["src/*.js"]
                }
            }
        },

        // https://www.npmjs.com/package/grunt-mocha-test
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    require: [
                        "node.js"
                    ]
                },
                src: "src/test.js"
            },
            coverage: {
                options: {
                    quiet: true,
                    reporter: "html-cov",
                    captureFile: "tmp/coverage.html"
                },
                src: "src/test.js"
            },
            coverageJSON: {
                options: {
                    reporter: "json-cov",
                    quiet: true,
                    captureFile: "tmp/coverage.json"
                },
                src: "src/test.js"
            }
        },

        // https://www.npmjs.com/package/grunt-notify
        "notify_hooks": {
            options: {
                enabled: false, // Turned off to control when notify is used
                title: "training-functions-stub",
                duration: 3
            }
        },
        notify: {
            "eslint-sinon.js": genEmptyNotifyConfig(),
            "eslint-test.js": genEmptyNotifyConfig(),
            coverage: genEmptyNotifyConfig()
        },

        // https://www.npmjs.com/package/grunt-contrib-watch
        watch: {
            scripts: {
                files: ["src/*.js"],
                tasks: "analyze",
                options: {
                    spawn: true
                }
            }
        }

    });

    // Load the packages that adds features to grunt
    [
        "grunt-contrib-connect",
        "grunt-contrib-watch",
        "grunt-eslint",
        "grunt-mocha-test",
        "grunt-notify"
    ].forEach(function (packageName) {
        grunt.loadNpmTasks(packageName);
    });
    grunt.task.run("notify_hooks");

    // Register named tasks as aliases or custom implementation (using functions)
    (function (aliases) {
        Object.keys(aliases).forEach(function (name) {
            grunt.registerTask(name, aliases[name]);
        });
    }({
        analyze: [
            "eslint",
            "notifySetEslint",
            "notify:eslint-sinon",
            "notify:eslint-test",
            "mochaTest",
            "updateCoverage",
            "notifySetCoverage",
            "notify:coverage"
        ],

        // Set eslint message for notification
        notifySetEslint: function () {
            // Reset messages
            grunt.config.set("notify.eslint-sinon.options.message", "sinon.js: linting OK");
            grunt.config.set("notify.eslint-test.options.message", "test.js: linting OK");
            var eslintData = grunt.file.readJSON("tmp/eslint.json");
            eslintData.forEach(function (fileData) {
                var fileName = path.basename(fileData.filePath, ".js").toLowerCase(),
                    errorCount = fileData.messages.filter(function (message) {
                        return 2 === message.severity;
                    }).length;
                grunt.config.set("notify.eslint-" + fileName + ".options.message",
                    fileName + ".js: " + errorCount + " linting errors");
            });
        },

        // Append fix-coverage to the generated coverage file
        updateCoverage: function () {
            fs.writeFileSync("tmp/coverage.html", fs.readFileSync("tmp/coverage.html").toString()
                + fs.readFileSync("fix-coverage.html").toString());
        },

        // Set coverage message for notification
        notifySetCoverage: function () {
            var coverageData = grunt.file.readJSON("tmp/coverage.json"),
                message = "coverage: ";
            if (coverageData.sloc) {
                message += Math.floor(1000 * coverageData.hits / coverageData.sloc) / 10 + "%";
            } else {
                message += "N/A";
            }
            grunt.config.set("notify.coverage.options.message", message);
        },

        copy: copy,

        // Default task
        "default": [
            "connect:server",
            "analyze",
            "watch"
        ]
    }));

};
