//所有内容通过square访问
var canvas = $('#canvas');
var square = new square(".command-editor", canvas[0].getContext('2d'), 25);
//只需要绘制一次就可以关闭了，节省性能
square.rander.start();
square.rander.stop();
// var exec = square.robot.isInCommandList( "tun lef" );
// square.robot.invoke( exec );
// console.log(exec);
var timer;
$("#run").on('click', function() {
    square.rander.start();
    var arr = square.robot.run(square.editor.getCode(), square.editor.syntaxError);
    console.log(arr);
    var index = 0;
    //设定hold住的次数
    var hold = 0;
    var times = 1000;
    if (arr)
        timer = setInterval(function() {
            if (arr.length > 0) {
                $(square.editor.lines[0].children).removeClass("visit");
                $(square.editor.lines[0].children[index]).addClass("visit");
                var fn = arr.shift()();
                //如果内容是数组，那就把这个数组添加到内部，并hold住回调，同时调整显示间隔为500ms
                if (fn instanceof Array) {
                    hold = fn.length;
                    arr.splice(0, 0, ...fn);
                    fn = arr.shift()();
                }
                if (!fn) {
                    $(square.editor.lines[0].children).removeClass("visit");
                    $(square.editor.lines[0].children[index]).addClass("error");
                    arr = null;
                    clearInterval(timer);
                    setTimeout(square.rander.stop(), 1000);
                }
                //如果不hold住的就设定切换间隔
                if (hold === 0) {
                	times = 1000;
                	index++;
                }else{
                	times = 500;
                	hold--;
                }
            } else {
                arr = null;
                $(square.editor.lines[0].children).removeClass("visit");
                clearInterval(timer);
                setTimeout(square.rander.stop(), 1000);
            }
        }, times);
});