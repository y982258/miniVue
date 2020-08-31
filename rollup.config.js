import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

// rollup.config.js
export default {
    // 核心选项
    input:'./src/index.js',     // (必须)  以哪个文件作为打包入口
    output: {                   // (必须 )   输出选项
        // 核心选项
        file:'dist/umd/vue.js',    // （必须)  出口文件路径
        format:'umd',  // (必须)  使用的模块规范  umd (统一模块规范) cmd amd CommonJS...
        name:'Vue',  // 指定打包后全局变量的名字
        sourcemap:true,  // es6->es5  开启源码调试  可以找到源代码的报错位置
      },
    plugins:[  // 配置插件
        babel({
            exclude:"node_modules/**"  // 忽略文件
        }),
        process.env.ENV === 'development' ? serve({
            open:true,
            openPage:'/pubilc/index.html',   // 启动服务默认打开HTML路径
            port:3000,
            contentBase:''  // 静态资源路径 空表示当前目录 
        }) : null
    ],
  };