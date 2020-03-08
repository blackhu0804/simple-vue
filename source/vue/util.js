// (?:.|\r?\n) 任意字符或者是回车
// 非贪婪模式 `{{a}} {{b}}` 保证识别到是两组而不是一组
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
export const util = {
  getValue(vm, expr) { // school.name
    let keys = expr.split('.');
    return keys.reduce((memo, current) => {
      memo = memo[current]; // 相当于 memo = vm.school.name
      return memo;
    }, vm);
  },
  /**
   * 编译文本 替换{{}}
   */
  compilerText(node, vm) {
    if(!node.expr) {
      // 给节点添加一个属性， 方便后续的更新操作
      node.expr = node.textContent;
    }
    node.textContent = node.expr.replace(defaultRE, function(...args) {
      return JSON.stringify(util.getValue(vm, args[1]));
    });
  }
}

/**
 * 文本编译
 */
export function compiler(node, vm) {
  let childNodes = node.childNodes;
  [...childNodes].forEach(child => { // 一种是元素一种是文本
    if (child.nodeType == 1) { // 1表示元素
      compiler(child, vm); // 如果子元素还是非文本， 递归编译当前元素的孩子节点
    } else if (child.nodeType == 3) { //  3表示文本
      util.compilerText(child, vm);
    }
  })
} 