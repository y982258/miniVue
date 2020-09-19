import {pushTarget,popTarget} from './dep.js'
import {queueWatcher} from './schedular'

let id=0
class Watcher {
    constructor(vm,exprOrFn,callback,options){
        this.vm = vm
        this.callback = callback
        this.options = options

        this.id = id++

        this.getter = exprOrFn; // 将内部传过来的回调函数 方到getters属性上

        this.depId = new Set()
        this.deps = []

        this.get()   // 调用get方法 会让渲染watcher执行
    }
    addDep(dep){  // 不能放重复的dep
        let id = dep.id
        if(!this.depId.has(id)){
            this.depId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    get(){
        pushTarget(this)  // 把watcher存起来 Dep.target
        this.getter()  // 渲染watcher执行  渲染时会执行取值操作，我们会在取值那里给属性加上所依赖的watcher
        popTarget()  // 移除watcher
    }
    update(){
        // this.get()
        // 同一个值 连续改变多次的时候 会更新过多次
        // 因为每次调用update的时候都放入了watcher 
        // 优化方法：等待 异步更新

        queueWatcher(this)
    }
    run(){
        this.get()
    }

}


export default Watcher


