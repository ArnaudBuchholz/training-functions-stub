(function () {
    "use strict";
    /*global gpf, xhrGet*/

    //region Syntax highlighting

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

    //endregion

    //region ESLint integration

    function findElementInLine (line, column) {
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
                current = findElementInLine(line, message.column),
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

    function _clickEslintTooltip (event) {
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

    //endregion

    //region Annotations

    function _flagLineAsUpdated (lineElement, firstLineInRange) {
        var anchor;
        lineElement.className += " updated";
        if (firstLineInRange) {
            anchor = document.createElement("a");
            anchor.setAttribute("name", "update");
            lineElement.parentNode.insertBefore(anchor, lineElement);
            window.location.hash = "update";
        }
    }

    function _flagLineAsCollapsed (lineElement, firstLineInRange) {
        if (firstLineInRange) {
            lineElement.className += " expandable";
            var expandElement = document.createElement("span");
            expandElement.className = "expand-button";
            expandElement.innerHTML = "...";
            lineElement.appendChild(expandElement);
        } else {
            lineElement.className += " collapsed";
        }
    }

    function _annotateLine (lineElement, annotation, firstLineInRange) {
        if (true === annotation.updated) {
            _flagLineAsUpdated(lineElement, firstLineInRange);
        }
        if (true === annotation.collapse) {
            _flagLineAsCollapsed(lineElement, firstLineInRange);
        }
    }

    function _annotate (codeElement, annotations) {
        annotations.forEach(function (annotation) {
            var range = annotation.range,
                lineIndex,
                lineElement;
            if ("number" === typeof range) {
                range = [range, range];
            }
            for (lineIndex = range[0]; lineIndex <= range[1]; ++lineIndex) {
                lineElement = codeElement.querySelectorAll("div.line")[lineIndex - 1];
                if (lineElement) {
                    _annotateLine(lineElement, annotation, lineIndex === range[0]);
                }
            }
        });
    }

    function _clickAnnotation (event) {
        var element = event.target,
            current,
            className,
            pos;
        if (element.className === "expand-button") {
            // First line
            current = element.parentNode;
            while (current && "div" !== current.tagName.toLowerCase()) {
                current = element.parentNode;
            }
            while (current) {
                current = current.nextSibling;
                className = current.className;
                if (-1 < className.indexOf(" collapsed")) {
                    pos = className.indexOf(" show");
                    if (-1 === pos) {
                        current.className += " show";
                    } else {
                        current.className = className.substr(0, pos);
                    }
                } else {
                    break;
                }
            }
        }
    }

    //endregion

    function _onClick (event) {
        _clickEslintTooltip(event);
        _clickAnnotation(event);
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
        document.addEventListener("click", _onClick);
        document.getElementById("filename").innerHTML = fileUrl;
        if (fileUrl) {
            xhrGet("../" + fileUrl)
                .then(function (responseText) {
                    document.title = fileUrl;
                    preview.innerHTML = responseText;
                    _reformatCode(preview);
                    xhrGet("../" + fileUrl + ".annotations")
                        .then(function (annotationsText) {
                            _annotate(preview, JSON.parse(annotationsText));
                        });
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
                            return false;
                        }
                        return true;
                    });
                });
        }
    });

}());
