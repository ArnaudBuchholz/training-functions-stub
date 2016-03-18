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
        "Hello World!"
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

    it("returns a function", function () {
        assert("function" === typeof sinon.spy(function () {}));
    });

    it("returns a function - no parameter", function () {
        assert("function" === typeof sinon.spy());
    });

    it("returns a function that behaves like the parameter - return value", function () {
        function test () {
            return 1;
        }
        var spiedTest = sinon.spy(test);
        assert(spiedTest() === test());
    });

    it("returns a function that behaves like the parameter - parameters passing", function () {
        function test () {
            var sum = 0,
                len = arguments.length,
                idx;
            for (idx = 0; idx < len; ++idx) {
                sum += arguments[idx];
            }
            return sum;
        }
        var spiedTest = sinon.spy(test);
        assert(spiedTest(1, 2, 3) === test(1, 2, 3));
    });

    it("returns a function that behaves like the parameter - forwards this", function () {
        var obj = {
            method: function () {
                assert(this === obj);
            }
        };
        obj.method = sinon.spy(obj.method);
        obj.method();
    });

    it("returns a function that behaves like the parameter - exception handling", function () {
        function fail () {
            throw new Error("We learn from failure, not from success");
        }
        var exceptionCaught;
        try {
            sinon.spy(fail)();
        } catch (e) {
            exceptionCaught = e;
        }
        assert(exceptionCaught instanceof Error);
        assert(exceptionCaught.message === "We learn from failure, not from success");
    });

    it("returns a function that does nothing when no parameter was specified", function () {
        var spiedTest = sinon.spy();
        assert(undefined === spiedTest());
        assert(undefined === spiedTest(1));
        assert(undefined === spiedTest(1, 2));
        assert(undefined === spiedTest(1, 2, 3));
    });

});
