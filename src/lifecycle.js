import Watcher from './observe/watcher'
import {patch} from './vdom/patch.js'

export function lifecycleMixin(Vue){
    Vue.prototype._update=function(vnode){
        const vm=this
        // 我要通过虚拟节点  渲染 出真实的dom
        vm.$el = patch(vm.$el,vnode)   // 通过用虚拟节点创建出真实的节点 替换掉 真实的$el

    }
}


export function mountComponent(vm,el){
    const options = vm.$options
    vm.$el = el  // 真实的dom元素
    // Watcher 就是用来渲染的
    // vm._render()  通过解析render方法 渲染虚拟dom
    // vm._update()  把虚拟dom生成真实dom

 
    callHook(vm,'beforeMount')
    // 渲染页面
    let undateComponent = ()=>{  // 无论是渲染还是更新都会调用此方法
        // vm._render()  返回虚拟dom
        // vm._update()  把虚拟dom生成真实dom
        vm._update(vm._render())
    }
    // 渲染watcher 每个组件都有一个watcher
    new Watcher(vm,undateComponent,()=>{},true)  // true标识他是一个渲染watcher
    callHook(vm,'mounted')
    

}

// 调用指定生命周期
export function callHook(vm,hook){
    const handlers = vm.$options[hook]
    if(handlers){  // 找到对应生命钩子执行执行
        for(let i=0;i<handlers.length;i++){
            // call 为了保证当前生命周期内this指向当前实例
            handlers[i].call(vm)
        }
    }
}