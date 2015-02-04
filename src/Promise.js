/**
 * Promise
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file Promise
 * @author Exodia(d_xinxin@163.com)
 */
void function (define, global, undefined) {
    define(
        function (require) {
            var u = require('./util');
            var PromiseCapacity = require('./PromiseCapacity');

            /**
             * 创建一个新的 Promise 对象，会执行 executor，并传入 resolve 和 reject 两个函数：
             * resolve(thenable)，你的 Promise 将会根据这个 “thenable” 对象的结果而返回肯定/否定结果
             * resolve(obj)，你的 Promise 将会以 obj 作为肯定结果完成
             * reject(obj)， 你的 Promise 将会以 obj 作为否定结果完成。
             * 出于一致性和调试（如栈追踪）方便，obj 应该是一个 Error 对象的实例。
             * 构造器的回调函数中抛出的错误会被立即传递给 reject()。
             *
             * @constructor
             * @param {Function} executor
             */
            function Promise(executor) {
                if (typeof executor !== 'function') {
                    throw new TypeError('Promise resolver undefined is not a function');
                }

                // 虽然 github 的规范说可以直接作为函数调用，但是需要判断各种内部状态，想直接实现而不暴露给使用者是困难的，
                // 所以暂时先不支持直接调用，必须通过构造函数方式调用：
                // https://github.com/domenic/promises-unwrapping
                if (!(this instanceof Promise)) {
                    throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, '
                        + 'this object constructor cannot be called as a function.');
                }

                var capacity = new PromiseCapacity(this);
                // 不想将私有状态挂在 promise 上，所以只能动态绑定了。
                this.then = u.bind(capacity.then, capacity);
                executor(u.bind(capacity.resolve, capacity), u.bind(capacity.reject, capacity));
            }

            /**
             * 当 promise 以肯定结束时会调用 onFulfilled。 当 promise 以否定结束时会调用 onRejected。
             * 这两个参数都是可选的，当任意一个未定义时，对它的调用会跳转到 then 链的下一个 onFulfilled/onRejected 上。
             * 这两个回调函数均只接受一个参数，肯定结果或者否定原因。
             * 当 Promise 肯定结束之后，then 会返回一个新的 Promise，
             * 这个 Promise 相当于你从 onFulfilled/onRejected 中返回的值。
             * 如果回调中抛出任何错误，返回的 Promise 也会以此错误作为否定结果结束。
             *
             * @member Promise
             * @param {Function | null | undefined} onFulfilled
             * @param {Function | null | undefined} onReject
             * @returns {Promise}
             */
            Promise.prototype.then = function (onFulfilled, onReject) { };

            /**
             * promise.then(undefined, onRejected) 的语法糖。
             *
             * @member Promise
             * @param {Function} onRejected
             * @returns {Promise}
             */
            Promise.prototype['catch'] = function (onRejected) {
                return this.then(null, onRejected);
            };

            Promise.resolve = function (value) {
                return new Promise(function (resolve) { resolve(value); });
            };

            Promise.reject = function (obj) {
                return new Promise(function (resolve, reject) { reject(obj); });
            };

            /**
             * 创建一个 Promise，当且仅当传入数组中的所有 Promise 都肯定之后才肯定，
             * 如果遇到数组中的任何一个 Promise 以否定结束，则抛出否定结果。
             * 每个数组元素都会首先经过 Promise.cast，所以数组可以包含类 Promise 对象或者其他对象。
             * 肯定结果是一个数组，包含传入数组中每个 Promise 的肯定结果（且保持顺序）；
             * 否定结果是传入数组中第一个遇到的否定结果。
             *
             * @static
             * @member Promise
             * @param {Array} promises
             */
            Promise.all = function (promises) {
                var Promise = this;

                if (!u.isArray(promises)) {
                    throw new TypeError('You must pass an array to all.');
                }

                return new Promise(function (resolve, reject) {
                    var results = [];
                    var remaining = promises.length;
                    var promise = null;

                    if (remaining === 0) {
                        resolve([]);
                    }

                    function resolver(index) {
                        return function (value) {
                            resolveAll(index, value);
                        };
                    }

                    function resolveAll(index, value) {
                        results[index] = value;
                        if (--remaining === 0) {
                            resolve(results);
                        }
                    }

                    for (var i = 0, len = promises.length; i < len; i++) {
                        promise = promises[i];
                        var then = u.getThen(promise);
                        if (typeof then === 'function') {
                            promise.then(resolver(i), reject);
                        }
                        else {
                            resolveAll(i, promise);
                        }
                    }
                });
            };

            /**
             * 创建一个 Promise，当数组中的任意对象肯定时将其结果作为肯定结束，或者当数组中任意对象否定时将其结果作为否定结束。
             *
             * @static
             * @member Promise
             * @param {Array} promises
             * @returns {Promise}
             */
            Promise.race = function (promises) {
                var Promise = this;

                if (!u.isArray(promises)) {
                    throw new TypeError('You must pass an array to race.');
                }

                return new Promise(function (resolve, reject) {
                    for (var i = 0, len = promises.length; i < len; i++) {
                        var promise = promises[i];
                        var then = u.getThen(promise);
                        if (typeof then === 'function') {
                            then.call(promise, resolve, reject);
                        }
                        else {
                            resolve(promise);
                        }
                    }
                });
            };

            return Promise;
        }
    );

}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);

