/**
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file enchance Promise增强
 * @author Exodia(d_xinxin@163.com)
 */
void function (define, global) {

    define(
        function (require) {
            var u = require('./util');

            /**
             * 判断一个对象是否是一个{@link meta.Promise}对象
             *
             * 对于 primitive 值，返回 false；
             * 若 obj.then 为函数，返回 true，否则返回 false
             *
             * @param {*} obj 需要判断的对象
             * @return {boolean} 如果`obj`是{@link meta.Promise}对象，则返回`true`
             * @static
             */
            function isPromise(obj) {
                return typeof u.getThen(obj) === 'function';
            }

            /**
             * 返回一个{@link Promise}对象，
             * 当指定的模块被AMD加载器加载后，进入`resolved`状态
             *
             * @param {string[]} modules 需要加载的模块列表
             * @return {Promise}
             * @static
             */
            function promiseRequire(modules) {
                // 这个函数不实现 node 版本了，没啥意义。。
                var promise = new this(
                    function (resolve, reject) {
                        global.require(modules, resolve);
                        promise.abort = reject;
                    }
                );

                return promise;
            }

            /**
             * 无论 promise 成功或者失败，都调用传入的回调函数。
             * 回调函数不会改变 promise 的状态和值，同时也不会传递给 callback 任何值。
             * callback 会继续传递当前 promise 的状态和值给新的 promise。
             *
             *
             * 适用场景：
             * 1. 无论 promise 成功或者失败，都要移除事件
             * 2. 网络请求完成后（无论成功或者失败），隐藏菊花图
             * 3. 测试的卸载阶段
             *
             * @see https://github.com/domenic/promises-unwrapping/issues/18
             *
             * @param {Function} callback 回调函数
             * @returns {Promise}
             */
            function ensure(callback) {
                var Promise = this.constructor;
                return this.then(
                    function (value) {
                        Promise.resolve(callback()).then(
                            function () {
                                return value;
                            }
                        );
                    },
                    function (reason) {
                        Promise.resolve(callback()).then(
                            function () {
                                throw reason;
                            }
                        )
                    }
                );
            }

            /**
             * 触发传入的函数，将其返回值包装为 Promise 返回
             *
             * 函数返回普通值，则返回一个 resolved promise，提供的值为返回值
             * 函数抛出异常，则返回一个 rejected promise，提供值为抛出的异常
             * 函数返回Promise，则直接返回该Promise
             *
             * @param {Function} fn 待触发的函数
             * @param {Object | null | undefined} thisObj 函数的 this 指向
             * @param {*...} args 传递给函数的参数
             * @return {Promise}
             */
            function invoke(fn, thisObj, args) {
                try {
                    args = [].slice.call(arguments, 2);
                    var value = fn.apply(thisObj, args);
                    return this.resolve(value);
                }
                catch (e) {
                    return this.reject(e);
                }
            }

            return function (Promise) {
                Promise.isPromise = isPromise;
                Promise.require = promiseRequire;
                Promise.invoke = invoke;

                Promise.prototype['finally'] = ensure;

                // 来几个alias，要不 es3 下用着烦
                Promise.prototype.ensure = ensure;
                Promise.prototype.fail = Promise.prototype['catch'];

                return Promise;
            };
        }
    );

}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);

