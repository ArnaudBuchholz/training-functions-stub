(function () {
    "use strict";
    /*global xhrGet*/

    var _usRef;

    function _noAnnotations (usRef, refIcon) {
        if (usRef !== _usRef) {
            // Obsolete
            return;
        }
        refIcon.className = "ref";
    }

    function _processAnnotations (usRef, refIcon, annotationsText) {
        if (usRef !== _usRef) {
            // Obsolete
            return;
        }
        if (JSON.parse(annotationsText).every(function (annotation) {
            return true !== annotation.updated;
        })) {
            _noAnnotations(usRef, refIcon);
        } else {
            refIcon.className = "ref updated";
        }
    }

    function _setUsRef (usRef) {
        var basePath = "ref/" + usRef + "/",
            sinonRefIcon = document.getElementById("ref-sinon"),
            sinonPath = basePath + "sinon.js",
            testRefIcon = document.getElementById("ref-test"),
            testPath = basePath + "test.js";
        _usRef = usRef;
        sinonRefIcon.setAttribute("href", "preview.html?" + sinonPath);
        xhrGet("../" + sinonPath + ".annotations")
            .then(_processAnnotations.bind(null, usRef, sinonRefIcon), _noAnnotations.bind(null, usRef, sinonRefIcon));
        testRefIcon.setAttribute("href", "preview.html?" + testPath);
        xhrGet("../" + testPath + ".annotations")
            .then(_processAnnotations.bind(null, usRef, testRefIcon), _noAnnotations.bind(null, usRef, testRefIcon));
    }

    function _clean () {
        [
            "eslint",
            "test",
            "coverage"
        ].forEach(function (id) {
            var element = document.getElementById(id);
            element.className = "";
            element.innerHTML = "";
        });
    }

    function _updateStatus (id, htmlContent) {
        var element = document.getElementById(id);
        if (htmlContent) {
            element.innerHTML = htmlContent;
            return false;
        }
        element.innerHTML = "<img src=\"up.png\">";
        return true;
    }

    function _updateEslintOverlayVisibility () {
        [
            "eslint-sinon",
            "eslint-test"
        ].forEach(function (id) {
            var element = document.getElementById(id),
                className = "eslint-overlay";
            if ("0" === element.innerHTML) {
                className += " hidden";
            }
            element.className = className;
        });
    }

    function _getEslintStatus (info) {
        var eslintSinonCount = document.getElementById("eslint-sinon"),
            eslintTestCount = document.getElementById("eslint-test");
        eslintSinonCount.innerHTML = "0";
        eslintTestCount.innerHTML = "0";
        var totalCount = 0;
        info.eslint.forEach(function (eslintData) {
            var count = eslintData.messages.length;
            totalCount += count;
            if (-1 < eslintData.filePath.indexOf("sinon.js")) { // approximate
                eslintSinonCount.innerHTML = count;
            } else {
                eslintTestCount.innerHTML = count;
            }
        });
        if (totalCount) {
            return totalCount + " messages";
        }
    }

    function _getTestStatus (info) {
        if (0 !== info.mochaTest.stats.failures) {
            return info.mochaTest.stats.failures + " failures";
        }
    }

    function _getCoverageStatus (info) {
        if (100 !== info.coverage.coverage) {
            return Math.floor(info.coverage.coverage) + "%";
        }
    }

    function _update (info) {
        _updateStatus("eslint", _getEslintStatus(info));
        _updateEslintOverlayVisibility();
        _updateStatus("test", _getTestStatus(info));
        _updateStatus("coverage", _getCoverageStatus(info));
    }

    function _applyUsRef () {
        _clean();
        var gearbox = document.getElementById("gearbox"),
            controls = document.getElementById("controls");
        controls.className = "hidden";
        gearbox.className = "";
        function show () {
            controls.className = "";
            gearbox.className = "hidden";
        }
        xhrGet("/copy?" + _usRef)
            .then(function (copyAnswer) {
                if ("false" === copyAnswer) {
                    show();
                    alert("Copy failed"); //eslint-disable-line no-alert
                    return;
                }
                function wait () {
                    setTimeout(function () {
                        xhrGet("/info")
                            .then(function (infoAnswer) {
                                var info = JSON.parse(infoAnswer);
                                if (info.pending) {
                                    return wait();
                                }
                                _update(info);
                                show();
                            });
                    }, 500); // Don't stress the 'server'
                }
                wait();
            });
    }

    window.addEventListener("load", function () {

        _clean();
        document.getElementById("play").addEventListener("click", _applyUsRef);
        window.setUsRef = _setUsRef;

    });

    var _shortCuts;

    function _getShortcuts () {
        _shortCuts =  {};
        var elements = document.querySelectorAll("[key-shortcut]");
        [].slice.call(elements).forEach(function (element) {
            var shortcut = element.getAttribute("key-shortcut");
            _shortCuts[shortcut] = element;
        });
    }

    window.dashboard = {

        shortcut: function (key) {
            if (!_shortCuts) {
                _getShortcuts();
            }
            if ("0" === key && window.parent) {
                window.parent.alert("Back to presentation"); // back to presentation
            }
            var element = _shortCuts[key];
            if (element) {
                element.click();
            }
        }

    };

}());
