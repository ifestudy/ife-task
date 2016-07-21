//rander类
(function(square){
	class rander {
		constructor(ctx) {
			this.frame = this.frame.bind(this);
			this.lastTime = 0;
			this.ctx = ctx;
			this.randering = false;
		}
		start() {
			this.randering = true;
			requestAnimationFrame(this.frame);
		}
		stop() {
			this.randering = false;
		}
		frame(time) {
			//得出间隔时间
			var seconds = (time - this.lastTime) / 1000;
			this.lastTime = time;
			//如果间隔时间大于200ms则忽略之
			if (seconds < 0.2) {
				this.update(seconds);
				this.randerLoop(seconds);
			}
			if(this.randering) requestAnimationFrame(this.frame);
		}
		randerLoop(seconds) {
			this.randerMap(seconds);
			this.randerRob(seconds);
		}
		update(seconds){
			square.robot.update();
		}
		//map
		randerMap(){
			
		}
		//robot
		randerRob(){

		}
	}
	square.prototype.rander = rander;
})(square);