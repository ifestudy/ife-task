//map类
(function($,square){
	class map {
		constructor(size) {
			this.size = size;
			this.walls = Array(size * size);
		}
		haveWall(x,y) {
			if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return false;
			return this.walls[this.size * y + x]?false:true;
		}
		getWall(x,y) {
			if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return undefined;
			return this.walls[this.size * y + x];
		}
		buildWall(x,y,color) {
			this.walls[this.size * y + x] = color ? color : undefined;
		}
	}
	square.prototype.map = map;
})($,square);