let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }

  addSub(watcher) { // 订阅， 在调用addSub时将传入的内容保存到数组中
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

/**
 * 用来保存当前的watcher
 */
let stack = [];
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1]; 
}

/**
 * 用来依赖收集
 */
export default Dep; 