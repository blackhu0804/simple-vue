import { observe } from ".";

/**
 * 拦截用户调用的push、shift、unshift、pop、reverse、sort、splice数组方法
 */

// 获取老的数组方法
let oldArrayProtoMethods = Array.prototype;

// 拷贝新的对象，用来查找老的方法, 不修改原型上的方法
export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'sort',
  'splice'
];

/**
 * 对数组新增的元素进行劫持
 * @param {*} inserted 
 */
export function observerArray(inserted) {
  for (let i = 0; i < inserted.length; i++){
    observe(inserted[i]); // 还需要对数组里面的内容进行监测,并不对索引进行监测
  }
}

methods.forEach(method => {
  arrayMethods[method] = function(...args) { // 函数劫持
    let result = oldArrayProtoMethods[method].apply(this, args);
    console.log('调用数组更新方法');
    let inserted;
    switch (method) {
      // 只对新增的属性进行再次监测，其他方法没有新增属性
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2); // 获取splice(start, deleteCount, []）新增的内容
      default:
        break;
    }
    if(inserted) observerArray(inserted);
    return result;
  }
}); 