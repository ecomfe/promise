/**
 * Promise
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file setImmediate兼容方法
 * @author otakustay
 */
void function (define) {
    define(
        function (require) {
            // 需要返回值，不能用`void`
            var global = (function () {
                return this;
            }());

            var callbackPool = {};
            var cursor = 1;

            function registerCallback(callback) {
                callbackPool[cursor] = callback;
                return cursor++;
            }

            function runCallback(tick) {
                var callback = callbackPool[tick];

                if (callback) {
                    // 别跟我说`delete`影响性能，只有在使用HiddenClass的时候`delete`才可能导致优化失效，
                    // 但这个对象本身属性数量就是不断增长/变化的（因为`cursor`递增），所以HiddenClass一开始就无法在这个对象上生效
                    delete callbackPool[tick];
                    callback();
                }
            }

            // 依次使用以下方法：
            //
            // 原生`setImmediate`方法
            // `nextTick` - 仅用于NodeJS v0.9以前版本
            // `MutationObserver`
            // `postMessage` - IE8-9，主线程内
            // `MessageChannel` - WebWorker内
            // `script.onreadystatechange` - IE6-7
            // `setTimeout` - 鬼知道是啥
            //
            // 主要参考自https://github.com/YuzuJS/setImmediate
            if (typeof global.setImmediate === 'function') {
                return require('./util').bind(global.setImmediate, global);
            }

            if (typeof global.nextTick === 'function') {
                return global.nextTick;
            }

            if (global.MutationObserver || global.webKitMutationObserver) {
                var ATTRIBUTE_NAME = 'data-promise-tick';
                var MutationObserver = global.MutationObserver || global.webKitMutationObserver;
                var ensureElementMutation = function (mutations, observer) {
                    var item = mutations[0];
                    if (item.attributeName === ATTRIBUTE_NAME) {
                        var tick = item.target.getAttribute(ATTRIBUTE_NAME);
                        runCallback(tick);
                        // 每次都是一个新的元素，所以要及时断开
                        observer.disconnect(item.target);
                    }
                };

                return function (callback) {
                    var element = document.createElement('div');
                    // 从异步来说，每个callstack应该只执行一个函数，因此这里不能共享`MutationObserver`实例，
                    // 共享的情况下，由于浏览器使用的是microtask queue，会让多次变更在一次回调中体现，导致无法保持单独的callstack
                    var observer = new MutationObserver(ensureElementMutation);
                    observer.observe(element, { attributes: true });

                    var tick = registerCallback(callback);
                    element.setAttribute(ATTRIBUTE_NAME, tick);
                };
            }


            // 要判断不在`WebWorker`内
            if (typeof postMessage === 'function' && typeof global.importScript !== 'function') {
                // 部分IE的`postMessage`的`callback`是同步触发的，要去掉这一批
                var isPostMessageAsync = true;
                var oldListener = global.onmessage;
                global.onmessage = function() {
                    isPostMessageAsync = false;
                };
                global.postMessage('', '*');
                global.onmessage = oldListener;

                if (isPostMessageAsync) {
                    var MESSAGE_PREFIX = 'promise-tick-';

                    var ensureMessage = function (e) {
                        if (e.source === global && typeof e.data === 'string' && e.data.indexOf(MESSAGE_PREFIX) === 0) {
                            var tick = e.data.substring(MESSAGE_PREFIX.length);
                            runCallback(tick);
                        }
                    };
                    if (global.addEventListener) {
                        global.addEventListener('message', ensureMessage, false);
                    }
                    else {
                        global.attachEvent('onmessage', ensureMessage);
                    }

                    return function (callback) {
                        var tick = registerCallback(callback);
                        global.postMessage(MESSAGE_PREFIX + tick, '*');
                    };
                }
            }

            if (global.MessageChannel) {
                var channel = new MessageChannel();
                channel.port1.onmessage = function (e) {
                    var tick = e.data;
                    runCallback(tick);
                };

                return function (callback) {
                    var tick = registerCallback(callback);
                    channel.port2.postMessage(tick);
                };
            }

            if ('onreadystatechange' in document.createElement('script')) {
                var documentElement = document.documentElement;
                return function (callback) {
                    var script = document.createElement('script');
                    script.onreadystatechange = function () {
                        callback();
                        // 因为`readystatechange`事件会运行多次（0-4），因此执行一次后立刻去掉
                        script.onreadystatechange = null;
                        // 移除元素避免太多
                        documentElement.removeChild(script);
                        // 避免低版本IE内存泄漏
                        script = null;
                    };

                    // 不要问为啥可以直接往`<html>`里插入，IE就是可以
                    documentElement.appendChild(script);
                };
            }

            return function (callback) {
                setTimeout(callback, 0);
            };
        }
    );
}(typeof define === 'function' && define.amd ? define
    : function (factory) { module.exports = factory(require); }, this);
