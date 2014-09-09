var Promise = require('../../../src/Promise');
global.adapter = {
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