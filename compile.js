class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el); // #app 
        this.vm = vm;
        if(this.el) {
            // 如果元素能获取到，开始编译
            // 1. 先把真实的DOM移入到内存中 fragment
            let fragment = this.node2fragment(this.el);
            // 2. 编译 -> 提取想要的元素节点 v-model 和 文本节点 {{}}
            this.compile(fragment);
            // 3.编译好的 fragment 塞回页面
            this.el.appendChild(fragment    )
        }
    }
    // 是不是指令
    isDirective(name) {
        return name.includes('v-')
    }

    /* 专门写一些辅助方法 */
    isElementNode(node) {
        return node.nodeType === 1;
    }

    /* 核心的方法 */
    compileElement(node) {
        let attrs = node.attributes; // 取出属性
        Array.from(attrs).forEach( attr => {
            // 判断 attr.name 是否包含 "v-"
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // 取到对应的值放到节点中
                let expr = attr.value;
                let type = attr.name.slice(2)
                // node this.vm.$data expr
                CompileUtil[type](node, this.vm, expr)
            }
        })
    }

    compileText(node) {
        // 带 {{}}
        let expr = node.textContent; // 取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g ;
        if(reg.test(expr)){
            // node this.vm.$data expr
            CompileUtil['text'](node, this.vm, expr);
        }
    }

    compile(fragment) {
        // 需要递归
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach( node => {
            if(this.isElementNode(node)) {
                // 是元素节点,需要深入递归检查
                // 编译元素
                this.compileElement(node)
                this.compile(node)
            } else {
                // 文本节点
                // 编译文本
                this.compileText(node)
            }
        })
    }

    node2fragment(el) {
        // 将el中的内容放内存中
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild)
        }        
        return fragment; // 内存中的节点
    }
}

CompileUtil = {
    getVal(vm, expr) {
        // 获取实例上对应的数据
        expr = expr.split('.');
        return expr.reduce( (prev, next) => {
            return prev[next];
        }, vm.$data)
    },
    getTextVal(vm, expr) {
        // 获取编译后文本的结果 
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1]);
        })
    },
    text(node, vm, expr) {
        // 文本处理
        let updateFn = this.updater['textUpdater']

        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Wathcer(vm, arguments[1], (newVal) => {
                // 如果数据变化，文本需要重新获取依赖的数据，更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, expr))
            })
        })

        updateFn && updateFn(node, this.getTextVal(vm, expr))
    },
    setVal(vm, expr, value) {
        expr = expr.split('.');
        return expr.reduce( (prev, next,currentIndex) => {
            if(currentIndex === expr.length - 1) {
                return prev[next] = value;
            }
            return prev[next];
        }, vm.$data)
    },

    model(node, vm, expr) {
        // 输入框处理
        let updateFn = this.updater['modelUpdater']

        // 这里应该加一个监控， 数据变化，调用watch的回调
        new Wathcer(vm, expr, (newVal) => {
            // 当值变化后会调用callback，将新值传递过来
            updateFn && updateFn(node, this.getVal(vm, expr));
        })

        node.addEventListener('input', (e) => {
            let newVal = e.target.value;
            this.setVal(vm, expr, newVal)
        })      

        updateFn && updateFn(node, this.getVal(vm, expr));
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value;
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}