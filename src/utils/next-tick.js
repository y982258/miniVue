// nextTick 在修改数据之后立即使用这个方法，获得更新后的dom
// 所以我们 延迟执行 

let callbacks = []   // 任务队列  [flushSchedularQueue,usenextTick]
let waiting = false
function flushCallback(){
    callbacks.forEach(cb=>cb())
    waiting = false
    callbacks=[]
}

export function nextTick(cb){  
    // 第一次调用nextTick的肯定是我们vue中数据更新后调用的
    // 之后 用户在多次调用 nextTick 是在修改数据之后
    // 我们先执行 flushSchedularQueue 进行更新渲染，在执行usenextTick用户的回调

    // 多次调用nextTick 如果没有刷新的时候就先把他放到数组中
    // 刷新后更改 waiting
    callbacks.push(cb)
    if(waiting===false){
        setTimeout(flushCallback,0)
        waiting = true
    }
}

