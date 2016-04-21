module.exports = function (grunt) {
    "use strict";
    /*eslint-env node*/

    // This will measure the time spent in each task
    require("time-grunt")(grunt);

    //region copy implementation

    var fs = require("fs");

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
            target: [
                "src/*.js"
            ]
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
        notify: {
            eslint: {
                options: {
                    title: "Training on functions stub",
                    message: "Verified with ESLint"
                }
            },
            coverage: {
                options: {
                    title: "Training on functions stub"
                }
            }
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

    // Register named tasks as aliases or custom implementation (using functions)
    (function (aliases) {
        Object.keys(aliases).forEach(function (name) {
            grunt.registerTask(name, aliases[name]);
        });
    }({
        analyze: [
            "eslint",
            "notify:eslint",
            "mochaTest",
            "updateCoverage",
            "notifySetCoverage",
            "notify:coverage"
        ],

        // Append fix-coverage to the generated coverage file
        updateCoverage: function () {
            fs.writeFileSync("tmp/coverage.html", fs.readFileSync("tmp/coverage.html").toString()
                + fs.readFileSync("fix-coverage.html").toString());
        },

        // Set coverage value for notification
        notifySetCoverage: function () {
            var coverageData = grunt.file.readJSON("tmp/coverage.json"),
                message = "Tested, coverage: ";
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
