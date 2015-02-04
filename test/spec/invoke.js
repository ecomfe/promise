var assert = require("assert");

var Promise = require('../../src/main');

describe("Promise.invoke test.", function () {
    specify("return normal value", function (done) {
        var onFulfilledCalled = false;
        var value = 0;
        var d = Promise.invoke(function onFulfilled() {
            onFulfilledCalled = true;
            return 1;
        });

        assert.strictEqual(onFulfilledCalled, true);

        d = d.then(function (v) {
            value = v;
        }).then(null, function (reason) {
            assert.fail(reason, null, 'this should not be executed');
        });

        assert.strictEqual(value, 0);

        d.then(function () {
            assert.strictEqual(value, 1);
            value = 0;
        });

        setTimeout(function () {
            assert.strictEqual(value, 0);
            done();
        }, 100);
    });

    specify("throw error", function (done) {
        var onRejectedCall = false;
        var value = 0;
        var d = Promise.invoke(function onFulfilled() {
            onRejectedCall = true;
            throw onRejectedCall;
        });

        assert.strictEqual(onRejectedCall, true);

        d = d.then(null, function (error) {
            assert.strictEqual(onRejectedCall, error);
            return 1;
        });

        d = d.then(function (v) {
            value = v;
            assert.strictEqual(v, 1);
            throw v;
        }).then(function (reason) {
            assert.fail(reason, null, 'this should not be executed');
        });

        d.then(null, function () {
            value = 0;
        });

        setTimeout(function () {
            assert.strictEqual(value, 0);
            done();
        }, 100);
    });

    specify("return promise", function (done) {
        var onFulfilledCalled = false;
        var value = {};
        var empty = function () {};
        var d = Promise.invoke(function onFulfilled() {
            onFulfilledCalled = true;

            var promise = new Promise(function (resolve, reject) {
                resolve(value);
            });

            promise.abort = empty;

            return promise;
        });

        assert.strictEqual(onFulfilledCalled, true);
        assert.strictEqual(d.abort, empty);

        d = d.then(function (v) {
            assert.strictEqual(v, value);
            throw v;
        }).then(function (reason) {
            assert.fail(reason, null, 'this should not be executed');
        });

        d.then(null, function (v) {
            assert.strictEqual(v, value);
            value = null;
        });

        setTimeout(function () {
            assert.strictEqual(value, null);
            done();
        }, 100);
    });
});
