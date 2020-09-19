// 存放依赖的watcher

let id=0
class Dep{
    constructor(){
        this.id = id++;
        this.subs = []   //  [watcher,watcher....]  // 存放着观察者
    }
    depend(){
        // this.subs.push(Dep.target)    //  观察者模式


        // 优化：让watcher 记住要使用它的dep  让dep存放watcher
        Dep.target.addDep(this)


    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())  // 通知观察者去更新
    }
}


let stack = []
// 目前可以做到 将watcher保留 和 移除的功能
export function pushTarget(watcher){
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget(watcher){
    stack.pop()
    Dep.target = stack[stack.length-1]
}

export default Dep