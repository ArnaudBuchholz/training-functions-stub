### User Story 1

As a developer, I want to substitute a function with a new one in order to gather information from its use

## Acceptance criteria

* it is accessible through sinon.spy
* it accepts no parameter
* it accepts a function parameter
* it rejects any other parameter
* it returns a function
* it returns a function that behaves like the parameter
* it returns a function that does nothing when no parameter was specified

## Lesson Objectives

* Build short test cases
* Factorize repeatable tests (like the "rejects any other parameter")
* Use the smallest implementation required
* [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)
* [The Revealing Module Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)
* Parameter testing
