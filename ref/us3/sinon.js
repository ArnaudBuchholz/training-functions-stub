// sinon implementation
(function () {
    "use strict";

    function _nop () {}

    function SpyCall (spy, index) {
        this._spy = spy;
        this.thisValue = spy.thisValues[index];
        this.args = spy.args[index];
        this.exception = spy.exceptions[index];
        this.returnValue = spy.returnValues[index];
    }

    SpyCall.prototype = {
        _spy: null,
        thisValue: null,
        args: [],
        exception: null,
        returnValue: undefined,

        calledWithExactly: function () {
            return this.args.every(function (arg, index) {
                return arguments[index] === arg;
            });
        },

        calledWith: function () {
            return [].slice.call(arguments).every(function (arg, index) {
                return this.args[index] === arg;
            }, this);
        }
    };

    function _spyReset () {
        this.called = false;
        this.callCount = 0;
        this.thisValues = [];
        this.args = [];
        this.exceptions = [];
        this.returnValues = [];
    }

    function _spyGetCall (index) {
        if (-1 < index && index < this.callCount) {
            return new SpyCall(this, index);
        }
        return null;
    }

    SpyCall.install = function (spy) {
        spy.reset = _spyReset;
        spy.getCall = _spyGetCall;
        spy.reset();
    };

    function _spy (functionToStub) {
        if (undefined === functionToStub) {
            functionToStub = _nop;
        } else if ("function" !== typeof functionToStub) {
            throw Error("Invalid parameter");
        }
        function result () {
            result.called = true;
            ++result.callCount;
            result.thisValues.push(this); //eslint-disable-line no-invalid-this
            result.args.push([].slice.call(arguments));
            var returnValue;
            try {
                returnValue = functionToStub.apply(this, arguments); //eslint-disable-line no-invalid-this
                result.exceptions.push(undefined);
            } catch (e) {
                result.exceptions.push(e);
                throw e;
            }
            return returnValue;
        }
        SpyCall.install(result);
        return result;
    }

    // revealing pattern
    window.sinon = {

        spy: _spy

    };

}());
