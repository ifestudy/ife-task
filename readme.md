## 前言
没参加上百度前端技术学院，故在这里召集了小伙伴一起制作完成前端的课程，由于没有参加课程不需要赶时间，所以在可能的情况下尽可能的完成全部项目。


## 1. 时间约定

尽可能的按照原定的时间长度，视情况缩减或增加。

## 2. 编码约定

### 2.0 总体约定

1. 在进行到第三阶段前不允许使用任何框架
2. 允许参考其他相关代码，但不允许完全复制粘贴
3. 文件位置约定
4. 缩进约定：使用tab做缩进，默认情况下tab为4个空格
5. 代码提交时单文件使用task0000-name.html的形式，多文件以name为文件夹名提交（name为你的id）
6. 代码review以issue的方式提出问题
7. 视情况补充说明

### 2.1 HTML

1. 文档类型统一使用<!doctype html>
2. 标签必须全部小写，且有效闭合
3. css引入规范，属性位置闭合等与下面保持一致<br/>
`<link type="text/css" rel="stylesheet" href="css/comm.css"  />`
4. script引入规范<br/>
`<script type="text/javascript" src="js/comm.js"></script>`
5. 视情况增加内容

 
### 2.2 javascript

1. 变量命名规范(建议)
	- 私有变量使用下划线前缀如： _appName
	- 局部变量使用小写字母开头如： fileName
	- 参数使用p前缀如：function getElementName(px){}

2. 核心API编写规定（必须）
	- 模块：小写
	- 类：驼峰
	- 公有变量：混合
	- 公有方法：下划线或混合
	- 常量：大写或驼峰

3. 注释
	- 视情况在重要逻辑出添加注释（建议）
	- 模块首尾添加（必须）
 ```
	//xxx模块开始==================
	...
	//xxx模块结束==================
 ```

4. 视情况增加内容
 

### 2.3 css

1. 总体约定
	本次代码按照chrome浏览器44.0+版本以上进行测试，移动端按ife要求

2. 编码方式<br/>
`@charset "utf-8"; `

3. 视情况增加内容
