// ast语法树 是用对象来描述原生语法 虚拟dom 是用对象来描述dom节点的
// ?:匹配不捕获:意思就是只匹配但是不会有结果 
// 例：'ab'.match(/(a)(?:b)/)  结果：['ab','a',index:0,input:'ab',groups:undefined] 就没有b出现在字表达式结果那
// match() 方法  它将返回一个数组，该数组的第 0 个元素存放的是匹配文本,其余放的是子表达式：也就是（）里匹配的结果 ....index 属性声明的是匹配文本的起始字符在字符串中的位置  
// match() 没有匹配到返回null

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;    // 可以匹配 abc-dfg  这样的
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <aaa:adsfdsf>
const startTagOpen = new RegExp(`^<${qnameCapture}`)  // 开始标签的正则  捕获的是标签名

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)  // 匹配标签结尾  </div>

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的 
const startTagClose = /^\s*(\/?)>/  // 匹配便签结束的 >




export function parseHTML(html) {
    // 抽相处ast语法书
    // 规则：使用正则来匹配标签名 属性 内容 ... 截取掉已经匹配到的结果
    // 然后用剩余的在匹配 ... 不断循环
    // 用匹配的结果 + 父子关系  组成 一颗形容原生HTML的树行结构

    let root = null;  // ast语法树树根
    let currentParent;  // 标识当前父集
    let stack = []
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;

    // 创建语法树
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }




    function start(tagName, attrs) {
        // console.log('开始标签：',tagName,'属性是：',attrs)
        // 遇到开始标签  就创建一个ast元素
        let element = createASTElement(tagName, attrs)
        if (!root) {
            root = element;
        }
        currentParent = element;  // 把当前元素标记为父集
        stack.push(element) // 将开始便签存放到我们写的栈中
    }
    function chars(text) {
        // console.log('文本是：',text)
        text = text.replace(/\s/g, '')
        if (text) {
            currentParent.children.push({
                text,
                type: TEXT_TYPE
            })
        }

    }
    function end(tagName) {
        // console.log('结束便签：',tagName)
        let element = stack.pop()  // 拿到的是ast对象
        // 我要标识当前的这个元素是谁的儿子
        currentParent = stack[stack.length - 1]  // 看当前这个便签是否有父亲，有父亲标识出父子关系
        if (currentParent) {
            element.parent = currentParent;
            currentParent.children.push(element)  // 实现一个树的父子关系
        }
    }


    // 不停的解析字符串直到技术
    while (html) {
        let textEnd = html.indexOf('<') // 使用< 去匹配 它可能是开始例如：<div>  也可能是结束例如：</div>
        if (textEnd == 0) {
            // 如果当前索引为0 肯定是一个标签 开始便签 结束便签
            let startagMatch = parseStartTag()  // 通过这个方法匹配到结果是  标签名 属性
            if (startagMatch) {
                start(startagMatch.tagName, startagMatch.attrs)   // 开始标签
                continue;  // 如果开始匹配完毕后继续 下一次 匹配
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])   // 结束便签
                continue;
            }

        }
        let text;
        if (textEnd >= 0) {  // 是标签中的文本
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length)
            chars(text)   // 文本
        }

    }
    function advance(n) { // 截取 前进
        html = html.substring(n)
    }
    function parseStartTag() {

        let start = html.match(startTagOpen)
        // console.log(start) // ["<div", "div", index: 0, input: "<div id="app">↵        <p>{{arr[0].a}}</p>↵        <p>{{arr[0].b}}</p>↵↵    </div>", groups: undefined]
        // 把匹配到的 <div 截取掉 下次用剩下的来继续匹配

        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)  // 截取 前进
            let end, attr;
            // 匹配不到结束符 证明这个便签上有属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr) // [" id="app"", "id", "=", "app", undefined, undefined, index: 0, input: " id="app" class="active">↵        <p>{{arr[0].a}}</p>↵        <p>{{arr[0].b}}</p>↵↵    </div>", groups: undefined]
                advance(attr[0].length) // 截取 前进
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            }
            // 属性循环完 end = html.match(startTagClose) 句会匹配结束符 > 
            if (end) {
                advance(end[0].length)  // 截取结束符 前进
                return match
            }


        }

    }

    return root;

}