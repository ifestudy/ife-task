(function($,window){
	"use strict";
	//纯dom型写法！
	//不良好的设计哈哈！！！
	var inputData = $("#input-data");
	$("#l-in").on('click',function(){
		var _div = $(document.createElement("div"));
		_div.addClass("bg-red");
		_div[0].innerHTML = inputData.val();
		$("#display").appendBefore(_div);
		inputData.val("");
	});
	$("#r-in").on('click',function(){
		var _div = $(document.createElement("div"));
		_div.addClass("bg-red");
		_div[0].innerHTML = inputData.val();
		$("#display").append(_div);
	});
	$("#l-out").on('click',function(){
		$("#display").pop('left');
	});
	$("#r-out").on('click',function(){
		$("#display").pop();
	});
})($,window);