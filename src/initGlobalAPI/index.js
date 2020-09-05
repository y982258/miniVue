import {mergeOptions} from '../utils/index'

export function initGlobalAPI(Vue){
    // 整合了所有全局相关的内容
    Vue.options = {}

    Vue.mixin = function(mixin){
        // this是Vue
        // mixin 合并 把mixin()混入进来的数据和Vue.options合并在一起
        this.options = mergeOptions(this.options,mixin)
    }
    // 使用  
    // Vue.mixin({
    //     a:1,
    //     beforeCreate() {
    //         console.log('mixin1')
    //     }
    // })
    // Vue.mixin({
    //     b:2,
    //     beforeCreate() {
    //         console.log('mixin2')
    //     }
    // })

    // console.log(Vue.options)

}