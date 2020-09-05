// 判断一个数据是不是对象 null除外
export function isObject(data){
    return typeof data === 'object' && data !== null
}

// 定义一个属性为一个枚举的属性
export function def(data,key,value){
    Object.defineProperty(data,key,{
        enumerable:false,
        configurable:false,
        value
    })
}

// 代理 
export function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key]=newValue
        }
    })
}

const LIFECYLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]

// 合并策略  后续可以添加不同的策略
let strats = {}
// 添加生命周期的合并策略
LIFECYLE_HOOKS.forEach(hook=>{
    strats[hook] = mergeHook
})

// 生命周期的合并策略
function mergeHook(parentVal,childVal){
    if(childVal){  // 有新值
        if(parentVal){  // 有新值 也有老值
            return parentVal.concat(childVal)
        }else{  // 只有新值 没有老值
            return [childVal]
        }

    }else {  // 没有新值
        return parentVal
    }
}

// 合并
export function mergeOptions(parent,child){
    const options = {}
    for(let key in parent){  // 把parent的属性和child比较，并合并到options
        mergeField(key)
    }

    for(let key in child){   // 把child上没有合并过的属性 合并到options上
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }
    }
    
    // 默认的合并合并策略 但是有些属性 需要有特殊的合并方式
    function mergeField(key){
        if(strats[key]){  // 合并策略上有指定合并策略就使用合并策略
            return options[key] = strats[key](parent[key],child[key])
        }
        // parent:{data:{name:'haha'}}   child:{data:{age:'lalal'}}  两者key都是对象
        if(typeof parent[key] === 'object' && typeof child[key] === 'object'){
            options[key] = {
                ...parent[key],
                ...child[key]
            }   // 有重复的属性，child覆盖parent的属性
        }else if(child[key] == null){  //child没有可以，使用parent的属性 
            options[key] = parent[key]
        }else{  // parent和child的属性值一个是对象一个是值或者两个都是值  使用儿子的覆盖父亲的
            options[key] = child[key]
        }
    }

    return options;
}