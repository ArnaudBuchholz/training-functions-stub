describe("Test", function () {
    "use strict";

    it("was loaded properly", function () {
        assert(true);
    });

    it("fails properly", function () {
        assert(false);
    });

    it("supports asynchronism", function (done) {
        var a = 0;
        setTimeout(function () {
            assert(a === 1);
            done();
        }, 100);
        a = 1;
    });

    it("fails asynchronously", function (done) {
        var a = 0;
        setTimeout(function () {
            assert(a === 0);
            done();
        }, 100);
        a = 1;
    });

    it("fails if done is called with a parameter", function (done) {
        setTimeout(function () {
            done("error");
        }, 100);
    });

});
