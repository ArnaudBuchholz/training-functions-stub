describe("sinon", function () {
    "use strict";

    describe("US1", function () {

        it("is accessible through sinon.spy", function () {
            assert("object" === typeof sinon);
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
            "string"

        ].forEach(function (value) {
            it("rejects any other parameter - " + typeof value, function () {
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
            var result = sinon.spy(function () {});
            assert("function" === typeof result);
        });

        it("returns a function - no parameter", function () {
            var result = sinon.spy();
            assert("function" === typeof result);
        });

        it("returns a function that behaves like the parameter", function () {
            function test () {
                return 1;
            }
            var spiedTest = sinon.spy(test);
            assert(spiedTest() === test());
        });

        it("returns a function that behaves the same way - parameters passing", function () {
            function increment (value) {
                return value + 1;
            }
            var spiedIncrement = sinon.spy(increment);
            assert(spiedIncrement(1) === increment(1));
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
