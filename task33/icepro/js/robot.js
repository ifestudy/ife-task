(function( square ) {
	//该模块是下面所有模块的总类，定义一些常量和访问接口
	class robot {
		constructor(pictureUrl) {
			var self = this;
			this.ROBOT_COMMAND = [
				/^(go)$/,
				/^(tun)\s+(lef|rig|bac)$/
			];
			this.picture = pictureUrl;
			//perDelta代表每秒增量
			this.property = {
				direction:{
					//90 18*90= 
					delta: 0,
					value: 0,
					perDelta: 1620
				},
				x:{
					//1 18*1
					delta: 0,
					value: 0,
					perDelta: 18
				},
				y:{
					//1 18*1
					delta: 0,
					value: 0,
					perDelta: 18
				}
			};

		}
		/**
		*运行
		*@param array[code1,code2,……]
		*@return arr[fn1,fn2,fn3……]
		*/
		run( codes ) {
			let arr = [];
			for( let i in codes ) {
				var exec = isInCommandList( codes[i] );
				if( exec )
					arr.push( function() { invoke( exec ); } );
				else
					return arr;
			}
		}
		//TODO：实现一个invoke接口
		//invoke接受详细的exec
		//列表顺序为 0-匹配字符串 1-匹配分项目1 ……
		//对应的参数为 0-总字符串 1-inject 2-param1 3-param2 ……
		/**
		*呼叫命令
		*@param exec array[mainString,inject,param1……]
		*/
		invoke( exec ) {
			if( exec.length >= 2 ) {
				//弹出总参数
				exec.pop();
				//弹出匹配参数
				var inject = exec.pop();
				//第一个参数默认是匹配项
				return this.command[ inject ]( ...exec );
			}
		}
		//判断是否在commandlist中，如果存在，返回对应的exec列表
		//不存在则返回exec
		/**
		*判断是否在commandlist
		*@param string 输入代码串
		*@return true: array[mainString,inject,param1……] false:false
		*/
		isInCommandList( str ) {
			for( let j in this.ROBOT_COMMAND ) {
				//输出顺序为 0-匹配字符串 1-匹配分项目1 ……
				let arr = this.ROBOT_COMMAND[j].exec(str);
				if( arr ) {
					let index = this.commandList.indexOf(arr[1]);
					if ( index > -1 ) {
						return exec;
					}
				}
			}
			return false;
		}
		//command列表
		get command() {
			//指令的常量储存
			// GO：向蓝色边所面向的方向前进一格（一格等同于正方形的边长）
			// TUN LEF：向左转（逆时针旋转90度）
			// TUN RIG：向右转（顺时针旋转90度）
			// TUN BAC：向右转（旋转180度）


			//command必须返回成功或者失败！
			return {
				go : function() {
					let x = this.property.x.value,
						y = this.property.y.value;
					switch( this.property.direction.value % 360 ) {
						case 0: 
							if( square.map.haveWall(x,y+1) )
								this.property.y.delta += 1;
							else
								return false;
							break;
						case 90: 
							if( square.map.haveWall(x+1,y) )
								this.property.x.delta += 1;
							else
								return false;
							break;
						case 180: 
							if( square.map.haveWall(x-1,y) )
								this.property.x.delta -= 1;
							else
								return false;
							break;
						case 270: 
							if( square.map.haveWall(x,y-1) )
								this.property.y.delta -= 1;
							else
								return false;
							break;
					}
					console.log('go has been called');
					return true;
				},
				tun : function( direction ) {
					switch(direction){
						case 'lef': this.property.x.delta = -90;break;
						case 'rig': this.property.x.delta = +90;break;
						case 'bac': this.property.x.delta = +180;break;
					}
					console.log('tun has been called');
					return true;
				}
			};
		}
		get commandList() {
			let list = [];
			for(let i in this.command) list.push(i);
			return list;
		}
		update(time){
			for(let i in this.property){
				//当前剩余delta属性不为0则进行更新
				if( this.property[i].delta !== 0 ){
					//计算绝对值
					if( Math.abs(this.property[i].delta) - this.property[i].perDelta * time * 0.5 > 0 ){
						//如果绝对值大于0，则说明剩余量大于当前时间的计算量
						this.property[i].value += this.property[i].delta > 0 ? this.property[i].perDelta * time * 0.5 : - this.property[i].perDelta * time * 0.5;
						this.property[i].delta += this.property[i].delta > 0 ? this.property[i].perDelta * time * 0.5 : - this.property[i].perDelta * time * 0.5;
					}else{
						//若小于0，则说明需要将delta归零，并减去剩余的delta
						this.property[i].value += this.property[i].delta;
						this.property[i].delta = 0;
					}
				}
			}
			//专门修正角度
			if(this.property.direction.value < 0) this.property.direction.value += 360;
			if(this.property.direction.value >= 360) this.property.direction.value -= 360;
		}
	}
	square.prototype.robot = robot;


})(square);