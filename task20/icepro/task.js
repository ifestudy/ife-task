(function($,window){
	//插入
	$('#insert').on('click',function(){
		var stack = $($("#input-data").val().split(/[\s,，、]/g))
		stack.each(function(i,item){
			var _div = $(document.createElement("div")).addClass("bg-white");
				_div[0].innerHTML = item;
			$('#display').append(_div);
		});
	});
	//查询
	$('#query').on('click',function(){
		var reg = new RegExp($('#reg').val());
		$(".bg-white").each(function(){
			//别犹豫让强调色安心的去吧
			$(this).removeClass("bg-red");
			if(reg.test(this.innerText)){
				//是时候该上色啦！
				$(this).addClass("bg-red");
			}
		});
	});
	
})($,window);