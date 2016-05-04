(function () {
    "use strict";
    /*global gpf, xhrGet*/

    function _newLine (codeElement) {
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

    function _onTokenFound (event) {
        var me = this, //eslint-disable-line no-invalid-this
            type = event.type(),
            token = event.get("token");
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
        token.split("\n").forEach(function (text, index) {
            var tag;
            if (0 < index) {
                _newLine(me);
            }
            // Concatenate to the code element
            tag = document.createElement("span");
            tag.className = type;
            tag.appendChild(document.createTextNode(text));
            me.appendChild(tag);
        });
    }

    function _reformatCode (codeElement) {
        var content = codeElement.innerHTML
                .replace(/(&lt;)/g, "<")
                .replace(/(&gt;)/g, ">")
                .replace(/(&amp;)/g, "&");
        codeElement.innerHTML = ""; // Easy way to clear current content
        gpf.js.tokenize.apply(codeElement, [content, _onTokenFound]);
        _newLine(codeElement); // potential last line
    }

    function findCurrentInLine (line, column) {
        var pos = column,
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
        return current;
    }

    function _showEslintErrors (codeElement, messages) {
        messages.forEach(function (message) {
            var line = codeElement.querySelectorAll("div.line")[message.line - 1],
                current = findCurrentInLine(line, message.column),
                eslintData;
            line.className += " eslint-error";
            current.className += " eslint-error";
            eslintData = current.getAttribute("data-eslint");
            if (eslintData) {
                eslintData = JSON.parse(eslintData);
            } else {
                eslintData = [];
            }
            eslintData.push({
                severity: message.severity,
                ruleId: message.ruleId,
                message: message.message
            });
            current.setAttribute("data-eslint", JSON.stringify(eslintData));
        });
    }

    function _onClick (event) {
        var eslintData = event.target.getAttribute("data-eslint"),
            eslintPopup = document.getElementById("eslint"),
            clientWidth,
            x;
        if (eslintData) {
            eslintPopup.innerHTML = JSON.parse(eslintData).map(function (message) {
                return "<a href=\"http://eslint.org/docs/rules/" + message.ruleId + "\" target=\"eslint\" "
                + "class=\"severity" + message.severity + "\">" + message.message.replace(/ /g, "&nbsp;") + "</a>";
            }).join("<br/>");
            x = event.pageX;
            clientWidth = document.body.scrollWidth;
            eslintPopup.className = "";
            if (x + eslintPopup.clientWidth > clientWidth) {
                x = clientWidth - eslintPopup.clientWidth - 16;
            }
            eslintPopup.setAttribute("style", "left: " + x + "px; top: " + (event.pageY + 16) + "px;");
        } else {
            eslintPopup.className = "hidden";
        }
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
        document.getElementById("filename").innerHTML = fileUrl;
        if (fileUrl) {
            xhrGet("../" + fileUrl)
                .then(function (responseText) {
                    document.title = fileUrl;
                    preview.innerHTML = responseText;
                    _reformatCode(preview);
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
                            _showEslintErrors(preview, data.messages);
                            document.addEventListener("click", _onClick);
                            return false;
                        }
                        return true;
                    });
                });
        }
    });

}());
