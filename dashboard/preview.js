(function () {
    "use strict";
    /*global gpf, xhrGet*/

    function newLine (codeElement) {
        var line = document.createElement("div"),
            parts = [].slice.call(codeElement.querySelectorAll("code > span"), 0);
        if (0 < parts.length) {
            parts.forEach(function (part) {
                line.appendChild(part);
            });
            line.setAttribute("class", "line");
            codeElement.appendChild(line);
        }
    }

    function onTokenFound (event) {
        var me = this, //eslint-disable-line no-invalid-this
            type = event.type(),
            token = event.get("token"),
            tokens;
        if ("space" === type) {
            // Trim any space token before the first non space one
            if (!me.hasChildNodes()) {
                return;
            }
            // Replace tabs with 4 spaces
            token = gpf.replaceEx(token, {
                "\t": "    "
            });
            tokens = token.split("\n");
        } else {
            tokens = [token];
        }
        tokens.forEach(function (text, index) {
            var tag;
            if (0 < index) {
                newLine(me);
            }
            // Concatenate to the code element
            tag = document.createElement("span");
            tag.className = type;
            tag.appendChild(document.createTextNode(text));
            me.appendChild(tag);
        });
    }

    function reformatCode (codeElement) {
        var content = codeElement.innerHTML
                .replace(/(&lt;)/g, "<")
                .replace(/(&gt;)/g, ">")
                .replace(/(&amp;)/g, "&");
        codeElement.innerHTML = ""; // Easy way to clear current content
        gpf.js.tokenize.apply(codeElement, [content, onTokenFound]);
        newLine(codeElement); // potential last line
    }

    function showEslintErrors (codeElement, messages) {
        messages.forEach(function (message) {
            var line = codeElement.querySelectorAll("div.line")[message.line - 1],
                pos,
                current;
            line.className += " eslint-error";
            pos = message.column;
            current = line.firstChild;
            while (current && current.textContent.length < pos) {
                pos -= current.textContent.length;
                current = current.nextSibling;
            }
            if (!current) {
                current = document.createElement("span");
                current.className = "space";
                current.innerHTML = "&nbsp;";
                line.appendChild(current);
            }
            current.className += " eslint-error";

        });
    }

    window.addEventListener("load", function () {
        var fileUrl = window.location.search.substr(1),
            eslintUrl,
            preview = document.getElementById("preview");
        if (-1 < fileUrl.indexOf("&")) {
            fileUrl = fileUrl.split("&");
            eslintUrl = fileUrl[1];
            fileUrl = fileUrl[0];
        }
        if (fileUrl) {
            xhrGet("../" + fileUrl)
                .then(function (responseText) {
                    document.title = fileUrl;
                    preview.innerHTML = responseText;
                    reformatCode(preview);
                    if (eslintUrl) {
                        return xhrGet("../" + eslintUrl);
                    }
                    return Promise.resolve("[]"); // Empty configuration
                })
                .then(function (eslintText) {
                    var fileName = fileUrl.split("/").pop(),
                        fileNameLength = fileName.length; // last
                    JSON.parse(eslintText).every(function (data) {
                        // Match the filename only
                        if (data.filePath.indexOf(fileName) === data.filePath.length - fileNameLength) {
                            showEslintErrors(preview, data.messages);
                            return false;
                        }
                        return true;
                    });
                });
        }
    });

}());
