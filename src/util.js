/**
 * Promise
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file 工具库
 * @author otakustay
 */
void function (define) {

    define(
        function (require) {
            /**
             * @class util
             *
             * 工具库
             *
             * @singleton
             */
            var util = {};

            // `bind`的实现特别使用引擎原生的，
            // 因为自己实现的`bind`很会影响调试时的单步调试，
            // 跳进一个函数的时候还要经过这个`bind`几步很烦，原生的就不会
            var nativeBind = Function.prototype.bind;
            /**
             * 固定函数的`this`变量和若干参数
             *
             * @param {Function} fn 操作的目标函数
             * @param {Mixed} thisObject 函数的`this`变量
             * @param {Mixed...} args 固定的参数
             * @return {Function} 固定了`this`变量和若干参数后的新函数对象
             */
            if (typeof nativeBind === 'function') {
                util.bind = function (fn) {
                    return nativeBind.apply(fn, [].slice.call(arguments, 1));
                };
            }
            else {
                util.bind = function (fn, thisObject) {
                    var extraArgs = [].slice.call(arguments, 2);
                    return function () {
                        var args = extraArgs.concat([].slice.call(arguments));
                        return fn.apply(thisObject, args);
                    };
                };
            }

            util.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };

            util.getThen = function (promise) {
                return promise && (typeof promise === 'object' || typeof promise === 'function') && promise.then;
            };

            return util;
        }
    );
}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);
