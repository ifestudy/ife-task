(function() {
    "use strict";
    //确保不被重复加载
    var _$ = window.$,
        // 用于保存整个
        rootQuery = [],
        _$ = function(selector){
        //生成器每一次返回一个新的对象
        return new _$.fn.init(selector,rootQuery);
    };

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
            if ( (typeof selector == 'array') || (typeof selector == 'object') ||((typeof elem == 'object')&&(Object.prototype.toString.call(elem).toLowerCase())=="[object object]"&&!elem.length) ) {
                var elem = selector;
                this.selector = elem.selector;
                this[0] = elem;
                this.length = elem.length;
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
                    //如果有两个参数那必然是遍历设置
                    this.each(function(i,item){ 
                        this.style[attr] = css;
                    });
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
                        item.className = ClassName;
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

        },
        last : function(){

        },
        remove : function(){
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
        before: function (str) {
            for (var i = 0; i < this.length; i++) {
                this[i].insertAdjacentHTML('beforeBegin', str);
            }
            return this;
        },
        after: function (str) {
            for (var i = 0; i < this.length; i++) {
                this[i].insertAdjacentHTML('afterEnd', str);
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
            //预留检测位置！
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
        },
        //只返回第一个
        val : function() {
            return this[0].value;
        },
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
        data : function(dataName) {
            // var dataName = dataName;
            if ((!dataName) || (dataName=="")) {
                return this[0].getAttribute('data');
            }else{
                return this[0].getAttribute('data-'+dataName);
            };
        }
    };
    //全局声明
    _$.fn.init.prototype = _$.fn;
    window.$ = _$;
})(window);