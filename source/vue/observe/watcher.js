import {pushTarget, popTarget} from './dep'
import nextTick from './nextTick'
import {util} from '../util';
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
    } else if (typeof exprOrFn === 'string') {
      // 用户watcher
      // 解析expr，取到data上的值
      // 取值的时候完成依赖收集
      this.getter = function () {
        return util.getValue(vm, exprOrFn);
      }
    }
    this.immediate = opts.immediate
    // 用户添加的watcher，标记一下
    this.user = opts.user
    this.cb = cb;
    this.opts = opts;
    this.id = id++;
    this.deps = [];
    this.depsId = new Set();

    this.value = this.get();
    if (this.immediate) {
      this.cb(this.value)
    }
  }

  get() {
    pushTarget(this); // 让 Dep.target = 这个渲染Watcher，如果数据变化，让watcher重新执行
    const value = this.getter(); // 让传入的函数执行
    popTarget();
    return value;
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
    queueWatcher(this);
  }

  run() {
    const newValue = this.get()

    // 比较新旧值，执行用户添加的handler
    if (newValue !== this.value) {
      this.cb(newValue, this.value)
      this.value = newValue
    }
  }
}

const queueIds = new Set();
let queue = [];
function flushQueue() {
  if (!queue.length) return;
  queue.forEach(watcher => watcher.run());
  queueIds.clear();
  queue = [];
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!queueIds.has(id)) {
    queueIds.add(id);
    queue.push(watcher);

    nextTick(flushQueue, 0);
  }
}

export default Watcher; 
