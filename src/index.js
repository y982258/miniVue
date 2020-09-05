// Vue申明文件


import {initMixin} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifecycle'
import {initGlobalAPI} from './initGlobalAPI/index'
function Vue(options){
    // 进行vue初始化工作
    this._init(options)

}
// 向vue原型上添加一个方法 专门做初始化工作
// 但是这样搞会造成这个文件比较混乱 我们可以单独抽离出一个文件 向vue原型上添加init方法并处理自己的逻辑
// Vue.prototype._init=function(){}


// 通过引入文件的方法 向Vue原型上添加方法
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalAPI(Vue)
export default Vue