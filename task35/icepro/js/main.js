//所有内容通过square访问
var canvas = $('#canvas');
var square = new square(".command-editor",canvas[0].getContext('2d'),10);

square.rander.start();
// var exec = square.robot.isInCommandList( "tun lef" );
// square.robot.invoke( exec );
// console.log(exec);
var timer;
$("#run").on('click',function(){
	var arr = square.robot.run(square.editor.getCode(),square.editor.syntaxError);
	console.log(arr);
	var index = 0;
	timer = setInterval(function(){
		if(arr.length > 0){
			$(square.editor.lines[0].children).removeClass("visit");
			$(square.editor.lines[0].children[index]).addClass("visit");
			var fn = arr.shift();
			if(!fn()){
				$(square.editor.lines[0].children).removeClass("visit");
				$(square.editor.lines[0].children[index]).addClass("error");
				arr = null;
				clearInterval(timer);
			}
			index++;
		}else{
			arr = null;
			$(square.editor.lines[0].children).removeClass("visit");
			clearInterval(timer);
		}
	},1000);
});
