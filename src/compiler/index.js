import { parseHTML } from './parsehtml.js'
import {generate } from './generate.js'



export function compileToFunction(template) {
    // 1) 解析HTML字符串 将其解析抽象成  ----ast语法树
    let root = parseHTML(template)
    console.log('ast语法树',root)   // root 抽象出的ast语法树

    // 需要将ast语法树转化成最终的render函数  
    let code = generate(root)

    // console.log(code)   
    let renderFn = new Function(`with(this){ return ${code}}`)  // 包装成函数
    // console.log(renderFn)   
    // ƒ anonymous(
    // ) {
    //     with(this){ return _c("div",{id:"app",class:"active",style:{"color":"red"}},_c("p",undefined,_v("hello"+_s(name))))}
    //     }

    // vue的render 返回的是虚拟dom
    return renderFn;
}

// with(this) {  name去的就是传进来this上的
//     return  _v("hello"+_s(name))
// }