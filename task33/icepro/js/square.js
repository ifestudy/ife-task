(function($,window){
	//该模块是下面所有模块的总类，定义一些常量和访问接口
	class square {
		constructor(editorDom) {
			this.editor = new this.editor(editorDom);
			this.robot = new this.robot();
		}
	}
	window.square = square;
})($,window);