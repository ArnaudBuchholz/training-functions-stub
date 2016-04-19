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
        // Concatenate to the code element
        tag = document.createElement("span");
        tag.className = type;
        tag.appendChild(document.createTextNode(token));
        me.appendChild(tag);
    }

    function reformatCode (codeElement) {
        var content = codeElement.innerHTML
                .replace(/(&lt;)/g, "<")
                .replace(/(&gt;)/g, ">")
                .replace(/(&amp;)/g, "&");
        codeElement.innerHTML = ""; // Easy way to clear current content
        gpf.js.tokenize.apply(codeElement, [content, onTokenFound]);
    }

    window.addEventListener("load", function () {
        var fileUrl = window.location.search.substr(1),
            preview = document.getElementById("preview"),
            xhr;
        if (fileUrl) {
            xhr = new XMLHttpRequest();
            xhr.open("GET", "../" + fileUrl);
            xhr.onreadystatechange = function () {
                if (4 === xhr.readyState) {
                    document.title = fileUrl;
                    preview.innerHTML = xhr.responseText;
                    reformatCode(preview);
                }
            };
            xhr.send();
        }
    });

}());
