//所有内容通过square访问
var canvas = $('#canvas');
var square = new square(".command-editor",canvas[0].getContext('2d'),10);

square.rander.start();
// var exec = square.robot.isInCommandList( "tun lef" );
// square.robot.invoke( exec );
// console.log(exec);
var timer;
$("#run").on('click',function(){
	var arr = square.robot.run(square.editor.getCode());
	console.log(arr);
	timer = setInterval(function(){
		if(arr.length > 0){
			var fn = arr.shift();
			fn();
		}else{
			clearInterval(timer);
		}
	},1000);
});
