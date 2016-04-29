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

    [
        true,
        42,
        "Hello, World!"
    ].forEach(function (value) {
        it("rejects any other parameter - " + typeof value + " (" + value.toString() + ")", function () {
            var exceptionCaught;
            try {
                sinon.spy(value);
            } catch (e) {
                exceptionCaught = e;
            }
            assert(undefined !== exceptionCaught);
        });
    });

    it("returns a function");
    it("returns a function that behaves like the parameter");
    it("returns a function that does nothing when no parameter was specified");

});
