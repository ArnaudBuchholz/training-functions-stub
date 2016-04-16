(function () {
    "use strict";
    /*global gpf*/

    function onTokenFound (event) {
        var me = this, //eslint-disable-line no-invalid-this
            type = event.type(),
            token = event.get("token"),
            tag;
        if ("space" === type) {
            // Trim any space token before the first non space one
            if (!me.hasChildNodes()) {
                return;
            }
            // Replace tabs with 4 spaces
            token = gpf.replaceEx(token, {
                "\t": "    "
            });
        }
        // Concatenate to the code ele,ent
        tag = document.createElement("span");
        tag.className = type;
        tag.appendChild(document.createTextNode(token));
        me.appendChild(tag);
    }

    window.addEventListener("load", function () {
        var codeElement = document.getElementById("preview"),
            content = codeElement.innerHTML
                .replace(/(&lt;)/g, "<")
                .replace(/(&gt;)/g, ">")
                .replace(/(&amp;)/g, "&");
        codeElement.innerHTML = ""; // Easy way to clear current content
        gpf.js.tokenize.apply(codeElement, [content, onTokenFound]);
    });

}());
