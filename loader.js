// https://en.wikipedia.org/wiki/Immediately-invoked_function_expression
(function () {
    "use strict";

    function addScriptTag (src) {
        var script = document.createElement("script");
        script.setAttribute("src", src);
        document.querySelector("head").appendChild(script);
    }

    function include (reference) {
        addScriptTag("ref/" + reference + "/test.js");
        addScriptTag("ref/" + reference + "/sinon.js");
    }

    var parameters = {
        ref: "src"
    };
    window.location.search.split("&").forEach(function (parameter, index) {
        if (0 === index) {
            // search starts with ?
            parameter = parameter.substr(1);
        }
        // Parameter is composed of name[=value]?
        var pair = parameter.split("=");
        if (1 === pair.length) {
            pair.push(true);
        }
        parameters[pair[0]] = pair[1];
    });

    include(parameters.ref);

}());
