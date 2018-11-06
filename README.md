# 关于 JavaScript 的模块

### 从前从前

- 引用别人的库需要复制粘贴到自己的项目下，然后定义一个全局变量进行引用
- 自己依次去排序组合所用的库，比如这个库依赖 jq，得先把 jq 排在前面
- 还要管理命名空间，避免库冲突

### 模块规范

> 于是相应的模块应运而生，只要开发者按照相应的方式开发，别人就可以按照规范引用

##### AMD（异步模块规范）

- RequireJS 推动了它发展

```javascript
//    文件名: foo.js
define(["jquery"], function($) {
  //    方法
  function myFunc() {}

  //    暴露公共方法
  return myFunc;
});
```

- 第一个参数是依赖数组，第二个部分是回调函数，只有当依赖的库可用（requireJS 脚本会负责这一部分，包括如何找到文件路径），回调函数才被执行。
- 最重要的是不能在回调函数外面引用变量$，因为它不是全局的。这正是模块化的目的。

##### CommonJS

- nodejs 模块规范实现
- 对服务器端不影响，因为读取本地文件
- 对浏览器有影响，因为需要等待网络世界导入

```javascript
var xxx = {};
module.exports = xxx;
//引用
var xxx = require("xxx");
```

##### UMD(通用模块规范)

- 上述两个模块如果都想使用，就诞生了 umd
- 兼容 amd 和 commonJS，同时还支持很久以前的全局变量

```javascript
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // Node, CommonJS之类的
    module.exports = factory(require("jquery"));
  } else {
    // 浏览器全局变量(root 即 window)
    root.returnExports = factory(root.jQuery);
  }
})(this, function($) {
  //    方法
  function myFunc() {}

  //    暴露公共方法
  return myFunc;
});
```
