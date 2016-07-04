(function($,window,undefined){//扩充的undefined，使得内部的undefined变量能在运行时体现出来
	var va = function(){
		// renderStack 是用来储存渲染的内容
		// [[[对象,颜色,高度]……]……]
		// var this.renderStack;
		var domStack;
		var stack = [];
		// 事件间隔33ms
		var timeinterval = 5;
		// calculate
		function random() {
			stack = [];
			for(var i=0 ; i<50;i++){
				stack.push(Math.floor(Math.random()*101));
			}
		}
		function calculate(){
			// 将每一步都计算出来！并推入stack
			// 标记为绿色的是待处理的块，标记为红色的是已经处理完成的块
			// 标记为蓝色的块是目标块，标记为黄色的块是在被处理的块
			this.renderStack = [];
			// 先全部变绿
			var tmp = [];
			$(stack).each(function(i,item){
				tmp.push([i,'green',item]);
			});
			// 推入堆栈
			this.renderStack.push(tmp);
			for (var i = 0; i < stack.length; i++) {
				// this.renderStack.push([[i,'blue',null]]);
				this.renderStack.push([[i,'blue',stack[i]]]);
				for (var j = 0; j < i; j++) {
					this.renderStack.push([[j,'yellow',stack[j]]]);
					if (parseInt(stack[j]) > parseInt(stack[i])) {
						this.renderStack.push([[j,'red',stack[j]],[i,'blue',stack[i]]]);
						var temp = stack[j];
						stack[j] = stack[i];
						stack[i] = temp;
						this.renderStack.push([[j,'red',stack[j]],[i,'blue',stack[i]]]);
						this.renderStack.push([[j,'green',stack[j]]]);
					}
					this.renderStack.push([[j,'green',stack[j]]]);
					this.renderStack.push([[i,'blue',stack[i]]]);
				}
				this.renderStack.push([[i,'green',stack[i]]]);
	        }
		}
		function iniRander(dom){
			$(dom)[0].innerHTML = "";
			domStack = [];
			// 按照stack生成目标
			var sum = 0;
			$(stack).each(function(i,item){
				//左边要5！
				sum += 5;
				var _div = $(document.createElement("div"));
				_div.addClass("red");
				_div.addClass("block");
				//设置一下高度和位置
				_div.css({"height":item+"%","left":sum+"px"});
				$(dom).append(_div);
				domStack.push(_div);
				//加上宽度右边也要5！
				sum += (parseInt(10)+5);
			});
		}
		function sorts(){
			// 看什么看你得先计算呀！
			calculate();
			// 按照stack依照一定频率逐步渲染
			// 启动计时器！
			setTimeout('VA.rander()',timeinterval);
		}
		function rander(){
			var instruction = renderStack.shift();
			if(!instruction){
				return false;
			}else{
				$(instruction).each(function(i,item){
					domStack[item[0]].removeClass('red').removeClass('blue').removeClass('green').removeClass('yellow').addClass(item[1]).css('height',item[2]+"%");
				});
				setTimeout('VA.rander()',timeinterval);
			}
		}
		//一些共有方法
		function unshift(value){
			return stack.unshift(value);
		}
		function pop(){
			return stack.pop();
		}
		function shift(){
			return stack.shift();
		}
		function push(value){
			return stack.push(value);
		}
		function setTimeStap(value){
			timeinterval = value;
		}
		//将一些内容暴露给全局
		return {
			renderStack:[],
			rander:rander,
			iniRander:iniRander,
			unshift:unshift,
			pop:pop,
			shift:shift,
			push:push,
			sorts:sorts,
			random:random,
			setTimeStap:setTimeStap
		};
	}
	//把模块送给window大大
	window.VA = new va();
})($,window);

// 初始化方法
(function(VA){
	// 绑定各个事件到button
	var inputData = $("#input-data");
	$("#l-in").on('click',function(){
		var value = inputData.val().trim();
		validate(value)?VA.unshift(value)&&(inputData[0].placeholder=""):inputData[0].placeholder="请输入正确的数字类型";
		inputData.val("");
		VA.iniRander("#display");
	});
	$("#r-in").on('click',function(){
		var value = inputData.val().trim();
		validate(value)?VA.push(value)&&(inputData[0].placeholder=""):inputData[0].placeholder="请输入正确的数字类型";
		inputData.val("");
		VA.iniRander("#display");
	});
	$("#l-out").on('click',function(){
		VA.shift();
		VA.iniRander("#display");
	});
	$("#r-out").on('click',function(){
		VA.pop();
		VA.iniRander("#display");
	});
	$("#sort").on('click',VA.sorts);
	$("#rand").on('click',function(){VA.random();VA.iniRander("#display")});
	$("#timestap").on('change',function(){VA.setTimeStap($("#timestap").val());});
	//快快快！别让小白乱输入会出错的！
	function validate(val){
		return (/(^\d{1,2}$)|(^100$)/g.test(val)?true:false);
	}
})(VA);//小尾巴，带上VA才能运作