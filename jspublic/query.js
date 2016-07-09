/**
*仅保证在chrome下正常工作
*/
(function() {
    "use strict";
    //确保不被重复加载
    var _$ = window.$,
        // 用于保存整个根query对象（可能将会用于快速查找目标）
        rootQuery = [],
        _$ = function(selector){
        //生成器每一次返回一个新的对象
        return new _$.fn.init(selector,rootQuery);
    };

    /**
    * 计划项目：
    * [ ]-onready
    * [ ]-onload
    * [ ]-canvas
    * [ ]-
    */




    //定义一个fn来初始化并执行一些操作
    /**
    * version 0.0.1存在以下目标
    * [X]-可以选择指定id的标签如#id
    * [X]-可以选择指定class的标签如.class
    * [X]-可以是复合标签如#id .class
    * [X]-可以使tag标签或者html element
    * [X]-可以是数组或者json或者object对象
    * [ ]-低版本浏览器兼容
    * [X]-可以使本身
    * [ ]-可以使复杂混合标签
    */
    _$.fn = _$.prototype = {
        version: "0.0.1",
        //用于判断是否为query对象
        isQuery: true,
        constructor: _$,
        //默认为空
        length : 0,
        //继承splice方法
        splice: [].splice,
        //选择器暂留器（暂不使用）
        selector : '',
        //对象是否是json型数据（object和array也会被认为是json）
        isJson : false,
        init: function(selector,rootQuery){
            var quickCheck = /^(?=(#[\w-]+$)|([.][\w-]+$)|((?:[#|.][\w-]+[\s]+)+(?:[#|.][\w-]*)$))/g;
            var quickTag = /^\s(<[\w\W]+>)[^>]$/g,
                matchs = quickCheck.exec(selector);
            //如果是null，undefined，和false则直接返回自己就好了
            if ( !selector ) {
                this.length = 0;
                return this;
            }
            //TODO:
            // $0:代表表达式匹配结果默认为空（留作他用）
            // $1:代表表达式匹配结果为id类
            // $2:代表表达式匹配结果为class类
            // $3:一个多级列表
            // $4:预留一个tag检测位置
            // $5:预留一个~
            //保留做兼容！
            //匹配到的情况下
            // if(matchs){
            //     //id类
            //     if(matchs[1]) {
            //         //var elem = document.getElementById(selector.replace('#',""));
                    
            //         for (var i = 0; i < elem.length; i++) {
            //             this[i] = elem[i];
            //         }
            //         this.length = elem.length;
            //         return this;
            //     }
            //     //class 以及被上文使用
            //     //预留ie接口
            // }
            //html元素//这个要在前面判断！
            if(selector.nodeType){
                var elem = selector;
                this.selector = elem.selector;
                this.length = 1;
                this[0] = elem;
                return this;
            }
            //如果本身是query对象 
            if ( selector.isQuery ) {
                //如果判断为query，还存在说明这个已经一个query对象了，现在直接返回就行了
                var elem = selector;
                this.selector = elem.selector;
                this.length = elem.length?elem.length:1;
                for (var i = 0; i < elem.length; i++) {
                    this[i] = elem[i];
                }
                return this;
            }
            //预留他用！
            // if ( selector !== undefined ) {}
            // 数组和object类别(不做深拷贝处理)统一认为做json型处理！
            if ( (typeof selector instanceof Array) || (typeof selector == 'object')){ //||((typeof elem == 'object')&&(Object.prototype.toString.call(elem).toLowerCase())=="[object object]"&&!elem.length) ) {
                var elem = selector;
                this.selector = elem.selector;
                this[0] = elem;
                this.length = 1;//elem.length;
                this.isJson = true;
                return this;
            }
            //最后使用queryselectorAll
            //检测是否是queryselectorAll
            if(document.querySelectorAll && document.querySelectorAll(selector)){
                this.selector = selector;
                //TODO: 低版本浏览器兼容==暂不做低版本处理
                var elem = document.querySelectorAll(selector);
                for (var i = 0; i < elem.length; i++) {
                    this[i] = elem[i];
                }
                this.length = elem.length;
                return this;
            }
            //保留selector（不确定出现这种情况的selector是什么样子的，保留做debug）
            this.selector = selector;
            //如果什么都不是则返回空！以防止出错
            this.length=0;
            return this;
        },
        //class
        css : function( attr , css ){
            switch(arguments.length){
                case 1: 
                    //首先判断是否是json数据，是的话那就依次设置（设置）
                    if((typeof attr == 'object')&&(Object.prototype.toString.call(attr).toLowerCase())=="[object object]"&&!attr.length){
                        //遍历自己
                        this.each(function(i,item){ 
                            //遍历元素
                            $(attr).each(function(j,attrd){
                                item.style[j] = attrd;
                            });
                        });
                        //结束返回自己
                        return this;
                    }else{
                        // this.each(function(i,item){ 
                        return this[0].style[attr];
                    }
                    break;
                case 2:
                    if(css){
                        //如果有两个参数那必然是遍历设置
                        this.each(function(i,item){ 
                            this.style[attr] = css;
                        });
                    }
                    return this;
                    break;
                default: 
                    return "";
            }
        },
        addClass : function( ClassName ) {
            if((this[0].nodeType)&&(this[0].nodeType != 11)){
                $(this[0]).each(function(i,item){
                    if(!item.className.match(new RegExp("(\\s|^)"+ClassName+"(\\s|$)","g"))){
                        item.className += " "+ClassName;
                    }
                });
                return this;
            }else{
                return this;
            }
        },
        removeClass : function( ClassName ) {
            if((this[0].nodeType)&&(this[0].nodeType != 11)){
                $(this[0]).each(function(i,item){
                    item.className = item.className.replace(new RegExp("(\\s|^)"+ClassName+"(\\s|$)","g"),"");
                });
                return this;
            }else{
                return this;
            }
        },
        //dom操作！TODO:采用了讨巧的办法，不合时宜！
        find : function(selector){
            // tsk;
        },
        first : function(){
            //对于不存在的如undefined之类的不做处理
            if(!this[0]) return this;
            //对于json而言之间返回this因为json类不支持该项操作
            if (this.isJson) {
                return this;
            }else{
                //那么理论上这个就应该是element元素了
                //TODO:将所有符合的子元素取出而不是单个元素！
                // var tmp = $();
                // this.each(function(i,item){
                //     tmp.push(item.firstElementChild)
                // });
                return $(this[0].firstElementChild);
            }
        },
        last : function(){
            //对于不存在的如undefined之类的不做处理
            if(!this[0]) return this;
            //对于json而言之间返回this因为json类不支持该项操作
            if (this.isJson) {
                return this;
            }else{
                //TODO:将所有符合的子元素取出而不是单个元素！
                var array = [];
                //那么理论上这个就应该是element元素了
                return $(this[0].lastElementChild);
            }
        },
        //只允许移除本身，且只允许对element匀速作出处理
        remove : function(){
            if(this.isJson) return this;
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        append: function (str) {
            //如果是空的那就什么都不做
            if(!str||(str=="")) return this;
            if(typeof str == "string"){
                //如果是一个string则调用inserhtml来处理
                for (var i = 0; i < this.length; i++) {
                    this[i].insertAdjacentHTML('beforeEnd', str);
                }
            }else{
                //如果是一个query 对象并且nodetype表明是一个html的情况下
                if(str.isQuery && str[0].nodeType && (str[0].nodeType != 11 )){
                    for (var i = 0; i < this.length; i++) {
                        this[i].appendChild( str[0] );
                    }
                //如果是一个element对象的情况下(去除跨域元素的)
                }else if((str.nodeType)&&(str.nodeType != 11) ){
                    for (var i = 0; i < this.length; i++) {
                        this[i].appendChild( str );
                    }
                }
            }
            //其余情况不处理！
            return this;
        },
        appendBefore: function(str){
            if(!str||(str=="")) return this;
            if(typeof str == "string"){
                for (var i = 0; i < this.length; i++) {
                    this[i].insertAdjacentHTML('afterbegin', str);
                }
            }else{
                //如果是一个query 对象并且nodetype表明是一个html的情况下
                if(str.isQuery && str[0].nodeType && (str[0].nodeType != 11 )){
                    for (var i = 0; i < this.length; i++) {
                        this[i].insertBefore( str[0].cloneNode(true) , this[i].firstElementChild );
                    }
                //如果是一个element对象的情况下(去除跨域元素的)
                }else if((str.nodeType)&&(str.nodeType != 11) ){
                    for (var i = 0; i < this.length; i++) {
                        this[i].insertBefore( str.cloneNode(true) , this[i].firstElementChild );
                    }
                }
            }
            return this;
        },
        //[x]-暂不支持element的添加！-划掉已支持
        before: function (str) {
            if(!str||(str=="")) return this;
            if(typeof str == "string"){
                for (var i = 0; i < this.length; i++) {
                    this[i].insertAdjacentHTML('beforeBegin', str);
                }
            }else{
                //如果是一个query 对象并且nodetype表明是一个html的情况下
                if(str.isQuery && str[0].nodeType && (str[0].nodeType != 11 )){
                    for (var i = 0; i < this.length; i++) {
                        $(this[i]).parent()[0].insertBefore( str[0].cloneNode(true) , this[i] );
                    }
                //如果是一个element对象的情况下(去除跨域元素的)
                }else if((str.nodeType)&&(str.nodeType != 11) ){
                    for (var i = 0; i < this.length; i++) {
                        $(this[i]).parent()[0].insertBefore( str.cloneNode(true) , this[i] );
                    }
                }
            }
            return this;
        },
        after: function (str) {
            if(!str||(str=="")) return this;
            if(typeof str == "string"){
                for (var i = 0; i < this.length; i++) {
                    this[i].insertAdjacentHTML('afterEnd', str);
                }
            }else{
                //如果是一个query 对象并且nodetype表明是一个html的情况下
                if(str.isQuery && str[0].nodeType && (str[0].nodeType != 11 )){
                    for (var i = 0; i < this.length; i++) {
                        $(this[i]).parent()[0].insertBefore( str[0].cloneNode(true) , this[i].nextSibling );
                    }
                //如果是一个element对象的情况下(去除跨域元素的)
                }else if((str.nodeType)&&(str.nodeType != 11) ){
                    for (var i = 0; i < this.length; i++) {
                        $(this[i]).parent()[0].insertBefore( str.cloneNode(true) , this[i].nextSibling );
                    }
                }
            }
            return this;
        },
        //遍历器
        each : function( callback ){
            if((typeof this[0] == 'array')||(this.isJson)){
                for ( var index in this[0] ) {
                   if(false === callback.call( this[0][index]  ,  index  , this[0][index])) break;
                };
            }else{
                for ( var index = 0 ; index < this.length ; index++ ) {
                   if(false === callback.call( this[index]  ,  index  , this[index])) break;
                };
            }
        },
        getPosition : function() {

        },
        //事件侦听！
        on : function( name,listener ) {
            //[x]-预留检测位置！
            if( isNaN(this.length) || (this.length < 0) ){
                return false;
            //     this[0].addEventListener(name,listener);
            }else{
                /*更改为全部绑定*/
                this.each(function(i,item){
                    item.addEventListener(name,listener);
                });
            }
            //TODO:预留ie位置

            //返回自己使得可以连续操作
            return this;
        },
        live : function(){

        },
        //只返回第一个
        val : function(value) {
            if(value||(value=="")){
                this[0].value = value;
                return this;
            }else{
                return this[0].value;
            }
        },
        //只返回第一个元素的父亲
        parent : function() {

            if((this[0])&&('parentNode' in this[0])){
                var parent = this[0].parentNode;
            }else{
                return $();
            }
            //
            parent = ( (parent) && ( parent.nodeType !== 11) ) ? parent : null;
            return $(parent);
        },
        //[x]-暂时只需要获取处理！可以利用arguments做设定处理！--已经完成
        data : function(dataName,value) {
            if( arguments.length = 2 ){
                if (dataName=="") {
                    this.each(function(i,item){
                        this.data = value;
                    });
                }else{
                    this.each(function(i,item){
                        this.dataset[dataName] = value;
                    });
                };
                return this;
            }else{
                // var dataName = dataName;
                if ((!dataName) || (dataName=="")) {
                    this[0].getAttribute('data');
                    return this;
                }else{
                    this[0].getAttribute('data-'+dataName);
                    return this;
                };
            }
        },
        //常用数组功能

        //队列功能
        pop : function(type){
            if (this.isJson) {
                switch(type){
                    case 'right': return this[0].pop();break;
                    case 'left': return this[0].shift();break;
                    default: return this[0].pop();break;
                }
            }else{
                //对于非json类型的对象而言（通常指的是一些诸如element之类的）
                switch(type){
                    case 'right': var tmp = this.last();this.last().remove();return tmp;break;
                    case 'left': var tmp = this.first();this.first().remove();return tmp;break;
                    default: var tmp = this.last();this.last().remove();return tmp;break;
                }
            }
        },
        // push: [].push,
        //push如果你传入的一个json，那么push将会尝试将两个json合并处理（重复内容由data覆盖）
        //如果你传入的是一个html，则会依照规则在前后之间添加元素
        push : function(data,type){
            if (this.isJson) {
                if(this[0] instanceof Array){
                    switch(type){
                        case 'right': this[0].push(data.isQuery?data[0].concat():data.concat());return this;break;
                        case 'left': this[0].unshift(data);return this;break;
                        default: this[0].push(data.isQuery?data[0].concat():data.concat());return this;break;
                    }
                }else if($.isJsonType(data)){
                    //这里就不会存在所谓的什么左右插入了！
                    //如果不是array那么添加的data必须也是json格式的
                    $(data).each(function(i,item){
                        //重复的将会被更新！
                        this[i] = item;
                    });
                    return this;
                }else{
                    return this;
                }
            }else{
                //对于非json类型的对象而言（通常指的是一些诸如element之类的）
                switch(type){
                    case 'right': this.append(data);return this;break;
                    case 'left': this.appendBefore(data);return this;break;
                    default: this.append(data);return this;break;
                }
            }
        },
        //这将会丢失两个元素的所有附加属性！
        // concat: function(data){
        //     this
        //     return $()
        // }
        //堆栈功能

        //链表功能

    };
    //顶层方法 === 脱离继承树！
    _$.isJsonType = (function(elem){
        if((typeof elem == 'object')&&(Object.prototype.toString.call(elem).toLowerCase())=="[object object]"&&!elem.length){
            return true;
        }else{
            return false;
        }
    });
    //访问方法-用于显示差异颜色，afterClass待定！
    _$.visitElement = function(element,beforeClass,delay){
        return function(){
                $(element).addClass(beforeClass);
                setTimeout(
                    function(){
                        $(element).removeClass(beforeClass);
                    }
                ,delay);
            }
    }
    //全局声明
    _$.fn.init.prototype = _$.fn;
    window.$ = _$;
})(window);