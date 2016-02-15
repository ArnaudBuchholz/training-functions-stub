module.exports = function (grunt) {
    "use strict";
    /*eslint-env node*/

    // This will measure the time spent in each task
    require("time-grunt")(grunt);

    // This will configure each task individually
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // https://www.npmjs.com/package/grunt-contrib-copy
        copy: {
            us1: {
                expand: true,
                cwd: "ref/us1/",
                src: "*.js",
                dest: "src/"
            },
            us2: {
                expand: true,
                cwd: "ref/us2/",
                src: "*.js",
                dest: "src/"
            }
        },

        // https://www.npmjs.com/package/grunt-eslint
        eslint: {
            options: {
                quiet: true,
                format: "json",
                outputFile: "tmp/eslint.json"
            },
            target: [
                "src/*.js"
            ]
        },

        // https://www.npmjs.com/package/grunt-mocha-test
        mochaTest: {
            test: {
                options: {
                    quiet: true,
                    reporter: "json",
                    captureFile: "tmp/mochaTest.json",
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

        // https://www.npmjs.com/package/grunt-serve
        connect: {
            server: {
                options: {
                    livereload: false,
                    port: 9000
                }
            }
        },

        // https://www.npmjs.com/package/grunt-contrib-watch
        watch: {
            scripts: {
                files: ["src/*.js"],
                tasks: [
                    "eslint",
                    "mochaTest"
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
        "grunt-mocha-test"
    ].forEach(function (packageName) {
        grunt.loadNpmTasks(packageName);
    });

    // Default task
    grunt.registerTask("default", [
        "connect:server",
        "watch"
    ]);

};
