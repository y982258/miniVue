// 把data中的数据 都使用Object.defineProperty重新定义 es5
// Object.defineProperty 不能兼容ie8及以下
import { isObject,def } from '../utils/index'
import {arrayMethods} from './array.js'
import Dep from './dep'

class observer {
    constructor(value) {
        // 遍历对象 重新定义data
        // vue如果数据的层次过多 需要递归的去解析对象中的属性，一次添加set和get方法 消耗性能

        
        // value.__ob__=this  // 给每个监控过的属性都加一个__ob__ 这个属性的值是observer类的实例 这样我们可以拿到observer上的所有方法
        // 上面写法有一个严重的bug：会造成递归死循环,所以我们要使用Object.defineProperty定义__ob__为不可枚举的属性
        def(value,'__ob__',this)


        // 如果是数组的话也会对数组的索引进行监控   这样并不好性能消耗过度 
        // 所以vue中对于数据进行了单独处理 改写了数组的7个能改变数组结构的方法

        if(Array.isArray(value)){
            // 重写数组方法
            value.__proto__=arrayMethods 

            // 如果数组里面放的是对象的话我去循环监控

            this.observerArray(value)
        }else{
            // 对象进行监控
            this.walk(value)
        }



        

    }
    observerArray(value){
        for(let i=0;i<value.length;i++){
            observe(value[i])
        }
    }
    walk(data) {
        let keys = Object.keys(data) // [key1,key2,key3...]
        console.log('data的key集合', keys)

        // for (let i = 0; i < keys.length; i++) {
        //     let key = keys[i]
        //     let value = data[key]
        //     defineReactive(data,key,value) // 定义响应式数据
        // }
        // 优化写法：
        keys.forEach(key=>{
            defineReactive(data,key,data[key])
        })

    }
}


function defineReactive(data,key,value){

    let dep = new Dep();

    console.log('使用df重新定义--data',data,'key--',key,'value--',value)
    observe(value)   // 如何对象的属性值还是一个对象的话继续劫持  递归实现深度监测
    Object.defineProperty(data,key,{
        
        get(){  // 获取值的时候做一些操作
            if(Dep.target){   // 如果当前有watcher
                dep.depend() // 意味着我要将watcher存起来
            }
            return value
        },
        set(newValue){  // 设置值的时候也可以做一些操作
            if(newValue===value) return
            console.log('set-----值发生变化了','key:',key,'---',value,'---',newValue)
            // 原来的值
            /*new Vue({
                el:'#app',
                data:{
                    son:{}
                    grandson:'孙子'
                 }
             })
            */
            // 我们只劫持了data的属性或者data属性是对象的情况  但是如果这是的值也是一个对象呢？例如：vm._data.grandson={name:'孙子'}
            // 这样的话 vm._data.grandson.name = '哈哈' 就没有被劫持到
            // 所以如果设置的是还是一个对象的话 我们需要继续劫持 
            observe(newValue)      // 继续劫持用户设置的值
            value = newValue
            dep.notify()   // 通知依赖的watcher来进行更新操作
        }
    })
}


export function observe(data) {
    // console.log('observe对象劫持---data', data)
    let isObj = isObject(data)
    if (!isObj) {
        // console.error('data is not object');
        return
    }
    new observer(data)  // 用来观测数据
}