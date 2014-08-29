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
             * 返回一个{@link meta.Promise}对象，
             * 当指定的模块被AMD加载器加载后，进入`resolved`状态
             *
             * @param {string[]} modules 需要加载的模块列表
             * @return {meta.Promise}
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
             * 无论 promise 成功或者失败，都调用传入的函数
             *
             * @param {Function} callback 回调函数
             * @returns {meta.Promise}
             */
            function ensure(callback) {
                return this.then(callback, callback);
            }

            return function (Promise) {
                Promise.isPromise = isPromise;
                Promise.require = promiseRequire;
                Promise.prototype.ensure = ensure;

                return Promise;
            };
        }
    );

}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);