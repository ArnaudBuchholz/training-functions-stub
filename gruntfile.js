module.exports = function (grunt) {
    "use strict";
    /*eslint-env node*/

    // This will measure the time spent in each task
    require("time-grunt")(grunt);

    // Check the number of stories
    var fs = require("fs"),
        storyCount = 0,
        copySettings = {
            init: {
                expand: true,
                cwd: "ref/",
                src: "*.js",
                dest: "src/"
            }
        };
    (function () {
        var index = 1,
            stats;
        while (true) { //eslint-disable-line no-constant-condition
            try {
                stats = fs.statSync("ref/us" + index);
            } catch (e) {
                break;
            }
            if (!stats.isDirectory()) {
                break;
            }
            ++storyCount;
            copySettings["us" + index] = {
                expand: true,
                cwd: "ref/us" + index + "/",
                src: "*.js",
                dest: "src/"
            };
            ++index;
        }
    }());

    // This will configure each task individually
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // https://www.npmjs.com/package/grunt-serve
        connect: {
            server: {
                options: {
                    port: 9000
                }
            }
        },

        // https://www.npmjs.com/package/grunt-contrib-copy
        copy: copySettings,

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
                tasks: [
                    "eslint",
                    "notify:eslint",
                    "mochaTest",
                    "updateCoverage",
                    "notifySetCoverage",
                    "notify:coverage"
                ],
                options: {
                    spawn: true
                }
            }
        }

    });

    // Load the packages that adds features to grunt
    [
        "grunt-contrib-connect",
        "grunt-contrib-copy",
        "grunt-contrib-watch",
        "grunt-eslint",
        "grunt-mocha-test",
        "grunt-notify"
    ].forEach(function (packageName) {
        grunt.loadNpmTasks(packageName);
    });

    grunt.registerTask("updateCoverage", "Append fix-coverage to the generated coverage file", function () {
        fs.writeFileSync("tmp/coverage.html", fs.readFileSync("tmp/coverage.html").toString()
            + fs.readFileSync("fix-coverage.html").toString());
    });

    grunt.registerTask("notifySetCoverage", function () {
        var coverageData = grunt.file.readJSON("tmp/coverage.json"),
            message = "Tested, coverage: ";
        if (coverageData.sloc) {
            message += Math.floor(1000 * coverageData.hits / coverageData.sloc) / 10 + "%";
        } else {
            message += "N/A";
        }
        grunt.config.set("notify.coverage.options.message", message);
    });

    // Default task
    grunt.registerTask("default", [
        "md2html",
        "connect:server",
        "watch"
    ]);

};
