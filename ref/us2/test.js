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

describe("sinon", function () {
    "use strict";

    describe("US1", function () {

        it("is accessible through sinon.spy", function () {
            assert("undefined" !== typeof sinon);
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

        it("returns a function that behaves like the parameter", function () {
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

        it("returns a function that does nothing when no parameter was specified", function () {
            var spiedTest = sinon.spy();
            assert(undefined === spiedTest());
            assert(undefined === spiedTest(1));
            assert(undefined === spiedTest(1, 2));
            assert(undefined === spiedTest(1, 2, 3));
        });

    });

    describe("US2", function () {

        function generateTest (checkNumberOfCall) {
            it("was not called never", function () {
                var spiedTest = sinon.spy();
                checkNumberOfCall(spiedTest, 0);
            });

            it("was called once", function () {
                var spiedTest = sinon.spy();
                spiedTest();
                checkNumberOfCall(spiedTest, 1);
            });

            it("was called 10 times - synchronously", function () {
                var spiedTest = sinon.spy();
                var count = 10;
                while (count--) {
                    spiedTest();
                }
                checkNumberOfCall(spiedTest, 10);
            });

            it("was called 10 times - asynchronously", function (done) {
                var spiedTest = sinon.spy();
                var count = 10;
                var promises = [];
                while (count--) {
                    promises.push(new Promise(function (resolve/*, reject*/) { //eslint-disable-line no-loop-func
                        setTimeout(function () {
                            spiedTest();
                            resolve();
                        }, 0);
                    }));
                }
                Promise.all(promises)
                    .then(function () {
                        try {
                            checkNumberOfCall(spiedTest, 10);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            });

        }

        describe("it exposes the property \"called\" the indicates if the function was called", function () {

            generateTest(function (spiedFunc, expectedNumberOfCount) {
                var expectedCalled = 0 !== expectedNumberOfCount;
                assert(expectedCalled === spiedFunc.called);
            });

        });

        describe("it exposes the property \"callCount\" that indicates how often the function was called", function () {

            generateTest(function (spiedFunc, expectedNumberOfCount) {
                assert(expectedNumberOfCount === spiedFunc.callCount);
            });

        });

    });

});
