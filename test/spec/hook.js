var assert = require("assert");

var Promise = require('../../src/main');

describe("Promise hook test.", function () {
    specify("onResolve test", function (done) {
        var result = null;
        var called = false;
        Promise.onResolve(function (value) {
            result = value;
            called = true;
        });

        var promise = Promise.resolve({});

        assert.strictEqual(called, true);

        promise.then(
            function (value) {
                assert.strictEqual(result, value);
                done();
            },
            function (reason) {
                assert.fail(reason, null, 'this should not be executed');
            }
        );
    });

    specify("onReject test", function (done) {
        var result = null;
        var called = false;
        Promise.onReject(function (value) {
            result = value;
            called = true;
        });

        var promise = Promise.reject({});

        assert.strictEqual(called, true);

        promise.then(
            function (value) {
                assert.fail(value, null, 'this should not be executed');
            },
            function (value) {
                assert.strictEqual(result, value);
                done();
            });
    });
});
