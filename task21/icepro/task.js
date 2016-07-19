(function($,window){
	//上方tag的操作
	//绑定key
	$("#tag").on("keydown",function(event){
		if((event.keyCode == 13) || (event.keyCode == 32) || (event.keyCode == 188) || (event.keyCode == 191) || (event.keyCode == 220)){
			var _div = $(document.createElement("div")).addClass("bg-blue");
			_div[0].innerHTML = $(this).val();
			_div.on('mouseenter',function(event){
				$(this).addClass("bg-red");
				$(this).push("<span>点击删除</span>","left");
				event.preventDefault();
			}).on('mouseleave',function(event){
				$(this).removeClass("bg-red");
				$(this).pop("left");
				event.preventDefault();
			}).on('click',function(event){
				$(this).remove();
				event.preventDefault();
			});
			$(this).val("");
			if($("#tags")[0].children.length > 9 ) $("#tags").pop('left');
			$("#tags").push(_div);
			event.preventDefault();
		}
	});
	var stackOfDisplay = {};
	//插入
	$('#insert').on('click',function(){
		var stack = $("#input-data").val().split(/[\s,，、]/g),
			rander = [];
		var tmp = [];
		$("#display div").each(function(){
			tmp.push(this.innerText);
		});
		//拼接一下
		stack = [].concat(tmp,stack);
		tmp = {};
		//去重
		$(stack).each(function(){
			if(!tmp[this]){
				rander.push(this);
			}
		});
		//多余的项目去除
		if(rander.length > 9){
			rander.splice(0,rander.length-10);
		}
		//渲染
		$('#display')[0].innerHTML = "";
		$(rander).each(function(i,item){
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