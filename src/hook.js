/**
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file hook promise 钩子功能
 * @author Exodia(d_xinxin@163.com)
 */
void function (define) {

    define(
        function (require) {

            var PromiseCapacity = require('./PromiseCapacity');

            return function (Promise) {

                /**
                 * 设置 promise reject 时的回调
                 *
                 * @param {Function} handler 回调函数，作用域指向当前的 promise，传入值为 reject reason
                 */
                Promise.onReject = function (handler) {
                    if (typeof handler === 'function') {
                        PromiseCapacity.onReject = handler;
                    }
                };

                 /**
                 * 设置 promise resolve 时的回调
                 *
                 * @param {Function} handler 回调函数，作用域指向当前的 promise，传入值为 resolve value
                 */
                Promise.onResolve = function (handler) {
                    if (typeof handler === 'function') {
                        PromiseCapacity.onResolve = handler;
                    }
                };

                return Promise;
            }
        }
    );

  /* eslint-disable brace-style */
  /* global module: true */
}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);