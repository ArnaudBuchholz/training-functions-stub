// https://en.wikipedia.org/wiki/Immediately-invoked_function_expression
(function () {
    "use strict";

    var parameters = {
        ref: "src",
        sinon: false
    };

    function addScriptTag (src) {
        var script = document.createElement("script");
        script.setAttribute("src", src);
        document.querySelector("head").appendChild(script);
    }

    function include (reference) {
        if ("src" !== reference) {
            reference = "ref/" + reference;
        }
        addScriptTag(reference + "/test.js");
        if (!parameters.sinon) {
            addScriptTag(reference + "/sinon.js");
        }
    }

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
    if (parameters.sinon) {
        addScriptTag("node_modules/sinon/pkg/sinon.js");
    }

}());
