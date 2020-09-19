let queue = []  // 存放watcher
let has = {}

import {nextTick} from '../utils/next-tick'

function flushSchedularQueue(){
    queue.forEach(watcher=>watcher.run())
    queue = []
    has = {}
}

export function queueWatcher(watcher){
    const id = watcher.id
    if(has[id] == null){
        queue.push(watcher)
        has[id] = true

        // vue里面使用Vue.nextTick
        // Vue.nextTick = promise/mutationObserver/setImmediate/setTimeout

        nextTick(flushSchedularQueue)

        // setTimeout(function(){
        //     queue.forEach(watcher=>watcher.run())
        //     queue = []
        //     has = {}
        // },0)
    }

}