# Step 1

* Open src\test.js
* Type
```Javascript
describe("sinon", function () {
    "use strict";

    describe("US1", function () {

    });

});
```

* Explain [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
* Open ref\us1\README.md
* Copy the acceptance criteria
* Open src\test.js
* Paste them as below
```Javascript
describe("sinon", function () {
    "use strict";

    describe("US1", function () {

        * it is accessible through sinon.spy
        * it accepts no parameter
        * it accepts a function parameter
        * it rejects any other parameter
        * it returns a function
        * it returns a function that behaves like the parameter
        * it returns a function that does nothing when no parameter was specified

    });

});
```

* Paste them as below
* Select the pasted text
* Use CTRL+R to replace text
* Search \* it (.*)
* Replace with it("$1");
* The result should be as below
```Javascript
describe("sinon", function () {
    "use strict";

    describe("US1", function () {

        it("is accessible through sinon.spy");
        it("accepts no parameter");
        it("accepts a function parameter");
        it("rejects any other parameter");
        it("returns a function");
        it("returns a function that behaves like the parameter");
        it("returns a function that does nothing when no parameter was specified");

    });
});
```

* Show Mocha, explain the [pending tests](https://mochajs.org/#pending-tests)

# Step 2

* Open src\test.js
* Fill the following test
```Javascript
        it("is accessible through sinon.spy", function () {
            assert("function" === typeof sinon.spy);
        });
```

* Show Mocha

* Open src\sinon.js
* Type
```Javascript
(function () {
    "use strict";

    function _spy () {

    }

    window.sinon = {

        spy: _spy

    };

}());
```

* Explain [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)
* Explain [the revealing module pattern](https://www.pluralsight.com/blog/software-development/revealing-module-pattern-structuring-javascript-code-part-iii)
* Show Mocha

# Step 3

* Open src\test.js
* Fill the following test
```Javascript
        it("accepts no parameter", function () {
            sinon.spy();
        });
```

* Show Mocha

# Step 3

* Open src\test.js
* Fill the following test
```Javascript
        it("accepts a function parameter", function () {
            sinon.spy(function () {});
        });
```

* Show Mocha

# Step 4

* Open src\test.js
* Fill the following test
```Javascript
        it("rejects any other parameter - boolean (true)", function () {
            var exceptionCaught;
            try {
                sinon.spy(true);
            } catch (e) {
                exceptionCaught = e;
            }
            assert(undefined !== exceptionCaught);
        });
```

* Show Mocha
* Open src\sinon.js
* Change the following
```Javascript
    function _spy (functionToStub) {
        if ("boolean" === typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
    }
```
* Show Mocha

# Step 5

* Open src\test.js
* Copy the previous test and change the type and the value
```Javascript
        it("rejects any other parameter - number (42)", function () {
            var exceptionCaught;
            try {
                sinon.spy(42);
            } catch (e) {
                exceptionCaught = e;
            }
            assert(undefined !== exceptionCaught);
        });
```

* Show Mocha
* Explain [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
* Refactor the code like the following
```Javascript
        [
            true,
            42
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
```

* Add "Hello World!" to the test cases
```Javascript
        [
            true,
            42,
            "Hello World!"
        ].forEach(function (value) {
```

* Show Mocha

* Open src\sinon.js
* Change the following
```Javascript
    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        }
        if ("function" !== typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
    }
```

* Show Mocha

# Step 6

* Open src\test.js
* Fill the following test (split in two)
```Javascript
        it("returns a function", function () {
            assert("function" === typeof sinon.spy(function () {}));
        });

        it("returns a function - no parameter", function () {
            assert("function" === typeof sinon.spy());
        });
```

* Show Mocha
* Open src\sinon.js
* Change the following
```Javascript
    function _nop () {}

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        }
        if ("function" !== typeof functionToStub) {
            throw new Error("Invalid parameter");
        }
        return functionToStub;
    }
```

* Show Mocha

# Step 7

* Open src\test.js
* Fill the following test
```Javascript
        it("returns a function that behaves like the parameter", function () {
            function test () {
                return 1;
            }
            var spiedTest = sinon.spy(test);
            assert(spiedTest() === test());
        });
```

* Show Mocha
* Add another test
```Javascript
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
```

* Alternate version:
```Javascript
        it("returns a function that behaves like the parameter - parameters passing", function () {
            function sum () {
                return [].slice.call(arguments).reduce(function (a, b) {
                    return a + b;
                });
            }
            assert(6 === sum(1, 2, 3));
            var spiedSum = sinon.spy(sum);
            assert(6 === spiedSum(1, 2, 3));
        });
```

# Step 8

* Open src\test.js
* Fill the following test
```Javascript
        it("returns a function that does nothing when no parameter was specified", function () {
            var spiedTest = sinon.spy();
            assert(undefined === spiedTest());
            assert(undefined === spiedTest(1));
            assert(undefined === spiedTest(1, 2));
            assert(undefined === spiedTest(1, 2, 3));
        });
```

* Show Mocha
