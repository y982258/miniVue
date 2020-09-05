const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 匹配{{}}
// exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null
// index 属性声明的是匹配文本的第一个字符的位置。input 属性则存放的是被检索的字符串 string

// 需要将ast语法树转化成最终的render函数 
// _c("div",{id:"app",class:"active",style:{"color":"red"}},_c("p",undefined,_v("hello"+_s(name))))

function genProps(attrs) {   // 处理属性拼接成属性的字符串
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            // style="color:red;fontSize:14px" => {style:{color:'red'}}
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value
            });
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}
function genChildren(el) {   // 处理子节点拼接成字符串
    let children = el.children
    if (children && children.length > 0) {
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false
    }
}
function gen(node) {
    if (node.type == 1) {
        // 元素标签
        return generate(node)   // 递归调用generate生成元素标签字符串

    } else {
        // 如果文本是这种 a {{name}}  b {{age}}
        // 需要转成的字符串是 _v("a"+_s(name)+_s(age)+'c')
        let text = node.text
        // console.log(text)
        let tokens = [];
        let match,index;
        let lastIndex = defaultTagRE.lastIndex = 0
        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        // console.log(tokens)
        return `_v(${tokens.join('+')})`
    }
}

export function generate(el) {
    const children = genChildren(el)

    let code = `_c("${el.tag}",${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? `,${children}` : ''})`
    return code

}
