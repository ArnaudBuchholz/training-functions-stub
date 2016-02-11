describe("sinon", function () {
    "use strict";

    describe("US1", function () {

        it("is accessible through sinon.spy", function () {
            assert("object" === typeof sinon);
            assert("function" === typeof sinon.spy);
        });

        it("accepts no parameter", function () {
            var result = sinon.spy();
        });

        it("accepts a function parameter", function () {
            var result = sinon.spy(function () {});
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

});
