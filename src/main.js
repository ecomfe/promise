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
            var enhance = require('./enhance');
            var then = require('./then');
            var hook = require('./hook');

            return hook(then(enhance(Promise)));
        }
    );

  /* eslint-disable brace-style */
  /* global module: true */
}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);

