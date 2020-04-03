## watch的两种用法

使用watch有两种方法，第一种直接调用vm.$watch，第二种是在选项中配置watch属性。

```javascript
watch: {
  msg: {
    handler: function (newValue, oldValue) {
      console.log('watch:', {
        newValue,
        oldValue
      })
    },
    immediate: true
  }
}

// or

vm.$watch('msg', function(newVal, oldVal) {
  console.log({ newVal, oldVal })
})
```

我们要去实现一个`vm.$watch`方法，`$watch`方法的话做了两件事：

1. 在 `userDef` 中分离 `handler` 和 其他的 `opts`
2. new一个Watcher，并且增加 `{ user: true }` 标记为用户watcher。

下面看代码： 
```javascript
Vue.prototype.$watch = function(expr, userDef) {
  const vm = this;
  let handler = userDef;
  const opts = { user: true }
  if (userDef.handler) {
    handler = userDef.handler;
    Object.assign(opts, userDef);
  }
  new Watcher(vm, expr, handler, opts);
}
```

## Watcher 内部实现

首先把传入的字符串做为函数返回，例如`'msg'`转化为 `util.getValue(vm, 'msg')`。

这一步非常关键，因为`new Watcher`的时候默认调用一次`get`方法，然后执行`getter`函数，这个过程会触发`msg`的`getter`，让`msg`的`dep`添加一个用户`watcher`，完成依赖收集。

```javascript
  constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    } else if (typeof exprOrFn === 'string') {
+      // 用户watcher
+      // 解析expr，取到data上的值
+      // 取值的时候完成依赖收集
+      this.getter = function () {
+        return util.getValue(vm, exprOrFn);
+      }
+    }
+   this.immediate = opts.immediate
+    // 用户添加的watcher，标记一下
+    this.user = opts.user
    this.cb = cb;
    this.opts = opts;
    this.id = id++;
    this.deps = [];
    this.depsId = new Set();
    // 我们希望在回调函数中返回一个新值，一个旧值，所以我们需要记录getter返回的值  
+    this.value = this.get();
+    if (this.immediate) {
+      this.cb(this.value)
+    }
  }
```

完成依赖收集后，当我们的数据发生变化后，调用`Watcher`的`run`方法，进行值的比对，如果发生变化，就去执行这个`watcher`的`callback`。
```javascript
class Watcher {
  run() {
    const newValue = this.get();
    if (newValue !== this.value) {
      this.cb(newValue, this.value);
      this.value = newValue;
    }
  }
}
```

这样的话，我们的 `$watch` 也就实现了，下面我们去实现`initWatch`方法，遍历下用户传入的`watch`配置，进行`watcher`添加：

```javascript
function initWatch(vm) {
  const watch = vm.$options.watch;
  for (const key in watch) {
    const userDef = watch[key];
    createWatcher(vm, key, userDef);
  }
} 
```

此时我们使用最开始的两种方法去监听我们的`msg`值的变化，然后异步去更新一下我们的`msg`值，两个log都会正常执行了。

这样的话我们的`watch`也就简单实现啦~

代码点击=> [传送门](https://github.com/blackhu0804/simple-vue/commit/7a13d0c9976ba5e63974e93da3cec7ff382d20ab)