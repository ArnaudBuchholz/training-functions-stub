module.exports = function (grunt) {
    "use strict";
    /*eslint-env node*/

    require("time-grunt")(grunt);

    // Since the tasks are split using load-grunt-config, I need a global object containing the configuration
    global.configuration = {
        pkg: grunt.file.readJSON("./package.json")
    };

    require("load-grunt-config")(grunt);
    grunt.task.loadTasks("grunt/tasks");

};
