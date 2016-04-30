// sinon implementation
(function () {
    "use strict";

    function _spy (functionToStub) {
        if (undefined !== functionToStub && "function" !== typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
