(function () {
    "use strict";
    /*global xhrGet*/

    function _applyUsRef () {
        var gearbox = document.getElementById("gearbox"),
            play = document.getElementById("play");
        play.className = "hidden";
        gearbox.className = "";
        function show () {
            play.className = "";
            gearbox.className = "hidden";
        }
        xhrGet("/copy?" + window.usRef)
            .then(function (copyAnswer) {
                if ("false" === copyAnswer) {
                    show();
                    alert("Copy failed");
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

    });

}());
