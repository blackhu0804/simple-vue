let id = 0;

class Watcher { // 每次产生一个watch 都会有一个唯一的标识
  /**
   * 
   * @param {*} vm 当前逐渐的实例 new Vue 
   * @param {*} exprOrFn 用户可能传入的一个表达式 也可能传入一个函数
   * @param {*} cb 用户传入的回调函数 vm.$watch('msg', cb) 
   * @param {*} opts 一些其他参数
   */
  constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    }
    this.cb = cb;
    this.opts = opts;
    this.id = id++;

    this.get();
  }

  get() {
    this.getter(); // 让传入的函数执行
  }
}

export default Watcher; 
