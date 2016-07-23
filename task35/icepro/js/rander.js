//rander类
(function(square){
	class rander {
		constructor(ctx,map,robot) {
			this.frame = this.frame.bind(this);
			this.lastTime = 0;
			this.ctx = ctx;
			this.randering = false;
			this.map = map;
			this.robot = robot;
			//默认间隔间隔应当大于30否则将会导致数字遮住方框
			this.space = 30;
		}
		setSpace(size){
			this.space = size;
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
			this.ctx.clearRect(0,0,800,600);
			this.randerMap(seconds);
			this.randerRob(seconds);
		}
		update(seconds){
			this.robot.update(seconds);
		}
		//TODO:渲染map
		randerMap(){
			//正方形画起来~~~
			var ctx = this.ctx;
			for( let y = 0 ; y < this.map.size ; y++  ) {
				for( let x = 0 ; x < this.map.size ; x++ ) {
					//保存位置
					ctx.save();

					ctx.fillStyle = "#" + (this.map.getWall(x,y)?this.map.getWall(x,y):"FFFFFF");
			 		ctx.strokeRect(this.space + this.space*x,this.space + this.space*y,this.space,this.space); 
					//绘制结束，返回到之前储存状态
					ctx.restore();
				}
			}
			//加点字加点字~~
			//横向的字
			for( let x = 0 ; x <= this.map.size ; x++  ) {
				//保存位置
				ctx.save();
				//位移到中心点
				ctx.translate( 5 + this.space*x , 0 );
				ctx.font = "18px serif";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "black";
				ctx.fillText( x , 10 , this.space/2);
				//绘制结束，返回到之前储存状态
				ctx.restore();
			}
			for( let y = 1 ; y <= this.map.size ; y++  ) {
				//保存位置
				ctx.save();
				//位移到中心点
				ctx.translate( 0 , 0 + this.space*y );
				ctx.font = "18px serif";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "black";
				ctx.fillText( y , 10 , this.space/2);
				//绘制结束，返回到之前储存状态
				ctx.restore();
			}
		}
		//TODO:渲染rob
		randerRob(){
			let property = this.robot.property,
				ctx = this.ctx;
			//保存位置
			ctx.save();
			//移动到方格位置
			ctx.translate(this.space,this.space);
			//移动到实际在的位置
			ctx.translate(this.space*property.x.value+1,this.space*property.y.value+1);
			//移动到中心的位置
			ctx.translate((this.space-2)/2,(this.space-2)/2);
			//角度位置
			ctx.rotate(property.direction.value/360*2*Math.PI);
			ctx.translate(-(this.space-2)/2,-(this.space-2)/2);
			ctx.fillStyle = "blue";
			//宽度要减去2以保证在框框内
			ctx.fillRect(0,0,this.space-2,1/4*this.space);
			ctx.fillStyle = "red";
			//高度要减去2以保证在框框内
			ctx.fillRect(0,1/4*this.space,this.space-2,3/4*this.space-2);
			//绘制结束，返回到之前储存状态
			ctx.restore();
		}
	}
	square.prototype.rander = rander;
})(square);