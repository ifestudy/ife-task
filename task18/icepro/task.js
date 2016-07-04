(function($,window){
	"use strict";
	//纯dom型写法！
	//不良好的设计哈哈！！！
	function pushElement(type){
		var value = inputData.val().trim()+"";
		if((/\d+/g.test(value))){
			var _div = $(document.createElement("div")).addClass("bg-red");
			_div[0].innerHTML = value;
			$("#display").push(_div,type);
		}
		inputData.val("");
	}

	var inputData = $("#input-data");
	$("#l-in").on('click',function(){
		pushElement('left');
	});
	$("#r-in").on('click',function(){
		pushElement('right');
	});
	$("#l-out").on('click',function(){
		$("#display").pop('left');
	});
	$("#r-out").on('click',function(){
		$("#display").pop();
	});
})($,window);