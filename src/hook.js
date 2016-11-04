/**
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file hook promise 钩子功能
 * @author Exodia(d_xinxin@163.com)
 */
void function (define) {

    define(
        function (require) {

            return function (Promise) {
                // 加个默认的错误钩子先
                Promise.onReject = function (reason) {
                    typeof console !== 'undefined' && console.error(reason);
                };
                return Promise;
            }
        }
    );

    /* eslint-disable brace-style */
    /* global module: true */
}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);