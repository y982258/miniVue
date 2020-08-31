
//   我们要重写数组的哪些方法 7个 push shift unshift pop severse sort splice 会导致数组本身发生变化

let oldArrayMethods = Array.prototype;

// Object.create()  使用指定的原型对象及其属性去创建一个新的对象,并使新对象的__proto_指向这个原型对象








export let arrayMethods= Object.create(oldArrayMethods)

const methods= [
    'push',
    'shift',
    'unshift',
    'pop',
    'severse',
    'sort',
    'splice'
]
methods.forEach(method=>{
    arrayMethods[method] = function(...args){
        console.log('用户调用了我们劫持的数组的方法---参数集合',args)

        const result=oldArrayMethods[method].apply(this,args)  // 调用原生的数组方法
        // push unshift 添加的元素可能还是一个对象
        let inserted; // 当前用户插入的元素
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2) // splice 有删除 新增的功能 arr.splice(0,1,{name:1})
            default:
                break;
        } 

        // 用户调用方法向数组中添加元素，可能也会是一个对象，那我们也需要去观测
        // inserted是添加元素的集合[] 我们需要去循环监测
        // 在observer中有一个循环数组观测的方法 我们需要想办法进行调用
        // 我们可以给调用数组这些方法的对象上添加一个属性 在这里使用this.xxx就可以拿到
        let ob=this.__ob__
        if(inserted) ob.observerArray(inserted)


        return result

    }
})
