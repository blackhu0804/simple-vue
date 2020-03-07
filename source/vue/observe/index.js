import Observer from './observer';

export function initState(vm) {
  // 做不同的初始化工作
  let opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed();
  }
  if (opts.watch) {
    initWatch();
  }
}

export function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return; // 不是对象或为null 不执行后续逻辑
  }
  return new Observer(data);
}

/**
 * 将对vm上的取值、赋值操作代理到 vm._data 属性上
 * 代理数据 实现 vm.msg = vm._data.msg
 */
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  })
}

/**
 * 初始化数据
 * 将用户传入的数据 通过Object.defineProperty重新定义
 */
function initData(vm) {
  let data = vm.$options.data; // 用户传入的data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};

  for(let key in data) {
    proxy(vm, '_data', key); // 将对vm上的取值、赋值操作代理到 vm._data 属性上
  }

  observe(vm._data); // 观察数据
}

/**
 * 初始化计算属性
 */
function initComputed() {

}

/**
 * 初始化watch
 */
function initWatch() {

} 