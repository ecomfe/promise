promise
=======
符合 EcmaScript6 Promise 接口规范的实现

# 测试
## node 环境
npm install & npm test

## 浏览器环境
打开run.html即可；若需要添加测试用例，需要使用 browserify 生成适合浏览器的脚本文件：

```
browserify test/spec/helpers/test-adapter.js test/spec/*.js node_modules/sinon/lib/{sinon.js,sinon/*.js} > test/test-browser.js
```

# API
## new Promise({Function} executor)

创建一个新的 Promise 对象，会执行 executor，并传入 resolve 和 reject 两个函数：
resolve(thenable)，你的 Promise 将会根据这个 “thenable” 对象的结果而返回肯定/否定结果。

resolve(obj)，Promise 将会以 obj 作为肯定结果完成；

reject(obj)， Promise 将会以 obj 作为否定结果完成，出于一致性和调试（如栈追踪）方便，obj 应该是一个 Error 对象的实例。

## Promise.prototype.then({Function | null | undefined} onFulfilled [, {Function} onRejected])
当 promise 以肯定结束时会调用 onFulfilled。 当 promise 以否定结束时会调用 onRejected。
这两个参数都是可选的，当任意一个未定义时，对它的调用会跳转到 then 链的下一个 onFulfilled/onRejected 上。
这两个回调函数均只接受一个参数，肯定结果或者否定原因。

then 会返回一个新的 Promise：

若 onFulfilled/onRejected 中返回的值不为 thenable 对象，则该 Promise 以该返回值作为肯定结果结束；

若返回值为 thenable 对象，则该 Promise 会和返回的对象保持一致的结果结束；

若回调中抛出任何错误，返回的 Promise 会以此错误作为否定结果结束。

## Promise.prototype.catch({Function} onRejected)
promise.then(undefined, onRejected) 的语法糖。

## Promise.resolve({*} value)
返回一个以 value 作为肯定结果结束的 promise 对象。

## Promise.reject({*} reason)
返回一个以 reason 作为否定原因结束的 promise 对象。

## Promise.all({Array} promises)
创建一个 Promise，当且仅当传入数组中的所有 Promise 都肯定之后才肯定，如果遇到数组中的任何一个 Promise 以否定结束，则抛出否定结果。

每个数组元素都会首先经过 Promise.cast，所以数组可以包含类 Promise 对象或者其他对象。

肯定结果是一个数组，包含传入数组中每个 Promise 的肯定结果（且保持顺序）；否定结果是传入数组中第一个遇到的否定结果。

## Promise.race({Array} promises)
创建一个 Promise，当数组中的任意对象肯定时将其结果作为肯定结束，或者当数组中任意对象否定时将其结果作为否定结束。

## Promise.cast({*} value)
将 object 转化为 标准的 Promise 对象， 当 value 已经为 标准Promise 对象时，直接返回 value，其他情况等价于 Promise.resolve(value)