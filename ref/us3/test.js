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

        it("forwards this", function () {
            var obj = {
                method: function () {
                    assert(this === obj);
                }
            };
            obj.method = sinon.spy(obj.method);
            obj.method();
        });

    });

    describe("US2", function () {

        // function verify (spiedTest, expectedCallCount)
        function generateTests (verify) {
            it("was never called", function () {
                var spiedTest = sinon.spy();
                assert(verify(spiedTest, 0));
            });

            it("was called once", function () {
                var spiedTest = sinon.spy();
                spiedTest();
                assert(verify(spiedTest, 1));
            });

            var COUNT = 10;

            it("was called 10 times - synchronously", function () {
                var spiedTest = sinon.spy(),
                    count = COUNT;
                while (count--) {
                    spiedTest();
                }
                assert(verify(spiedTest, COUNT));
            });

            it("was called 10 times - asynchronously", function (done) {
                var spiedTest = sinon.spy(),
                    count = COUNT,
                    promises = [];
                function getPromise () {
                    return new Promise(function (resolve/*, reject*/) {
                        setTimeout(function () {
                            spiedTest();
                            resolve();
                        }, 10);
                    });
                }
                while (count--) {
                    promises.push(getPromise());
                }
                Promise.all(promises).then(function () {
                    Promise.all(promises).then(function () {
                        try {
                            assert(verify(spiedTest, COUNT));
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
                });
            });
        }

        describe("exposes the property \"called\" the indicates if the function was called", function () {

            generateTests(function (spiedTest, expectedCallCount) {
                return 0 !== expectedCallCount === spiedTest.called;
            });

        });

        describe("exposes the property \"callCount\" that indicates how often the function was called", function () {

            generateTests(function (spiedTest, expectedCallCount) {
                return expectedCallCount === spiedTest.callCount;
            });

        });

    });

    describe("US3", function () {

        describe("exposes a method \"getCall\" that retrieves an object containing each call info", function () {

            function test (firstParam) {
                if (0 === firstParam) {
                    return "Hello World!";
                }
            }

            var spiedTest;

            beforeEach(function () {
                spiedTest = sinon.spy(test);
            });

            it("returns null if never called", function () {
                assert(0 === spiedTest.callCount);
                assert(null === spiedTest.getCall(0));
            });

            describe("First simple call", function () {

                var firstCall;

                beforeEach(function () {
                    var result = spiedTest(0);
                    assert("Hello World!" === result);
                    firstCall = spiedTest.getCall(0);
                });

                it("returns an object", function () {
                    assert("object" === typeof firstCall);
                });

                it("contains the list of parameters", function () {
                    assert(firstCall.calledWith(0));
                    assert(firstCall.calledWithExactly(0));
                });

            });


        });

    });

});
