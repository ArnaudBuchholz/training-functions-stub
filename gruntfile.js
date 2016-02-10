module.exports = function (grunt) {
    "use strict";
    /*eslint-env node*/

    // This will measure the time spent in each task
    require("time-grunt")(grunt);

    // This will configure each task individually
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        eslint: {
            target: [
                "grunt/**/*.js",
                "src/**/*.js",
                "test/**/*.js"
            ]
        },

        mochaTest: {
            source: {
                options: {
                    reporter: "spec",
                    quiet: false,
                    require: [
                        function () {
                            global.assert = require("assert");
                        },
                        "test/host/node.js"
                    ]
                },
                src: "test/*.js"
            }
        }

    });

    // Load the packages that adds features to grunt
    [
        "grunt-eslint",
        "grunt-mocha-test"
    ].forEach(function (packageName) {
        grunt.loadNpmTasks(packageName);
    });

    // Default task
    grunt.registerTask("default", [
        "eslint",
        "mochaTest"
    ]);

};
