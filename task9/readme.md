##前言

本次task采用合作处理模式，由id为以下的三人共同完成（QQ）

- 97
- icepro
- 高兴

##开始工作

```
#自动构建工作环境
$ > npm install
#或者从阿里云下载
$ > cnpm install
# 1.执行编译
$ > gulp work
# 2.执行编译并自动检测文件更改
$ > gulp
$ > gulp default
# 3.手动编译sass（合并css）
$ > gulp sass
# 4.手动编译html（合并html并自动更新css版本号）
$ > gulp html
```

##目录介绍

|=./task9
|---src                            //资源文件
    |---html                       //html
    	|---content.html           
    	|---index.html             
    	|---util                   //各组件存放位置
    |---css                        //各组件css
    |---main.scss
|---dist                           //输出目录
|---gulpfile
|---package.json
|---readme.md

##如何向main.scss中添加组件css

在main.scss你可以引入组件的css，这样在编译完成会将所有编译的内容，按顺序添加至输出css，你需要做得只是添加一行import（如果存在css间依赖和覆盖，请注意import的顺序），import的位置是相对于main.scss的，同时不需要为它特意添加后缀，下面是例子：

```
@import "css/nav";
```




