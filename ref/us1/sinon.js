// sinon implementation
(function () {
    "use strict";

    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        } else if ("function" !== typeof functionToStub) {
            throw Error("Invalid parameter");
        }
        return functionToStub;
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
