(function () {
    "use strict";

    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        } else if ("function" !== typeof functionToStub) {
            throw Error("Only function can be spied");
        }
        function result (a) {
            result.called = true;
            ++result.callCount;
            return functionToStub(a);
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
