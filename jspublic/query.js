(function() {
    "use strict";
    // 用于保存整个
    var _$ = window.$,
        rootQuery = [],
        _$ = function(selector){
        return new _$.fn.init(selector,rootQuery);
    };
    //定义一个fn来初始化并执行一些操作
    /**
    * version 0.0.1存在以下目标
    * 可以选择指定id的标签如#id
    * 可以选择指定class的标签如.class
    * 可以是复合标签如#id .class
    */
    _$.fn = _$.prototype = {
        version: "0.0.1",
        isQuery: true,
        constructor: _$,
        length : 0,
        splice: [].splice,
        selector : '',
        init: function(selector,rootQuery){
            var quickCheck = /^(?=(#[\w-]+$)|([.][\w-]+$)|((?:[#|.][\w-]+[\s]+)+(?:[#|.][\w-]*)$))/g;
            var matchs = quickCheck.exec(selector);
            //如果是null，undefined，和false则直接返回自己就好了
            if ( !selector ) {
                return this;
            }
            //TODO:
            // $0:代表表达式匹配结果默认为空（留作他用）
            // $1:代表表达式匹配结果为id类
            // $2:代表表达式匹配结果为class类
            // $3:一个多级列表
            // $4:预留一个tag检测位置
            // $5:预留一个~
            if(matchs){
               if(document.querySelectorAll){
                    this.selector = selector;
                    //TODO: 低版本浏览器兼容
                    var elem = document.querySelectorAll(selector);
                    for (var i = 0; i < elem.length; i++) {
                        this[i] = elem[i];
                    }
                    this.length = elem.length;
                    return this;
                }
                //预留ie接口
            }
            //TODO: tag
            //TODO: 
            // 尚未完成！TODO：
            if ( selector !== undefined ) {}
            if ( (typeof selector == 'array') ||(typeof selector == 'object')) {
                var elem = selector;
                for (var i = 0; i < elem.length; i++) {
                    this[i] = elem[i].concat();
                }
                this.length = elem.length;
                return this;
            }
            if ( selector.isQuery) {
                //如果判断为query，还存在说明这个已经一个query对象了，现在直接返回就行了
                var elem = selector;
                for (var i = 0; i < elem.length; i++) {
                    this[i] = elem[i];
                }
                this.length = elem.length;
                return this;
            }
            //开始判断
            this.selector = selector;
            return this;
        },
        //class
        addClass : function( ClassName ) {

        },
        removeClass : function( ClassName ) {

        },
        //dom操作
        find : function(){

        },
        first : function(){

        },
        last : function(){

        },
        append: function (str) {
            for (var i = 0; i < this.length; i++) {
               this[i].insertAdjacentHTML('beforeEnd', str);
            }
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
            for ( var index = 0 ; index < this.length ; index++ ) {
               if(false === callback.call( this[index]  ,  index  , this[index])) break;
            };
        },
        getPosition : function(){

        },
        on : function( name,listener ){
            this[0].addEventListener(name,listener);
            //TODO:预留ie位置
        },
        val : function() {
            return this[0].value;
        }
    };
    //全局声明
    _$.fn.init.prototype = _$.fn;
    window.$ = _$;
})(window);