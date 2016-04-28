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
            element.innerHTML = "<img src=\"down.png\">" + htmlContent;
        } else {
            element.innerHTML = "<img src=\"up.png\">";
        }
    }

    function _getEslintStatus (info) {
        if (0 !== info.eslint.length) {
            return info.eslint.reduce(function (a, b) {
                return a + b.messages.length;
            }, 0) + " messages";
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
