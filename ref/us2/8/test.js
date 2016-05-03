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

describe("sinon.spy", function () {
    "use strict";

    describe("US1", function () {

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
            "Hello, World!",
            {}
        ].forEach(function (value) {
            it("rejects any other parameter - " + typeof value + " (" + JSON.stringify(value) + ")", function () {
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

        it("returns a function that behaves like the parameter - result", function () {
            function test () {
                return 1;
            }

            assert(1 === test());
            var spiedTest = sinon.spy(test);
            assert(1 === spiedTest());
        });

        it("returns a function that behaves like the parameter - parameters", function () {
            function sum () {
                return [].slice.call(arguments).reduce(function (a, b) {
                    return a + b;
                });
            }

            assert(6 === sum(1, 2, 3));
            var spiedSum = sinon.spy(sum);
            assert(6 === spiedSum(1, 2, 3));
        });

        it("returns a function that behaves like the parameter - exception", function () {
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

        it("returns a function that behaves like the parameter - this", function () {
            var wasCalled = false,
                obj = {
                    method: function () {
                        wasCalled = true;
                        assert(this === obj);
                    }
                };
            obj.method = sinon.spy(obj.method);
            obj.method();
            assert(true === wasCalled);
        });

        it("returns a function that does nothing when no parameter was specified", function () {
            var spiedTest = sinon.spy();
            assert(undefined === spiedTest());
            assert(undefined === spiedTest(1));
            assert(undefined === spiedTest(1, 2));
            assert(undefined === spiedTest(1, 2, 3));
        });

    });

    describe("US2", function () {

        describe("it exposes the property \"called\" the indicates if the function was called", function () {

            it("was never called", function () {
                var spiedTest = sinon.spy();
                assert(!spiedTest.called);
            });

            it("was called once", function () {
                var spiedTest = sinon.spy();
                spiedTest();
                assert(spiedTest.called);
            });

            var N = 10;

            it("was called " + N + " times - synchronously", function () {
                var spiedTest = sinon.spy(),
                    count = N;
                while (count--) {
                    spiedTest();
                }
                assert(spiedTest.called);
            });

        });

        describe("it exposes the property \"callCount\" that indicates how often the function was called", function () {
        });

    });

});
