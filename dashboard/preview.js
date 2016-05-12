(function () {
    "use strict";
    /*global gpf, xhrGet*/

    //region Syntax highlighting

    function _reformatCode (codeElement) {

        function _newLine () {
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
            var type = event.type(),
                token = event.get("token");
            if ("space" === type) {
                // Trim any space token before the first non space one
                if (!codeElement.hasChildNodes()) {
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
                    _newLine();
                }
                // Concatenate to the code element
                tag = document.createElement("span");
                tag.className = type;
                tag.appendChild(document.createTextNode(text));
                codeElement.appendChild(tag);
            });
        }

        var content = codeElement.innerHTML
                .replace(/(&lt;)/g, "<")
                .replace(/(&gt;)/g, ">")
                .replace(/(&amp;)/g, "&");
        codeElement.innerHTML = ""; // Easy way to clear current content
        gpf.js.tokenize(content, _onTokenFound);
        _newLine(); // potential last line
    }

    //endregion

    //region ESLint integration

    function _showESLintErrors (codeElement, messages) {

        function _findElementInLine (line, column) {
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

        var firstError = true;
        messages.forEach(function (message) {
            var line = codeElement.querySelectorAll("div.line")[message.line - 1],
                current = _findElementInLine(line, message.column),
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
            if (firstError) {
                line.scrollIntoView();
                firstError = false;
            }
        });
    }

    function _clickESLintTooltip (event) {
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

    function _annotate (codeElement, annotations) {

        var firstUpdateAnnotation = true;

        function _flagLineAsUpdated (line) {
            line.className += " updated";
            if (firstUpdateAnnotation) {
                line.scrollIntoView();
                firstUpdateAnnotation = false;
            }
        }

        function _flagLineAsCollapsed (line, firstLineInRange) {
            if (firstLineInRange) {
                line.className += " expandable";
                var expandElement = document.createElement("span");
                expandElement.className = "expand-button";
                expandElement.innerHTML = "...";
                line.appendChild(expandElement);
            } else {
                line.className += " collapsed";
            }
        }

        function _annotateLine (line, annotation, firstLineInRange) {
            if (true === annotation.updated) {
                _flagLineAsUpdated(line, firstLineInRange);
            }
            if (true === annotation.collapse) {
                _flagLineAsCollapsed(line, firstLineInRange);
            }
        }

        annotations.forEach(function (annotation) {
            var range = annotation.range,
                lineIndex,
                line;
            if ("number" === typeof range) {
                range = [range, range];
            }
            for (lineIndex = range[0]; lineIndex <= range[1]; ++lineIndex) {
                line = codeElement.querySelectorAll("div.line")[lineIndex - 1];
                if (line) {
                    _annotateLine(line, annotation, lineIndex === range[0]);
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

    //region color scheme

    function _setColorScheme () {
        var link = document.getElementById("colorscheme"),
            colorScheme = localStorage.getItem("preview-color-scheme") || "white";
        if (link) {
            link.parentNode.removeChild(link);
        }
        link = document.createElement("link");
        link.id = "colorscheme";
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "preview-" + colorScheme + ".css");
        document.head.appendChild(link);
    }

    document.addEventListener("keypress", function (event) {
        if (event.code === "KeyC") {
            var colorScheme = localStorage.getItem("preview-color-scheme") || "white";
            if ("white" === colorScheme) {
                colorScheme =  "black";
            } else {
                colorScheme = "white";
            }
            localStorage.setItem("preview-color-scheme", colorScheme);
            _setColorScheme();
        }
    });

    //endregion

    window.addEventListener("load", function () {
        _setColorScheme();
        var fileUrl = window.location.search.substr(1),
            eslintUrl,
            preview = document.getElementById("preview");
        if (-1 < fileUrl.indexOf("&")) {
            fileUrl = fileUrl.split("&");
            eslintUrl = fileUrl[1];
            fileUrl = fileUrl[0];
        }
        document.addEventListener("click", function (event) {
            _clickESLintTooltip(event);
            _clickAnnotation(event);
        });
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
                            _showESLintErrors(preview, data.messages);
                            return false;
                        }
                        return true;
                    });
                });
        }
    });

}());
