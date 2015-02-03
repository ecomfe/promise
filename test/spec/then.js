var assert = require("assert");

var Promise = require('../../src/main');

describe("Promise.prototype.thenGetProperty test.", function () {
    specify("return exist property", function (done) {
        Promise.resolve({x: 1}).thenGetProperty('x').then(function (x) {
            assert.strictEqual(x, 1);
            done();
        });
    });

    specify("return non-exist property", function (done) {
        Promise.resolve({x: 1}).thenGetProperty('y').then(function (y) {
            assert.strictEqual(y, undefined);
            done();
        });
    });
});

describe("Promise.prototype.thenReturn test.", function () {
    specify("return static value", function (done) {
        var o = {};
        Promise.resolve({x: 1}).thenReturn(o).then(function (value) {
            assert.strictEqual(value, o);
            done();
        });
    });
});

describe("Promise.prototype.thenBind test.", function () {
    specify("bind a function", function (done) {
        var thisObject = {};
        var fn = function () {
            assert.strictEqual(arguments[0], 1);
            assert.strictEqual(arguments[1], 2);
            assert.strictEqual(arguments[2], 3);
            assert.strictEqual(this, thisObject);
            done();
        };
        Promise.resolve().thenBind(fn, thisObject, 1, 2, 3);
    });
});

describe("Promise.prototype.thenSwallowException test.", function () {
    specify("swallow all exceptions", function (done) {
        Promise.reject().thenSwallowException().then(done);
    });
});

