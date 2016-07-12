(function(){
	//常量命名start=====================

	//常量命名end=======================
	// universe 
	// contain one planet and several spaceship

	/**
	* spaceManager
	* 1. create
	* 2. destroy
	* 3. callMediator
	* 
	*/

	/**
	* Mediator
	* 遍历传入的飞船列表把signal发送给他们
	*/


	/**
	* spaceship
	* 1. states
	* 2. signalReceiver
	* 3. id
	* 4. orbital
	*/


	// energySystem - +2% energy

	// engineeSystem
	/**
	* 1. run 
	*   - speed:20px
	*   - consumption:5%
	* 2. stop
	*
	*/

	// signal
	/**
	* setSignal
	* getId
	* getCommand
	*/
	var signal = function(log){
		var id = null,
			command = null,
			log = log;
		return {
			setSignal: function(){
				if(this.caller instanceof commander){

				}else{
					console.log("your command has been denied");
					// log.input("your command has been denied");
				}
			},
			getId: function(){

			},
			getCommand: function(){

			}
		};
	}
	/**
	* commander
	* 
	*/

	/**
	* log寄存器
	*/

});