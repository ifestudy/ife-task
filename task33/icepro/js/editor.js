(function($,window){
	class editor {
		constructor(selector) {
			this.element = $(selector);
			this.lines = this.element.find(".command-line");
			this.editor = this.element.find(".editor");
			//这里必须使用bind绑定因为我们需要返回一个函数，call和apply无法实现
			this.editor.on("scroll",this.onScroll.bind(this));
			this.editor.on("input",this.onInput.bind(this));
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
			return content.split("\n").map((value)=>value.trim());
		}
		/**
		* 更新行号
		* 
		*/
		update() {
			let lineLength = this.line;
			this.lines[0].innerHTML = "";
			for (let i = 1; i <= lineLength; i++) {
				this.lines.push('<div class="command-line-item">'+i+'</div>');
			}
			
		}
	}
	window.Editor = editor;
})($,window);