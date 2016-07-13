(function(window,undefined){
	//常量命名start=====================
	var MAX_NUMBER_OF_SPACESHIP = 4;
	var SIGNAL_SUCCEE_RATE = 0.7;
	var CHARGE_INTERVAL = 5000;
	var TOTAL_ENERGY = 100;
	var CHARGE_RATE = 15;
	var DESTROY = 'destroy';
	var STOP = 'stop';
	var RUN = 'run';
	//常量命名end=======================
	// universe 
	// contain one planet and several spaceship
	/**
	* log寄存器
	*/
	var Log = function(){

	};
	/**
	* spaceManager
	* 1. create
	* 2. destroy
	* 3. callMediator
	* 这是一个单利模式用于返回指定的space，因为space只有一个，且任意地点都可以发现并呼叫space
	*/
	var Space = (function(){
		var _single,
			_commander,
			spaceshipList = [];
		function Constructor(){
			//
			if( _single !== undefined ){
				return _single; 
			}
			this.getSpaceshipList = function(){
				return spaceshipList;
			};
			this.setCommander = function(pCommander){
				_commander = pCommander;
			};
			this.getCommander = function(pCommander){
				return commander;
			};
			this.addNewSpaceship = function(spaceship){
				spaceshipList.push(spaceship);
			};
			this.destroySpaceship = function(spaceship){
				for(var i in spaceshipList){
					if(spaceship === spaceshipList[i]){
						spaceshipList.splice(parseInt(i),1);
						break;
					}
				}
			};
			return this;
		}
		_single = new Constructor();
		return function(){return _single};
	})();


	/**
	* Mediator
	* 这是一个单例模式，因为介质无处不在并且为同一个
	* 这是一个类似于观察者模式的模拟，只是将订阅的对象放置在了space中
	* 遍历传入的飞船列表把signal发送给他们
	*/
	var Mediator = (function(){
		var _single;
		function Constructor(){
			//
			if( _single !== undefined ){
				return _single; 
			}
			//在介质中传播
			this.spread = function(pSignal){
				var space = new space();
				spaceshipList = space.spaceshipList;
				//遍历订阅对象，并按照指定概率发布给对象
				for(var i in spaceshipList){
					if(Math.random() <= SIGNAL_SUCCEE_RATE ) setTimeout(function(){spaceshipList[i].signalReceiver(pSignal)},1000);
				}
			}
			return this;
		}
		_single = new Constructor();
		return function(){return _single;};
	})();

	/**
	* spaceship
	* 1. states
	* 2. signalReceiver
	* 3. id
	* 4. orbital
	* 这是一个常见的简单工厂模式，只负责组装一个全新的spaceship
	*/ 
	//依赖-- energysystem --enginesystem
	var SpaceShip = function(id,orbital){
		var spaceship =  new SpaceShip.fn.init(id,orbital);
		spaceship.setEnergySystem(EnergySystem);
		spaceship.setEngineeSystem(EngineeSystem);
		return spaceship;
	}
	SpaceShip.fn = SpaceShip.prototype = {
		init: function(id,orbital,where){
			this.id = id;
			this.orbital = orbital+1;
			this._states = STOP;
			this.energy = 15;//TOTAL_ENERGY;
			this.where = where;
			this.angle = 0;
			return this;
		},
		constructor: SpaceShip,
		//注入EnergySystem模块
		setEnergySystem: function(pEnergySystem){
			this.energySystem = new pEnergySystem(this);
		},
		setEngineeSystem: function(pEngineeSystem){
			this.engineeSystem = new pEngineeSystem(this);
		},
		set states(states){
			if(states == DESTROY) ;
			//当state被设置的时候
			if(( states == STOP ) && (this.energySystem) && (this.energySystem.start && this.energySystem.stop) ) {
				this.engineeSystem.stop();
				this.energySystem.start();
			}else{
				this.engineeSystem.run();
				this.energySystem.stop();
			}
			states && ( this._states = states );
		},
		get states(){
			//states的读取
			return this._states;
		},
	};
	SpaceShip.fn.init.prototype = SpaceShip.fn;
	//信号接收器-属于自身方法
	SpaceShip.prototype.signalReceiver = function(signal){
		if(signal.getId() == this.id){
			switch(signal.getCommand()){
				case RUN: 
					this.engineeSystem.run();
					break;
				case STOP: 
					this.engineeSystem.stop();
					break;
				case DESTROY: 
					var space = new Space();
					//快告诉宇宙我已经完蛋啦/(ㄒoㄒ)/~~
					space.destroySpaceship(this);
					break;
			}
		}
	};
	
	// 能源模块
	// energySystem - +15%/5s energy
	var EnergySystem = function(spaceship){
		var _timer;
		function stop(){
			clearInterval(_timer);
		}
		function start(){
			_timer = setInterval(
				function(){
					if(spaceship.states != RUN && (parseInt(spaceship.energy) < TOTAL_ENERGY)){
						//动画补间--每隔0.01秒执行一次，共执行50次
						var _times = 0;
						var curation_energy = setInterval(function(){
							_times++;
							if(_times <= CHARGE_RATE){
								spaceship.energy = (parseInt(spaceship.energy) >= TOTAL_ENERGY)?TOTAL_ENERGY:(parseInt(spaceship.energy) + 1).toFixed(0);
							}else{
								clearInterval(curation_energy);
							}
						},33);
					}
					console.log(spaceship.energy);
					//log(_energy);
				}
			,CHARGE_INTERVAL);
		}
		return {
			stop: stop,
			start: start
		}
	};
	// engineeSystem
	/**
	* 1. run 
	*   - speed:20px
	*   - consumption:5%/s
	* 2. stop
	*
	*/
	var EngineeSystem = function(spaceship,speed,consumption){
		this.speed = 20;
		this.consumption = 5;
		var _timer;
		function run(){
			if(spaceship){
				if(spaceship.energy >= 5) {
					//每隔1秒检测一次
					_timer = setInterval(
						function(){
							if(parseInt(spaceship.energy) >= 5){
								//动画补间--每隔0.01秒执行一次，共执行50次
								var _times = 0;
								var curation_energy = setInterval(function(){
									_times++;
									if(_times <= 50){
										spaceship.energy = (spaceship.energy - .1).toFixed(1);
									}else{
										clearInterval(curation_energy);
									}
								},10);
							}else{
								spaceship.states = STOP;
								clearInterval(_timer);
							}
					},1000);
				}
			}
		}
		function stop(){
			clearInterval(_timer);
		}
		return {
			run: run,
			stop: stop
		}
	}

	/**
	* setSignal
	* getSignal
	*/
	var Signal = function(log){
		var _signal,
			_log = log;
		return {
			setSignal: function(pSignal){
				if(this.caller instanceof commander){
					_signal = pSignal;
					console.log("your command has been sended");
					// log.input("your command has been sended");
				}else{
					console.log("your command has been denied");
					// log.input("your command has been denied");
				}
				return this;
			},
			getSignal: function(){
				return _signal;
			},
			getId: function(){
				return _signal.id;
			},
			getCommand: function(){
				return _signal.command;
			}
		};
	};
	/**
	* commander
	* 
	*/
	var Commander = function(){
		this.newid = 0;
		this.lanuchedRocket = 0;
		//轨道记录器
		this.orbital = [null,null,null,null];
		return this;
	};

	Commander.prototype.postCommand = function(pSignal){
		var signal = new Signal(Log).setSignal(pSignal);
		var mediator = new Mediator(Log);
		if(pSignal.getCommand==DESTROY){
			for(var i in this.orbital){
				if(pSignal.getId() == this.orbital[i]){
					this.orbital[i] == null;
				}
			}
		}
	};
	//发射一艘新的宇宙飞船，该命令不会丢失！
	Commander.prototype.launchRocket = function(){
		if(this.lanuchedRocket < MAX_NUMBER_OF_SPACESHIP ){
			for(var i in this.orbital){
				if(!this.orbital[i]) {
					var space = new Space();
					var neworbital = parseInt(i);
					this.orbital[i] = this.newid;
					space.addNewSpaceship( SpaceShip(this.newid,neworbital) );
					this.newid++;
					lanuched = true;
					break;
				}
			}
		}
	}
	

	//rander 模块

	window.Commander = Commander;
	window.Space = Space;
})(window);

	function init(){
		//初始化
		var commander = new Commander();
		var space = new Space();
		space.setCommander(commander);
		commander.launchRocket();
		space.getSpaceshipList()[0].states = 'run';
	}

	init();



	var canvas = document.getElementById('display');
	function randerSpaceShip(ctx,pId,pEnergy,pX,pY,orbital,angle){
			//保存位置
			ctx.save();
			//位移到中心点
			ctx.translate(pX,pY);
			//移动到自己的位置，x：，y：需要向上基础50，以及每轨道间隔50
			ctx.translate( 0 ,-50-50*orbital);
			//每层间隔50
			ctx.translate(0,50+50*orbital);
			//角度位置
			ctx.rotate(angle);
			ctx.translate(0,-50-50*orbital);
			//开始绘制飞船
			//x:需要向左本身的大小/2
			ctx.translate( -50 ,0);
			ctx.beginPath();
			var x              = 20;               // x 坐标值
			var y              = 20;               // y 坐标值
			var radius         = 20;               // 圆弧半径
			var w              = 60;
			var startAngle     = -Math.PI/2;                     // 开始点
			var endAngle       = Math.PI*1/2; // 结束点
			//左边
			ctx.arc(x, y, radius, startAngle, endAngle, true);
			//右边
			ctx.arc(x+w, y, radius, endAngle, startAngle, true);
			ctx.closePath();
			ctx.fillStyle = "orange";
			ctx.fill();
			ctx.font = "18px serif";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "white"
			ctx.fillText("id:"+pId+"/"+pEnergy, 10 , 20);
			//绘制结束，返回储存坐标点
			ctx.restore();
	}
	if (canvas.getContext){
		var ctx = canvas.getContext('2d');
		//声明一个计数器
		var time = 0;
		var centerX = 400,
			centerY = 300;
		function randerSpace(time,ctx){
			ctx.save();
			var space = new Space();
			//绘制space
			//从stack中取出spaceship并渲染
			for(var i in space.getSpaceshipList()){
				var spaceship = space.getSpaceshipList()[i];
				//暂未找到更好的同步方法
				if(spaceship.states == 'run'){
					if (spaceship.angle >= Math.PI*2) {
						spaceship.angle -= Math.PI*2;
					}else{
						spaceship.angle += Math.PI*1/50;
					}
				}
				randerSpaceShip(ctx,spaceship.id,spaceship.energy,centerX,centerY,spaceship.orbital,spaceship.angle);//Math.PI*1/50*(time%100));
				
			}

			ctx.restore();	
			
		}
		setInterval(function(){
			//全地图大小：800*600
			ctx.clearRect(0,0,800,600);

			randerSpace(time,ctx,centerX,centerY);

			//绘制地球位置
			ctx.beginPath();
			ctx.arc(centerX, centerY , 20, 0, 2*Math.PI, true);
			ctx.closePath();
			ctx.fillStyle = "black";
			ctx.fill();

			//计数器累加1
			time++;
			if(time>=100) time = 0;
		},33);
	}


