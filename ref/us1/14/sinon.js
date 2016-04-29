// sinon implementation
(function () {
    "use strict";

    function _spy (functionToStub) {
        if (undefined === functionToStub || "function" === typeof functionToStub) {

        } else {
            throw new Error("Invalid parameter");
        }
    }

    window.sinon = {

        spy: _spy

    };

}());
