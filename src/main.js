/**
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file Promise 入口文件
 * @author Exodia(d_xinxin@163.com)
 */
void function (define) {

    define(
        function (require) {
            var Promise = require('./Promise');
            var enchance = require('./enchance');

            return enchance(Promise);
        }
    );

}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);

