(function () {
    "use strict";

    function _applyUsRef () {
        alert(window.usRef);
    }

    window.addEventListener("load", function () {

        document.getElementById("play").addEventListener("click", _applyUsRef);

    });

}());
