# Step 1

* Open src\test.js
* Add after the US1
```Javascript
    describe("US2", function () {

    });
```

* Open ref\us2\README.md
* Copy the acceptance criteria
* Open src\test.js
* Paste them as following
```Javascript
        describe("exposes the property \"called\" the indicates if the function was called", function () {

        });

        describe("exposes the property \"callCount\" that indicates how often the function was called", function () {
        });
```

# Step 2

* Open src\test.js
* Add
```Javascript
            it("was never called", function () {
                var spiedTest = sinon.spy();
                assert(!spiedTest.called);
            });
```

* Show Mocha
* Explain what happens when accessing a non existing member
* Explain [falsy values](https://developer.mozilla.org/fr/docs/Glossary/Falsy)

# Step 3

* Open src\test.js
* Add
```Javascript
            it("was called once", function () {
                var spiedTest = sinon.spy();
                spiedTest();
                assert(spiedTest.called);
            });
```

* Show Mocha
* Open src\sinon.js
* We could add a member named called to the initial function but
    * We modify the function: this may conflict with any members set on the function (see [memoization](https://addyosmani.com/blog/faster-javascript-memoization/))
    * How do you set it to true when the function is called?
    * We need to wrap this function inside a new one

* Modify _spy with:
```Javascript
    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        } else if ("function" !== typeof functionToStub) {
            throw Error("Invalid parameter");
        }
        function result () {
            result.called = true;
            functionToStub();
        }
        result.called = false;
        return result;
    }
```

* Show Mocha
* Unit tests are broken
    * Result value is not transmitted
    * Parameters are not transmitted

* Modify _spy with:
```Javascript
        function result () {
            result.called = true;
            return functionToStub();
        }
```

* Show Mocha
* Unit tests are broken
    * Parameters are not transmitted

* Modify _spy with:
```Javascript
        function result () {
            result.called = true;
            return functionToStub.apply(this, arguments);
        }
```

* Show Mocha
* Explain [eslint error no-invalid-this](http://eslint.org/docs/rules/no-invalid-this)
