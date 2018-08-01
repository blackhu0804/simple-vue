class Observer {
    constructor(data) {
        this.observe(data)
    }
    observe(data){
        // 要对这个data数据将原有的属性改为 get 和 set 的形式
        if(!data || typeof(data) !== 'object') {
            return 
        } 
        // 要将数据一一劫持 先获取到data的key和value
        Object.keys(data).forEach( key => {
            // 劫持
            this.defineReactive(data, key, data[key])
            this.observe(data[key]); // 深度递归劫持
        });
    }
    // 定义响应式
    defineReactive(obj, key, value) {
        let that = this;
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true,
            get() { 
                // 当取值时调用的方法
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newVal) {
                // 当给data属性中设置值的时候 更改获取属性的值
                if(newVal != value) {
                    that.observe(newVal); // 如果是对象继续劫持
                    value = newVal;
                    dep.notify(); // 通知所有人数据更新了
                }
            }
        });
    }
}

class Dep {
    constructor() {
        // 订阅的数组
        this.subs = []
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}
