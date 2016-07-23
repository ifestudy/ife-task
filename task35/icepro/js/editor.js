//依赖于$
(function($,window){
	class editor {
		constructor(selector,robot) {
			//用于记录是否呼出自动补全
			this.flag = false;
			//用于检测是否存在语法错误
			this.syntaxError = false;
			//用于记录错误列表
			
			this.element = $(selector);
			this.lines = this.element.find(".command-line");
			this.editor = this.element.find(".editor");
			//这里必须使用bind绑定因为我们需要返回一个函数，call和apply无法实现
			this.editor.on("scroll",this.onScroll.bind(this));
			this.editor.on("input",this.onInput.bind(this));
			this.robot = robot;
			this.update();
		}
		/**
		*滚轮事件，同步行号和内容
		*/
		onScroll( event ) {
			this.lines.css( "top" , -event.target.scrollTop + "px" );
		}
		/**
		*输入事件，监听退格，空格和回车（退格时，考虑删除多行情况下重新渲染行号，空格呼出代码提示，回车增加行）
		*/
		onInput( event ) {
			// this.lines.appen()
			this.update();
		}
		/**
		* 获取总行号
		* @return int lineLength
		*/
		get line() {
			let content = this.editor.val();
			return content.split("\n").length;
		}
		/**
		* 解构代码
		* @return int lineLength
		*/
		getCode() {
			let content = this.editor.val();
			//map循环去除前后空格并全部转化为小写
			return content.split("\n").map((value)=>value.trim().toLowerCase());
		}
		/**
		* 更新行号
		* 
		*/
		update() {
			this.syntaxError = false;
			let lineLength = this.line,
				codes = this.getCode();
			this.lines[0].innerHTML = "";
			for (let i = 1; i <= lineLength; i++) {
				if(this.robot.isInCommandList( codes[i-1] )){
					this.syntaxError = this.syntaxError||false;
					this.lines.push('<div class="command-line-item">'+i+'</div>');
				}else{
					this.syntaxError = this.syntaxError||true;
					this.lines.push('<div class="command-line-item error">'+i+'</div>');
				}
			}
			
		}
	}
	square.prototype.editor = editor;
})($,square);