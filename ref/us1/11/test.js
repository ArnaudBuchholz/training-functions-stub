/**
 * Tests descriptions are written using the following pattern:
 *
 *  describe(label, function () {
 *
 *      it(testLabel, function () {
 *          // Test code, use assert function to validate a boolean condition
 *          assert(true);
 *      });
 *
 *  });
 */

describe("US1", function () {
    "use strict";

    it("is accessible through sinon.spy", function () {
        assert("function" === typeof sinon.spy);
    });

    it("accepts no parameter", function () {
        sinon.spy();
    });

    it("accepts a function parameter", function () {
        sinon.spy(function () {});
    });

    it("rejects any other parameter - boolean (true)", function () {
        var exceptionCaught;
        try {
            sinon.spy(true);
        } catch (e) {
            exceptionCaught = e;
        }
        assert(undefined !== exceptionCaught);
    });

    it("rejects any other parameter - number (42)", function () {
        var exceptionCaught;
        try {
            sinon.spy(42);
        } catch (e) {
            exceptionCaught = e;
        }
        assert(undefined !== exceptionCaught);
    });

    it("returns a function");
    it("returns a function that behaves like the parameter");
    it("returns a function that does nothing when no parameter was specified");

});
