(function () {
    "use strict";
    /*global xhrGet*/

    var _usRef;

    function _setUsRef (usRef) {
        _usRef = usRef;
        document.getElementById("ref-sinon").setAttribute("href", "preview.html?ref/" + usRef + "/sinon.js");
        document.getElementById("ref-test").setAttribute("href", "preview.html?ref/" + usRef + "/test.js");
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

}());
