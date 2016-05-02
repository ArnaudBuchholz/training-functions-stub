// sinon implementation
(function () {
    "use strict";

    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        } else if ("function" !== typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
        function result () {
            result.called = true;
            return functionToStub();
        }
        result.called = false;
        return result;
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
