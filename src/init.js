import {initState} from './state'

import { compileToFunction } from './compiler/index.js'
import { observe } from './observe'


// 向vue原型上添加init方法
export function initMixin(Vue){
    // 初始化流程
    Vue.prototype._init=function(options){
        console.log('init---options(用户传入的数据)',options)
        // 数据劫持
        const vm=this   // 当前实例
        vm.$options=options   // vue中使用 this.$options 指代的就是用户new Vue是传递进来的数据
         


        // 初始状态 把当前实例传递进入 供initState使用
        initState(vm)


        // 如果用户传了el属性 需要将页面渲染出来 实现挂在流程
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
    // 挂载方法
    Vue.prototype.$mount=function(el){
        const vm=this
        const options = vm.$options
        el=document.querySelector(el)  // 得到DOM元素（需要挂载在它上）

        // 模板编译 （有render方法就不需要进行编译）
        // 默认先会查找有没有render方法，没有render,会采用template,也没有template，会采用el的内容进行编译
        // 优先级：render----> template ----> el
        
        if(!options.render){
            // 对模板进行编译
            let template = options.template;  // 取出模板
            if(!template&&el){
                template = el.outerHTML
            }
            // console.log(template)
            // 取出模板后我们需要将 template 转换成 render 方法 vue1.0采用纯字符串编译正则转换的方法  vue2.0采用虚拟dom
            const render = compileToFunction(template)
            options.render = render

        }

    }
 
}







