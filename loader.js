// https://en.wikipedia.org/wiki/Immediately-invoked_function_expression
(function () {
    "use strict";

    function include (reference) {
        var script = document.createElement("script");
        script.setAttribute("src", "ref/" + reference + "/test.js");
        document.querySelector("head").appendChild(script);
    }

    include("test");

}());
