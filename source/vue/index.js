import {initState} from './observe';
import Watcher from './observe/watcher';
import {compiler} from './util';

function Vue(options) { // Vue 中原始用户传入的数据
  this._init(options); // 初始化 Vue， 并且将用户选项传入
}

/**
 * Vue 中数据的初始化
 */
Vue.prototype._init = function(options) {
  // vue 中的初始化 this.$options 表示 Vue 中的参数
  let vm = this;
  vm.$options = options;

  // MVVM 原理， 需要数据重新初始化
  initState(vm);

  if (vm.$options.el) {
    vm.$mount();
  }
}

/**
 * 获取DOM节点
 * @param {*} el 
 */
function query(el) {
  if (typeof el === 'string') {
    return document.querySelector(el);
  };
  return el;
}

/**
 * 用用户传入的数据，更新视图
 */
Vue.prototype._update = function() {
  let vm = this;
  let el = vm.$el;

  /** TODO 虚拟DOM重写 */
  // 匹配 {{}} 替换
  let node = document.createDocumentFragment();
  let firstChild;
  while(firstChild = el.firstChild) {
    node.appendChild(firstChild);
  }

  compiler(node, vm);

  el.appendChild(node);
}

// 渲染页面 将组件进行挂载
Vue.prototype.$mount = function () {
  let vm = this;
  let el = vm.$options.el; // 获取元素
  el = vm.$el = query(el); // 获取当前挂载的节点 vm.$el 就是我要挂在的一个元素

  // 渲染通过 watcher来渲染
  let updateComponent = () => { // 更新、渲染的逻辑
    vm._update(); // 更新组件
  }
  new Watcher(vm, updateComponent); // 渲染Watcher, 默认调用updateComponent
}

export default Vue; // 首先默认导出一个Vue