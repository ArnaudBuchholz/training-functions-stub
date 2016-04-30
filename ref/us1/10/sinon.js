// sinon implementation
(function () {
    "use strict";

    function _spy (functionToStub) {
        if ("boolean" === typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
