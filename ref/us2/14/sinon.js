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
            ++result.callCount;
            return functionToStub.apply(this, arguments); //eslint-disable-line no-invalid-this
        }
        result.called = false;
        result.callCount = 0;
        return result;
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
