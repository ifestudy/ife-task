// (function(){
	//常量命名start=====================

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
			this.spaceshipList = [];
			this.setCommander = function(pCommander){
				_commander = pCommander;
			}
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
					if(Math.random() <= 0.7) setTimeout(function(){spaceshipList[i].signalReceiver(pSignal)},1000);
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
			this.orbital = orbital;
			this._states = 'stop';
			this.energy = 100;
			this.where = where;
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
			if(states == 'destroy') ;
			//当state被设置的时候
			if(( states == 'stop' ) && (this.energySystem) && (this.energySystem.start && this.energySystem.stop) ) {
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
				case 'run': 
					this.engineeSystem.run();
					break;
				case 'stop': 
					this.engineeSystem.stop();
					break;
				case 'destroy': 
					var space = new Space();
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
			var chargeRate = 15;
			_timer = setInterval(
				function(){
					if(spaceship.states != 'run'){
						spaceship.energy += 15;
					}
					if(spaceship.energy >= 100){
						spaceship.energy = 100;
					}
					console.log(spaceship.energy);
					//log(_energy);
				}
			,5000);
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
					_timer = setInterval(
						function(){
							if(spaceship.energy >= 5){
								spaceship.energy -= 5;
							}else{
								clearInterval(_timer);
							}
						}
					,1000);
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
		if(pSignal.getCommand=='destroy'){
			for(var i in this.orbital){
				if(pSignal.getId() == this.orbital[i]){
					this.orbital[i] == null;
				}
			}
		}
	};
	//发射一艘新的宇宙飞船，该命令不会丢失！
	Commander.prototype.launchRocket = function(){
		if(lanuchedRocket < 4 ){
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
	
// });
	function init(){
		//初始化
		var commander = new Commander();
		var space = new Space();
		space.setCommander(commander);
	}

	init();