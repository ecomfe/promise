var Promise = require('../src/main');
var Mocha = require("mocha");
var path = require("path");
var fs = require("fs");
var _ = require("underscore");

// 先覆盖掉默认的打印函数
Promise.onReject(function () {});

var adapter = {
    resolved: function (v) {
        return Promise.resolve(v);
    },
    rejected: function (v) {
        return Promise.reject(v);
    },

    deferred: function () {
        var adapter = {};

        adapter.promise = new Promise(function (resolve, reject) {
            adapter.resolve = resolve;
            adapter.reject = reject;
        });
        return adapter;
    }
};


var testsDir = path.resolve(__dirname, "spec/promise-aplus-tests");

var enhancements = [
    path.resolve(__dirname, "spec/syncMode.js"),
    path.resolve(__dirname, "spec/invoke.js"),
    path.resolve(__dirname, "spec/then.js"),
    path.resolve(__dirname, "spec/hook.js")
];

function run(adapter, mochaOpts, cb) {
    if (typeof mochaOpts === "function") {
        cb = mochaOpts;
        mochaOpts = {};
    }
    if (typeof cb !== "function") {
        cb = function () { };
    }

    mochaOpts = _.defaults(mochaOpts, {timeout: 200, slow: Infinity});
    fs.readdir(testsDir, function (err, testFileNames) {
        if (err) {
            cb(err);
            return;
        }

        var mocha = new Mocha(mochaOpts);
        testFileNames.forEach(function (testFileName) {
            if (path.extname(testFileName) === ".js") {
                var testFilePath = path.resolve(testsDir, testFileName);
                mocha.addFile(testFilePath);
            }
        });
        enhancements.forEach(function (enhancement) {
            mocha.addFile(enhancement);
        });

        global.adapter = adapter;
        mocha.run(function (failures) {
            delete global.adapter;
            if (failures > 0) {
                var err = new Error("Test suite failed with " + failures + " failures.");
                err.failures = failures;
                cb(err);
            } else {
                cb(null);
            }
        });
    });
}


run(adapter, {reporter: 'dot'}, function (err) {
    console.log(err);
});
