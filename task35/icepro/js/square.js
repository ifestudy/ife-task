(function($,window){
	//该模块是下面所有模块的总类，定义一些常量和访问接口
	class square {
		constructor( editorDom , ctx , mapSize) {
			this.map = new this.map(mapSize);
			this.robot = new this.robot(this.map);
			this.editor = new this.editor(editorDom,this.robot);
			this.rander = new this.rander(ctx,this.map,this.robot);
		}
	}
	window.square = square;
})($,window);