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
            target: [
                "src/*.js"
            ]
        },

        // https://www.npmjs.com/package/grunt-mocha-test
        mochaTest: {
            test: {
                options: {
                    reporter: "dot",
                    quiet: false,
                    require: [
                        "node.js"
                    ]
                },
                src: "src/test.js"
            },
            coverage: {
                options: {
                    reporter: "html-cov",
                    quiet: true,
                    captureFile: "src/coverage.html"
                },
                src: "src/test.js"
            }
        },

        // https://www.npmjs.com/package/grunt-serve
        serve: {
            options: {
                port: 9000
            }
        }

    });

    // Load the packages that adds features to grunt
    [
        "grunt-contrib-copy",
        "grunt-eslint",
        "grunt-mocha-test",
        "grunt-serve"
    ].forEach(function (packageName) {
        grunt.loadNpmTasks(packageName);
    });

    // Default task
    grunt.registerTask("default", [
        "eslint",
        "mochaTest"
    ]);

};
