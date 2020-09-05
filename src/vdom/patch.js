export function patch(oldVnode,vnode){
    // console.log(oldVnode,vnode)
    // 更新也会掉这个方法 所以判断
    // 1.判断是跟新还是要渲染
    const isRealElement = oldVnode.nodeType
    if(isRealElement){  // 有isRealElement  初次渲染
        const oldElm = oldVnode; // <div id="app"></div>
        const parentElm = oldElm.parentNode;  // body

        let el = createElm(vnode)
        parentElm.insertBefore(el,oldElm.nextSibling)
        parentElm.removeChild(oldElm)

        return el
    }

    // 递归创建真实节点 替换掉老的节点
}
function createElm(vnode){  // 根据虚拟节点创建真实的节点
    let {tag,children,key,data,text} = vnode

    // console.log(vnode)

    // // 是标签就创建标签
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
        updateProperties(vnode)  // 添加便签上的属性
        children.forEach(child=>{  // 递归创建儿子节点 将儿子节点扔到父节点中
            return vnode.el.appendChild(createElm(child))
        })
        

    }else{  // 不是标签就是个文本
        vnode.el = document.createTextNode(text)
    }

    // vnode.el 是真实dom的映射
    // 虚拟dom上映射着真实的dom  方便后续更新操作
    // console.log(vnode.el)

    return vnode.el
}
// 添加属性
function updateProperties(vnode){
    let newProps = vnode.data || {}
    let el = vnode.el
    for(let key in newProps){
        if(key === 'style'){
            for(let styleName in newProps.style){
                el.style[styleName] = newProps.style[styleName]
            }
        }else if(key === 'class'){
            el.className = newProps.class
        }else{
            el.setAttribute(key,newProps[key])
        }
    }
}