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

    grunt.registerTask("md2html", "Converts User Story markdown to HTML", function () {
        var storyIndex = 0,
            showdown  = require("showdown"),
            converter = new showdown.Converter(),
            mdContent,
            htmlContent;
        while (storyIndex < storyCount) {
            ++storyIndex;
            mdContent = fs.readFileSync("ref/us" + storyIndex + "/README.md").toString();
            htmlContent = "<link rel=\"stylesheet\" href=\"../us.css\" />\r\n" + converter.makeHtml(mdContent);
            fs.writeFileSync("tmp/us" + storyIndex + ".html", htmlContent);
        }
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
