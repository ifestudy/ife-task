//所有内容通过square访问
var canvas = $('#canvas');
var square = new square(".command-editor",canvas[0].getContext('2d'),25);
//只需要绘制一次就可以关闭了，节省性能
square.rander.start();
square.rander.stop();
// var exec = square.robot.isInCommandList( "tun lef" );
// square.robot.invoke( exec );
// console.log(exec);
var timer;
$("#run").on('click',function(){
	square.rander.start();
	var arr = square.robot.run(square.editor.getCode(),square.editor.syntaxError);
	console.log(arr);
	var index = 0;
	if(arr)
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
					setTimeout(square.rander.stop(),1000);
				}
				index++;
			}else{
				arr = null;
				$(square.editor.lines[0].children).removeClass("visit");
				clearInterval(timer);
				setTimeout(square.rander.stop(),1000);
			}
		},1000);
});
