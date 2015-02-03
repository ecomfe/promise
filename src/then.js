/**
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file then方法增强
 * @author otakustay(otakustay@icloud.com)
 */
void (function (define, global) {

    define(
        function (require) {
            var u = require('./util');

            function getProperty(propertyName) {
                return function (result) {
                    return result[propertyName];
                };
            }

            function returnValue(value) {
                return function () {
                    return value;
                };
            }

            function noop() {
            }

            return function (Promise) {
                Promise.prototype.thenGetProperty = function (propertyName) {
                    return this.then(getProperty(propertyName));
                };

                Promise.prototype.thenReturn = function (value) {
                    return this.then(returnValue(value));
                };

                Promise.prototype.thenBind = function () {
                    return this.then(u.bind.apply(u, arguments));
                };

                Promise.prototype.thenSwallowException = function () {
                    /* eslint-disable fecs-dot-notation */
                    return this['catch'](noop);
                    /* eslint-enable fecs-dot-notation */
                };

                return Promise;
            };
        }
    );
/* eslint-disable brace-style */
/* global module: true */
}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this));

