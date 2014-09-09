var assert = require("assert");

var adapter = global.adapter;
var deferred = adapter.deferred;

describe("custom enhancement sync mode test.", function () {
    var d;
    beforeEach(function () {
        d = deferred();
        d.promise.syncModeEnabled = true;
    });

    specify("sync mode resolve", function (done) {
        var onFulfilledCalled = false;
        var value = 0;
        d.promise.then(function onFulfilled() {
            onFulfilledCalled = true;
        });

        d.resolve();
        assert.strictEqual(onFulfilledCalled, true);

        d = d.promise.then(function () {
            return 1;
        });

        d = d.then(function (v) {
            value = v;
        }).then(null, function (reason) {
            assert.fail(reason, null, 'this should not be executed');
        });

        assert.strictEqual(value, 1);

        d.syncModeEnabled = false;
        d.then(function () {
            value = 0;
        });

        assert.strictEqual(value, 1);

        setTimeout(function () {
            assert.strictEqual(value, 0);
            done();
        }, 100);
    });

    specify("sync mode reject", function (done) {
        var onRejectedCall = false;
        var value = 0;
        d.promise.then(null, function onFulfilled() {
            onRejectedCall = true;
        });

        d.reject();
        assert.strictEqual(onRejectedCall, true);

        d = d.promise.then(null, function () {
            return 1;
        });

        d = d.then(function (v) {
            value = v;
            throw v;
        }).then(function (reason) {
            assert.fail(reason, null, 'this should not be executed');
        });

        assert.strictEqual(value, 1);

        d.syncModeEnabled = false;
        d.then(null, function () {
            value = 0;
        });

        assert.strictEqual(value, 1);

        setTimeout(function () {
            assert.strictEqual(value, 0);
            done();
        }, 100);
    });
});
