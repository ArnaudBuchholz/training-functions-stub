// https://en.wikipedia.org/wiki/Immediately-invoked_function_expression
(function () {
    "use strict";

    var parameters = {
        ref: "src",
        sinon: false
    };

    function addElement (parent, type, attributes) {
        var element = document.createElement(type);
        Object.keys(attributes).forEach(function (name) {
            element.setAttribute(name, attributes[name]);
        });
        return parent.appendChild(element);
    }

    function addScriptElement (src) {
        addElement(document.querySelector("head"), "script", {
            src: src
        });
    }

    function include (reference) {
        if ("src" !== reference) {
            reference = "ref/" + reference;
        }
        addScriptElement(reference + "/test.js");
        if (!parameters.sinon) {
            addScriptElement(reference + "/sinon.js");
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
        addScriptElement("node_modules/sinon/pkg/sinon.js");
    }

    window.addEventListener("load", function () {
        addElement(document.body, "iframe", {
            src: "loader.html"
        });
    });

}());
