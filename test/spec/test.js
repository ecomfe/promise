mocha.setup({
    ui: "bdd",
    globals: ["console","__fxdriver_unwrapped"]
});

var assert = chai.assert;
(function(adapter) {
    if (!adapter.fulfilled) {
        adapter.fulfilled = function (value) {
            var tuple = adapter.pending();
            tuple.fulfill(value);
            return tuple.promise;
        };
    }

    if (!adapter.rejected) {
        adapter.rejected = function (reason) {
            var tuple = adapter.pending();
            tuple.reject(reason);
            return tuple.promise;
        };
    }
}(adapter));

function testFulfilled(value, test) {
    specify("already-fulfilled", function (done) {
        test(fulfilled(value), done);
    });

    specify("immediately-fulfilled", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        tuple.fulfill(value);
    });

    specify("eventually-fulfilled", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        setTimeout(function () {
            tuple.fulfill(value);
        }, 50);
    });
};

function testRejected(reason, test) {
    specify("already-rejected", function (done) {
        test(rejected(reason), done);
    });

    specify("immediately-rejected", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        tuple.reject(reason);
    });

    specify("eventually-rejected", function (done) {
        var tuple = pending();
        test(tuple.promise, done);
        setTimeout(function () {
            tuple.reject(reason);
        }, 50);
    });
};

var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;
var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var other = { other: "other" }; // a value we don't want to be strict equal to
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality
var sentinel2 = { sentinel2: "sentinel2" };
var sentinel3 = { sentinel3: "sentinel3" };

function callbackAggregator(times, ultimateCallback) {
    var soFar = 0;
    return function () {
        if (++soFar === times) {
            ultimateCallback();
        }
    };
}



