let id=0
class Dep{
    constructor(){
        
    }
    depend(){

    }
    notify(){

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