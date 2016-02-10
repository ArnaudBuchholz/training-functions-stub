describe("sinon", function () {
    "use strict";

    describe("stub", function () {

        // US1

        describe("US1 - As a developer, I want to replace a function with a function that behaves the same way in order to monitor how it is used", function () {

            it("returns a function", function () {
                var result = sinon.stub(function () {
                });
                assert("function" === typeof result);
            });

            it("always returns a function", function () {
                var result = sinon.stub();
                assert("function" === typeof result);
            });

            it("returns a function that behaves the same way", function () {
                function test () {
                    return 1;
                }
                var stubbedTest = sinon.stub(test);
                assert(stubbedTest() === test());
            });

            it("returns a function that behaves the same way - parameters passing", function () {
                function increment (value) {
                    return value + 1;
                }
                var stubbedIncrement = sinon.stub(increment);
                assert(stubbedIncrement(1) === increment(1));
            });

        });

    });

});
