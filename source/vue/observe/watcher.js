import {pushTarget, popTarget} from './dep'
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
    this.deps = [];
    this.depsId = new Set();

    this.get();
  }

  get() {
    pushTarget(this); // 让 Dep.target = 这个渲染Watcher，如果数据变化，让watcher重新执行
    this.getter && this.getter(); // 让传入的函数执行
    popTarget();
  }

  addDep(dep) {
    // 同一个watcher 不应该重复记录 dep
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep); // 让watcher记录dep
      dep.addSub(this);
    }
  }

  update() {
    console.log('数据更新');
    this.get();
  }
}

export default Watcher; 
