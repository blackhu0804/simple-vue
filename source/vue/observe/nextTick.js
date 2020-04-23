// 维护一个事件队列，等同步事件执行完毕后清空callbacks队列
// Promise(微任务) MutationObserver(微任务) setImmediate(宏任务) setTimeout(宏任务)
// 在异步队列中，微任务优先级更高，所以做了一个优化。
// Vue.$nextTick(cb)

const callbacks = []

function flushCallbacks() {
  callbacks.forEach(cb => cb())
}

export default function nextTick(cb) {
  callbacks.push(cb)

  const timerFunc = () => {
    flushCallbacks()
  }

  if (Promise) {
    return Promise.resolve().then(flushCallbacks)
  }

  if (MutationObserver) {
    const observer = new MutationObserver(timerFunc)
    const textNode = document.createTextNode('1')
    observer.observe(textNode, { characterData: true })
    textNode.textContent = '2'
    return
  }

  if (setImmediate) {
    return setImmediate(timerFunc)
  }

  setTimeout(timerFunc, 0)
}