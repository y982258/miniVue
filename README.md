#### 目录

```
src
|
|-----compiler
|		generate.js
|		index.js
|		parsehtml.js
|-----initGlobalAPI
|       index.js
|-----observe
|		array.js
|		index.js
|		watcher.js
|-----utils
|		index.js
|-----vdom
|		create-element.js
|		patch.js
|-----index.js
|-----init.js
|-----lifecycle.js
|-----render.js
|-----state.js

```

``index.js``

```vue```的入口文件，当实例化```vue```时会进行初始化操作，内部会调用各种```Mixin```方法给vue原型上添加方法

- ```initMixin``` 增添初始化方法
- ```renderMixin``` 添加渲染方法，调用我们的```render```方法
- ```lifecycleMixin``` 增添update方法，将```虚拟dom```渲染成真实dom

> 这里面最核心的两个方法```vm._update(vm._render())```

``init.js``

``vue``的初始化方法，包括后续组件的初始化。这里会初始化状态

- 针对用户传入的属性进行不同的初始化的功能
- 

```compiler```

```vue```编译流程

- ```parsehtml.js```  把html模板转化成ast语法树
- ``generate.js`` ```index.js``` 把ast语法树转化并包装为render函数
```initGlobalAPI```
- ```index.js``` 初始化Vue的全局api

```observe```

观测数据 响应式原理

- ``index.js`` 对象劫持
- ``array.js`` 数组的劫持

```vdom```

创建虚拟节点和将虚拟节点渲染成真实节点







