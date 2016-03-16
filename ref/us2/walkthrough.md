# Step 1

* Open src\test.js
* Put the existing code in a describe
```Javascript
describe("sinon.spy", function () {
    "use strict";

    describe("US1", function () {
        /*...*/
    });

});
```

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
        describe("it exposes the property \"called\" the indicates if the function was called", function () {

        });

        describe("it exposes the property \"callCount\" that indicates how often the function was called", function () {
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

* Modify _spy with:
```Javascript
        function result () {
            result.called = true;
            return functionToStub.apply(this, arguments); //eslint-disable-line no-invalid-this
        }
```

* Explain that we miss a test case to validate this forwarding
* Open src\test.js
* Add inside US1
```Javascript
        it("forwards this", function () {
            var obj = {
                method: function () {
                    assert(this === obj);
                }
            };
            obj.method = sinon.spy(obj.method);
            obj.method();
        });
```

# Step 4

* Open src\test.js
* Add
```Javascript
            var COUNT = 10;

            it("was called " + COUNT + " times - synchronously", function () {
                var spiedTest = sinon.spy(),
                    count = COUNT;
                while (count--) {
                    spiedTest();
                }
                assert(spiedTest.called);
            });
```

* Show Mocha

# Step 5

* Open src\test.js
* Add
```Javascript
            it("was called " + COUNT + " times - asynchronously", function () {
                var spiedTest = sinon.spy(),
                    count = COUNT;
                while (count--) {
                    window.setTimeout(spiedTest, 10);
                }
                assert(spiedTest.called);
            });
```

* Show Mocha
* How do you debug this?
* Modify the code to stop at the beginning of the test and when the spiedTest is called
* Modify using [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  And [done handler](https://mochajs.org/#asynchronous-code)
```Javascript
            it("was called " + COUNT + " times - asynchronously", function (done) {
                var spiedTest = sinon.spy(),
                    count = COUNT,
                    promises = [];
                while (count--) {
                    promises.push(new Promise(function (resolve/*, reject*/) {
                        window.setTimeout(function () {
                            spiedTest();
                            resolve();
                        }, 10);
                    }));
                }
                Promise.all(promises).then(function () {
                    assert(spiedTest.called);
                    done();
                });
            });
```

* Show Mocha
* Explain [eslint error no-loop-func](http://eslint.org/docs/rules/no-loop-func)

* Modify to
```Javascript
            it("was called " + COUNT + " times - asynchronously", function (done) {
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
                    try {
                        assert(spiedTest.called);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });
```

* Show Mocha

# Step 6

* DRY to handle callCount
* Open src\test.js
* Add
```Javascript
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

            it("was called " + COUNT + " times - synchronously", function () {
                var spiedTest = sinon.spy(),
                    count = COUNT;
                while (count--) {
                    spiedTest();
                }
                assert(verify(spiedTest, COUNT));
            });

            it("was called " + COUNT + " times - asynchronously", function (done) {
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

        describe("it exposes the property \"called\" the indicates if the function was called", function () {

            generateTests(function (spiedTest, expectedCallCount) {
                return (0 !== expectedCallCount) === spiedTest.called;
            });

        });
```

* Show Mocha
* Explain [eslint error no-extra-parens](http://eslint.org/docs/rules/no-extra-parens)
* Modify to
```Javascript

            generateTests(function (spiedTest, expectedCallCount) {
                return 0 !== expectedCallCount === spiedTest.called;
            });

        });
```

* Then add:
```Javascript
        describe("it exposes the property \"callCount\" that indicates how often the function was called", function () {

            generateTests(function (spiedTest, expectedCallCount) {
                return expectedCallCount === spiedTest.callCount;
            });

        });
```

* Show Mocha
* Open src\sinon.js
* Modify
```Javascript
        function result () {
            result.called = true;
            ++result.callCount;
            return functionToStub.apply(this, arguments); //eslint-disable-line no-invalid-this
        }
        result.called = false;
        result.callCount = 0;
```
