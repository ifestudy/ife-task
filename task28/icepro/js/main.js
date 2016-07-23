//懒得做分模块了，抽象的不好，不推荐学习
(function(window,$,undefined){
	"use strict";
	//常量命名start=====================
	var MAX_NUMBER_OF_SPACESHIP = 4;
	var BUS_SUCCEE_RATE = 0.9;
	var BUS_SPEED = 300;
	var MEDIATOR_SUCCEE_RATE = 0.7;
	var MEDIATOR_SPEED = 1000;
	var CHARGE_INTERVAL = 1000;
	var TOTAL_ENERGY = 100;
	var CHARGE_RATE = 15;
	var SPEED = 0.25;
	var DESTROY = 'destroy';
	var STOP = 'stop';
	var RUN = 'run';
	//常量命名end=======================
	// universe 
	// contain one planet and several spaceship
	/**
	* log寄存器
	* 这是一个映射到window的单例Log模块
	* 在使用前必须要先设置渲染位置
	* 允许全部刷新
	*/
	var Log = (function(){
		var _single,
			log = [],
			randerPlace;
		function Constructor(){
			//
			if(  _single !== undefined ){
				return _single; 
			}
			this.setRanderPlace = function(obj){
				randerPlace = obj;
			}
			this.log = function(str){
				if(log.length >= 10){
					log.shift();
					$(randerPlace).pop('left');
				}
				log.push(str);
				this.pushLog(str);
			}
			this.pushLog = function(str){
				str = '$ > ' + str;
				var _li = document.createElement('li');
				$(randerPlace).append(_li);
				var times = 1,
					time = 50;
				var _timer = function(){
					if(time > 20 ) time -= 2;
					if(times <= str.length ){
						_li.innerHTML = str.substr(0,times);
						times++
						setTimeout(_timer,time);
					}
				}
				setTimeout(_timer,time);
			}
			this.randerLog = function(){
				$(randerPlace)[0].innerHTML = "";
				$(log).each(function(){
					this.pushLog(this);
				});
			}
			return this;
		}
		_single = new Constructor();
		return _single;
	})();
	/**
	* spaceManager
	* 1. create
	* 2. destroy
	* 3. callMediator
	* 这是一个单利模式用于返回指定的space，因为space只有一个，且任意地点都可以发现并呼叫space
	* 尚未做到内部元素的封闭，理论上spaceship的各项操作应当作出明显的界定区分呼叫函数
	*/
	var Space = (function(undefined){
		var _single,
			_commander,
			spaceshipList = [];
		function Constructor(){
			//
			if(  _single !== undefined ){
				return _single; 
			}
			this.getSpaceshipList = function(){
				return spaceshipList;
			};
			this.setCommander = function(pCommander){
				_commander = pCommander;
			};
			this.getCommander = function(pCommander){
				return _commander;
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
				var space = new Space();
				var spaceshipList = space.getSpaceshipList();
				//遍历订阅对象，并按照指定概率发布给对象
				setTimeout(function(){
					for(var i in spaceshipList){
						if(Math.random() <= MEDIATOR_SUCCEE_RATE ) {
							var spaceship = spaceshipList[i];
							spaceship.signalReceiver(pSignal)
						}	
					}
				},MEDIATOR_SPEED);
			}
			return this;
		}
		_single = new Constructor();
		return function(){return _single;};
	})();
	//和Mediator介质差不多又比这货好一点的bus
	var Bus = (function(){
		var _single;
		function Constructor(){
			//
			if( _single !== undefined ){
				return _single; 
			}
			//在介质中传播
			this.spread = function(codeBin){
				var space = new Space();
				var spaceshipList = space.getSpaceshipList();
				var commander = space.getCommander();
				//遍历订阅对象，并按照指定概率发布给对象
				function sendCommand(){
					if(Math.random() <= BUS_SUCCEE_RATE ) {
						if(codeBin.length <= 8){	
							for(var i in spaceshipList){
								var spaceship = spaceshipList[i];
								spaceship.signalReceiver(codeBin);
							}
						}else{
							commander.getCommand(codeBin);
						}
					}else{
						//失败则自动重试
						Log.log("bus侦测到信号发送失败，正在重新发送...");
						setTimeout(sendCommand,BUS_SPEED);
					}
				}
				setTimeout(sendCommand,BUS_SPEED);//BUS_SPEED);
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
	var SpaceShip = function(id,orbital,enginee,energy){
		var spaceship =  new SpaceShip.fn.init(id,orbital);
		//按照需求组装引擎
		switch(enginee){
			case 'advance':spaceship.setEngineeSystem(EngineeSystem,30,5,'前进型');break;
			case 'pentium':spaceship.setEngineeSystem(EngineeSystem,50,7,'奔腾型');break;
			case 'beyond':spaceship.setEngineeSystem(EngineeSystem,80,9,'超越型');break;
			default: spaceship.setEngineeSystem(EngineeSystem,30,5,'前进型');break;
		};
		//按照需求组装能源模块
		switch(energy){
			case 'power':spaceship.setEnergySystem(EnergySystem,2,'强力型');break;
			case 'light':spaceship.setEnergySystem(EnergySystem,3,'光能型');break;
			case 'forever':spaceship.setEnergySystem(EnergySystem,4,'永久型');break;
			default:spaceship.setEnergySystem(EnergySystem,2,'强力型');break;
		};
		//快看一艘崭新亮闪闪的飞船诞生啦！
		return spaceship;
	}
	SpaceShip.fn = SpaceShip.prototype = {
		init: function(id,orbital){
			this.id = id;
			this.orbital = parseInt(orbital)+1;
			this._states = STOP;
			this.energy = 100;//TOTAL_ENERGY;
			this.angle = 0;
			//启动信息返回器
			var self = this;
			this._timer = setInterval(
				function(){
					var bus = new Bus();
					// 获得信号
					var signal = self.adapter({id:self.id,command:self.states,energy:parseInt(self.energy)});
					bus.spread(signal.getCodeBin());
				}
			,3000);
			// this._timer;
			// this.speed = speed;
			return this;
		},
		constructor: SpaceShip,
		//注入EnergySystem模块
		setEnergySystem: function(pEnergySystem,speed,name){
			this.energySystem = new pEnergySystem(this,speed,name);
		},
		setEngineeSystem: function(pEngineeSystem,speed,consumption){
			this.engineeSystem = new pEngineeSystem(this,speed,consumption,name);
		},
		get engineeName(){
			return this.engineeSystem.getName();
		},
		get energyName(){
			return this.energySystem.getName();
		},
		get speed(){
			return this.engineeSystem.getSpeedPerFrame();
		},
		set states(states){
			if(states == DESTROY || this._states == DESTROY ) {
				this._states = states;
				//销毁状态否决一切操作
				return;
			}
			//当state被设置的时候
			if( states == STOP ) {
				this.engineeSystem.stop();
				this.energySystem.start();
				this._states = states ;
			}
			if( states == RUN && (this._states == STOP)){
				if(parseInt(this.energy)>=5) {
					this.engineeSystem.run();
					this._states = states ;

				} 
				this.energySystem.stop();
			}
		},
		get states(){
			//states的读取
			return this._states;
		},
	};
	SpaceShip.fn.init.prototype = SpaceShip.fn;
	// SpaceShip.prototype.bus = function(){
		
	// };
	//信号接收器-属于自身方法
	SpaceShip.prototype.signalReceiver = function(codeBin){
		var signal = this.adapter(codeBin);
		if(signal.getId() == this.id){
			switch(signal.getCommand()){
				case RUN: 
					this.states = RUN;
					break;
				case STOP: 
					this.states = STOP;
					break;
				case DESTROY: 
					var space = new Space();
					this.states = DESTROY;
					var self = this;
					//快告诉宇宙我已经完蛋啦/(ㄒoㄒ)/~~
					//设定一秒后销毁方便可以看出是否在晓慧中
					setTimeout(function(){
						clearInterval(self._timer);
						space.destroySpaceship(self);
					},1000);
					break;
			}
		}
	};
	SpaceShip.prototype.adapter = function(code){
		var signal = new Signal();
		return signal.init(code);
	};
	// 能源模块
	// energySystem - +15%/5s energy
	var EnergySystem = function(spaceship,speed,name){
		var _timer;
		var speed = speed;
		var name = name;
		function stop(){
			clearInterval(_timer);
		}
		function start(){
			if(!_timer) clearInterval(_timer);
			_timer = setInterval(
				function(){
					if(spaceship.states != RUN && (parseInt(spaceship.energy) < TOTAL_ENERGY)){
						//动画补间--每隔0.01秒执行一次，共执行50次
						var _times = 0;
						var curation_energy = setInterval(function(){
							_times++;
							if(_times <= speed){
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
			start: start,
			getName:function(){
				return name;
			}
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
	//由于每一个都只生成一种，使用prototype继承，应该是没有必要的，所以就每次生成一个新的就好了
	var EngineeSystem = function(spaceship,speed,consumption,name){
		var speed = speed;
		var consumption = consumption;
		var _timer;
		var name = name;
		function getSpeedPerFrame(){
			return speed/30;
		}
		function run(){
			if(spaceship){
				if(_timer) clearInterval(_timer);
				if((parseInt(spaceship.energy) >= 5)) {
					//每隔1秒检测一次
					_timer = setInterval(
						function(){
							if(parseInt(spaceship.energy) >= 5){
								//动画补间--每隔0.01秒执行一次，共执行50次
								var _times = 0;
								var curation_energy = setInterval(function(){
									_times++;
									if(_times <= (consumption*10)){
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
			stop: stop,
			getSpeedPerFrame:getSpeedPerFrame,
			getName:function(){
				return name;
			}
		}
	}

	/**
	* setSignal
	* getSignal
	*/
	var Signal = function(log){
		var _signal;
		var _codeBin;
		return {
			init: function(code){
				if($.isJsonType(code)){
					return this.setSignal(code);
				}else{
					return this.setCodeBin(code);
				}
			},
			setSignal: function(pSignal){
				_signal = pSignal;
				_codeBin = this.getCodeBin();
				return this;
			},
			setCodeBin: function(codeBin){
				_codeBin = codeBin;
				_signal = this.getSignal();
				return this;
			},
			getSignal: function(){
				var id = _codeBin.substr(0,4);
				var command = _codeBin.substr(4,4);
				var energy = _codeBin.substr(8,8);
				switch(command){
					case "0001": command = RUN;break;
					case "0010":command = DESTROY;break;
					case "0011": command = STOP;break;
					default: command = RUN;break;
				}
				_signal = {id:parseInt(id,2),command:command,energy:parseInt(energy,2)}
				return _signal;
			},
			getId: function(){
				return _signal['id'];
			},
			getCommand: function(){
				return _signal['command'];
			},
			getEnergy: function(){
				return _signal['energy'];
			},
			getCodeBin: function(){
				var id = parseInt(_signal['id']).toString(2);
				id = ("0000" + id);
				id = id.substring(id.length-4);
				if( _signal['energy'] ){
					var energy = parseInt(_signal['energy']).toString(2);
					energy = ("00000000" + energy);
					energy = energy.substring(energy.length-8);
				}else{
					var energy = "";
				}
				var command;
				switch(_signal['command']){
					case RUN: command = "0001";break;
					case DESTROY:command = "0010";break;
					case STOP: command = "0011";break;
					default: command = "0011";break;
				}
				return (id+command+energy);
			}
		};
	};
	/**
	* commander
	* 
	*/
	var Commander = function(control,pShipDisplay){
		this.newid = 1;
		this.lanuchedRocket = 0;
		this.control = control;
		this.shipDisplay = pShipDisplay;
		//轨道记录器
		this.orbital = [null,null,null,null];
		//轨道（飞船）对应的按钮记录
		this.controlButton = [];
		this.DC = [];
		//
		for (var i = 4 ; i > 0 ; i--) {
			//显示区
			var _row = $(document.createElement("tr"));
			$(this.shipDisplay).append(_row);
			this.DC.push(_row);

			var _div = $(document.createElement("div"));
			_div.addClass("single");
			var _p = $(document.createElement("p"));
			_div.append(_p);
			$(this.control).append(_div);
			this.controlButton.push(_p);
		};
		//渲染发射菜单
		var _new = $(document.createElement("div"));
		var _p = $(document.createElement("div"));
		var _engine = $(document.createElement("select"));
		var _energy = $(document.createElement("select"));
		var _button = $(document.createElement("button"));
		_button[0].innerHTML = "发射火箭";
		_button.addClass("primary");
		var self = this;
		//增加按钮的侦听（如果按下则发射）
		_button.on('click',function(){
			self.launchRocket();
		});

		//
		_engine.append("<option value='advance'>前进号</option>"+
			"<option value='pentium'>奔腾号</option>"+
			"<option value='beyond'>超越号</option>"
		);
		this.engineSelect = _engine;
		_energy.append("<option value='power'>强劲型</option>"+
			"<option value='light'>光能型</option>"+
			"<option value='forever'>永久型</option>"
		);
		this.energySelect = _energy;
		_p.addClass("new");
		_p.append("<span>发动机:</span>");
		_p.append(_engine);
		_p.append("<span>充能设备:</span>");
		_p.append(_energy);
		_new.append(_p);
		_new.addClass("new");
		_new.append(_button);
		$(this.control).append(_new);
		return this;
	};
	Commander.prototype.getOrbital = function(pId){
		var _id ;
		$(this.orbital).each(function(){
			if(this == pId) {
				_id = pId;
				return false;
			}
		});
		return (_id-1);
	};
	Commander.prototype.buildButton = function(orbital,engine,energy){
		//创建按钮
		var id = parseInt(this.orbital[orbital]);
		var _start = $(document.createElement("button"));
		_start.addClass("primary").data('type',RUN).data('id',id);
		_start[0].innerHTML = "启动引擎";
		var _stop = $(document.createElement("button"));
		_stop.addClass("primary").data('type',STOP).data('id',id);
		_stop[0].innerHTML = "关闭引擎";
		var _destroy = $(document.createElement("button"));
		_destroy.addClass("warning").data('type',DESTROY).data('id',id);
		_destroy[0].innerHTML = "摧毁";
		this.controlButton[orbital].append('<span>第'+id+'号旗舰：</span>');
		this.controlButton[orbital].append(_start);
		this.controlButton[orbital].append(_stop);
		this.controlButton[orbital].append(_destroy);
		var self = this;
		this.controlButton[orbital].on('click',function(event){
			var target = $(event.target);
			switch(target.data('type')){
				case RUN: 
					var pSignal = {id:target.data('id'),command:RUN};
					self.postCommand(pSignal);
					Log.log("{id:"+pSignal.id+",command:"+pSignal.command+"}指令已发出，将在0.3秒后生效");
					break;
				case STOP: 
					var pSignal = {id:target.data('id'),command:STOP};
					self.postCommand(pSignal);
					Log.log("{id:"+pSignal.id+",command:"+pSignal.command+"}指令已发出，将在0.3秒后生效");
					break;
				case DESTROY: 
					var pSignal = {id:target.data('id'),command:DESTROY};
					self.postCommand(pSignal);
					Log.log("{id:"+pSignal.id+",command:"+pSignal.command+"}指令已发出，将在0.3秒后生效");
					break;
				default:

					break;
			}
			event.preventDefault();
		});
		//创建显示区
		var _row = $(document.createElement("tr"));
		//按照需求组装引擎
		switch(engine){
			case 'advance':engine = '前进型';break;
			case 'pentium':engine = '奔腾型';break;
			case 'beyond':engine = '超越型';break;
		};
		//按照需求组装能源模块
		switch(energy){
			case 'power':energy = '强力型';break;
			case 'light':energy = '光能型';break;
			case 'forever':energy = '永久型';break;
		};
		var _row = this.DC[orbital];
		_row.append("<td>"+id+"</td><td>"+engine+"</td><td>"+energy+"</td><td>stop</td><td>100%</td>");

	}
	Commander.prototype.destoryButton = function(orbital){
		this.controlButton[orbital][0].innerHTML = "";
		this.controlButton[orbital].unbind('click');
		this.DC[orbital][0].innerHTML="";
	}
	Commander.prototype.postCommand = function(pSignal){
		var bus = new Bus();
		// 获得信号
		var signal = this.adapter(pSignal);
		//bus只允许传递bin
		bus.spread(signal.getCodeBin());
		//如果命令是destory则在记录的轨道上也删除他
		if(signal.getCommand() == DESTROY){
			for(var i in this.orbital){
				if(signal.getId() == this.orbital[i]){
					Log.log("截获指令摧毁旗舰，id:"+this.orbital[i]+"号旗舰已从信号队列删除");
					this.orbital[i] = null;
					this.destoryButton(parseInt(i));
					this.lanuchedRocket--;
				}
			}
		}
	};
	Commander.prototype.getCommand = function(bincode){
		var signal = this.adapter(bincode);
		var screens = $(this.DC[this.getOrbital(signal.getId())]);
		screens.pop();
		screens.pop();
		screens.push("<td>"+ signal.getCommand() + "</td>");
		screens.push("<td>"+ signal.getEnergy() + "%</td>");
	}

	//发射一艘新的宇宙飞船，该命令不会丢失！
	Commander.prototype.launchRocket = function(){
		if(this.lanuchedRocket < MAX_NUMBER_OF_SPACESHIP ){
			for(var i in this.orbital){
				if(!this.orbital[i]) {
					//如果轨道上面没船就创建
					var space = new Space();
					var neworbital = parseInt(i);
					this.orbital[i] = this.newid;
					space.addNewSpaceship( SpaceShip(this.newid,neworbital,$(this.engineSelect).val(),$(this.energySelect).val()));
					this.newid++;
					this.buildButton(neworbital,$(this.engineSelect).val(),$(this.energySelect).val());
					this.lanuchedRocket++;
					Log.log("成功发射火箭");
					break;
				}
			}
		}else{
			Log.log("轨道已满，请求拒绝");
		}
	}
	Commander.prototype.adapter = function(code){
		var signal = new Signal();
		signal.init(code);
		if(signal.getCodeBin() < 8){
			Log.log("正在编码...编码完成，编码为:"+signal.getCodeBin());
		}else{
			Log.log("解码完成,来自id:"+signal.getId()+"的信号已显示到主屏幕");
		}
		return signal; 
	}

	//rander 模块
	window.Log = Log;
	window.Commander = Commander;
	window.Space = Space;
})(window,$);

	function init(){

		//初始化
		var commander = new Commander($("#control"),$("#ship_display"));
		var space = new Space();
		// var Log = new Log();
		Log.setRanderPlace($("#console"));
		Log.log("系统启动完毕 > ....");
		Log.log("请输入指令 > ....");

		space.setCommander(commander);
		//绑定显示
		$(".open").on("click",function(){
			if($(this).data("display") == 'true'){
				$(this).data("display","false");
				$(".slider").removeClass("active");
				this.innerHTML = ">>";
			}else{
				$(this).data("display","true");
				$(".slider").addClass("active");
				this.innerHTML = "<<";
			}
		});
	}

	init();



	var canvas = document.getElementById('display');
	/**
	* 宇宙飞船渲染函数
	* @param ctx 画布的2dcontent
	* @param spaceship 宇宙飞船
	* @param px float 中心点x
	* @param py float 中心点y

	*/
	function randerSpaceShip(ctx,spaceship,pX,pY){
			var orbital = spaceship.orbital,
				id = spaceship.id,
				energy = spaceship.energy;
			//暂未找到更好的同步方法
			if(spaceship.states == 'run'){
				if (spaceship.angle >= Math.PI*2) {
					spaceship.angle -= Math.PI*2;
				}else{
					//角速度=线速度/半径
					spaceship.angle += spaceship.speed / (50+50*orbital);
				}
			}
			var angle = spaceship.angle;
			//保存位置
			ctx.save();
			//位移到中心点
			ctx.translate(pX,pY);
			//移动到自己的位置，x：，y：需要向上基础50，以及每轨道间隔50
			//所以实际上r是+50+50*orbital
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
			//左手一个半圆
			ctx.arc(x, y, radius, startAngle, endAngle, true);
			//右手一个半圆
			ctx.arc(x+w, y, radius, endAngle, startAngle, true);
			ctx.closePath();
			//快上色，亮闪闪的橘色是不是很好看！
			ctx.fillStyle = "orange";
			ctx.fill();
			//加点字加点字~~
			ctx.font = "18px serif";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "white"
			ctx.fillText("id:"+id+"/"+energy, 10 , 20);
			//绘制结束，返回到之前储存状态
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
				randerSpaceShip(ctx,spaceship,centerX,centerY);//Math.PI*1/50*(time%100));
				
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


