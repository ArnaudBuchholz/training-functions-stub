"use strict";

module.exports = {

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

};
