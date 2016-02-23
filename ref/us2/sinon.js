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
        function result () {
            result.called = true;
            ++result.callCount;
            return functionToStub.apply(this, arguments); //eslint-disable-line no-invalid-this
        }
        result.callCount = 0;
        result.called = false;
        return result;
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
