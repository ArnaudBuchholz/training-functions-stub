// sinon implementation
(function () {
    "use strict";

    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        }
        if ("function" !== typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
    }

    window.sinon = {

        spy: _spy

    };

}());
