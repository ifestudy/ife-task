//依赖于$
(function($,window){
	class editor {
		constructor(selector,robot) {
			//TODO：自动补全功能未能完成！
			//用于记录是否呼出自动补全
			this.flag = false;
			//用于记录录入内容
			this.str = "";
			//用于记录选择位置
			this.pos = 0;
			//用于检测是否存在语法错误
			this.syntaxError = false;
			
			this.element = $(selector);

			// this.element

			this.lines = this.element.find(".command-line");
			this.editor = this.element.find(".editor");
			// this.poscheck = this.element.find(".poscheck");
			// this.poscheck = $(".poscheck");
			//这里必须使用bind绑定因为我们需要返回一个函数，call和apply无法实现
			this.editor.on("scroll",this.onScroll.bind(this));
			this.editor.on("input",this.onInput.bind(this));
			// this.editor.on("keypress",this.onKeypress.bind(this));
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
		onInput( event  ) {
			// this.lines.appen()
			var value = this.editor.val();
			// this.poscheck[0].innerHTML = value;
			this.update();
		}
		// onKeypress( event ) {
		// 	if( this.flag ) {
		// 		var command = this.robot.commandList;
		// 		var match = [];
		// 		this.str += event.key;
		// 		for(var i in command){
		// 			if( this.str.match( command[i] ) )
		// 				match.push( command[i] );
		// 		}
		// 		randerSyntax( match );
		// 		if( event.keyCode == 38 ) {
		// 			this.pos -= 1; 
		// 			event.preventDefault();
		// 		}
		// 		if( event.keyCode == 40 ) {
		// 			this.pos += 1; 
		// 			event.preventDefault();
		// 		}
		// 		return;
		// 	}
		// 	if( event.keyCode == 32 ) {
		// 		this.flag = true;
		// 	}else{
		// 		this.flag = false;
		// 	}
		// }
		// randerSyntax( match ) {

		// }
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