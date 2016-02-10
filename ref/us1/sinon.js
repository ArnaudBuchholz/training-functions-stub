(function () {
    "use strict";

    function _stub (functionToStub) {
        return functionToStub;
    }

    // revealing pattern
    window.sinon = {

        stub: _stub

    };

}());
