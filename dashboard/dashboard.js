(function () {
    "use strict";
    /*global xhrGet*/

    var _usRef;

    function _setUsRef (usRef) {
        _usRef = usRef;
        document.getElementById("ref-sinon").setAttribute("href", "preview.html?ref/" + usRef + "/sinon.js");
        document.getElementById("ref-test").setAttribute("href", "preview.html?ref/" + usRef + "/test.js");
    }

    function _applyUsRef () {
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
                    alert("Copy failed");
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
                                show();
                            });
                    }, 500); // Don't stress the 'server'
                }
                wait();
            });
    }

    window.addEventListener("load", function () {

        document.getElementById("play").addEventListener("click", _applyUsRef);
        window.setUsRef = _setUsRef;

    });

}());
