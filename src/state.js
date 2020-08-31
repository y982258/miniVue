import {observe} from './observe/index'
import {proxy} from './utils/index'

export function initState(vm){
    const opts = vm.$options
    console.log('state---我们挂载实例上的$options',opts)
    // 根据用户传入的不同的数据来源做不同的数据初始化
    // Vue 的数据来源 属性 方法 数据data 计算属性 watch

    if(opts.props){
        initProps()
    }
    if(opts.methods){
        initMethod()
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed()
    }
    if(opts.watch){
        initWatch()
    }


} 

function initProps(){}
function initMethod(){}
function initData(vm){
    console.log('initData初始化数据--data',vm.$options.data)
    // 数据初始化工作
    let data = vm.$options.data  // 用户传递的data
    data  = vm._data = typeof data == 'function' ? data.call(vm) : data  // data是个函数的话 我们要保证在data() 中this还是指向当前实例的就需要用call方法改变this指向
    // 考虑到用户也需要用到data中的数据，所以我们把data数据复制一份赋值给_data

    for(let key in data) {  // 优化用户操作
        proxy(vm,'_data',key) // 会将对vm上的取值和赋值操作代理给vm._data 属性
    }

    // 对象劫持 用户改变了数据 我们希望得到
    // MVVM模式 数据改变可以驱动视图变化
    // Object.defineProperty()  给属性增加get方法和set方法
    observe(data)


}   
function initComputed(){}
function initWatch(){}
