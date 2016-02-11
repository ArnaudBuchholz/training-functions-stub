(function () {
    "use strict";

    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        } else if ("function" !== typeof functionToStub) {
            throw Error("Only function can be spied");
        }
        return functionToStub;
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
