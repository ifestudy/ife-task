/**
*理解错题意55555
*后面有看到这里的小伙伴注意啦！这里的操作完全可以直接用element代替，而不是自己写一个bTree！
*因为element本身就是一个多叉树，添加一个方法就可以做到了
*/

// 数据层
//mtree start======================================
(function(window,$,undefined){
	//采用工厂生成node
	var _node = function(data){
		return new _node.fn.node(data);
	};
	_node.fn = _node.prototype = {
		title: null,
		element:null,
		constructor: _node,
		node: function(data){
			this.data = data;
			this.children = [];
			return this;
		},
		isOpen: true,
		data: null,
		parent: null,
		index: 0,
		children: [],
		setData: function(data,element){
			//施工中！
		},
		remove: function(){
			if(this.parent){
				$(this.element).remove();
				this.parent.children.splice(this.index,1);
				for (var i = this.index; i < this.parent.children.length; i++) {
					this.parent.children[i].index = i;
				};
				if(this.parent.children.length == 0) this.parent.children = null;
				return true;
			}else{
				console.log("不能删除根节点，若删除根节点，请使用mTree.remove()");
				return false;
			}
		},
		addNew: function(data,element,title){
			if(data) {
				var newNode = _node(data);
				newNode.parent = this;
				newNode.title = title;
				newNode.element = element;
				if(this.children) {
					newNode.index = this.children.length;
				}else{
					newNode.index = 0;
					this.children = [];
				}
				$(this.element).append(element);
				this.children.push(newNode);
				return newNode;
			}
		}
	};
	//采用工厂产生btree
	var _mTree = function(data){
		return new _mTree.fn.init(data);
	};
	_mTree.fn = _mTree.prototype = {
		node: null,	
		_length: 0,
		constructor: _mTree,
		init: function(data){
			var loop = function(node,data){
				if((data instanceof Array)&&(data)) {
					$(data).each(function(i,item){
						if(item.data){
							node.children[i] = _node(item.data);
							//记录父亲
							node.children[i].parent = node;
							//记录位于父亲元素中的位置
							node.children[i].index = parseInt(i);
							loop(node.children[i],item.children);
						}
					});
					
				}else{
					node.children = null;
				}
			}
			//使用json创建一个多叉树
			//结构{data:data1,children:[node1,node2,node3]}
			if($.isJsonType(data)&&data.data){
				this.node = _node(data.data)
				var node = this.node;
				$(data.children).each(function(i,item){
					if(item.data){
						node.children[i] = _node(item.data);
						//记录父亲
						node.children[i].parent = node;
						//记录位于父亲元素中的位置
						node.children[i].index = parseInt(i);
						loop(node.children[i],item.children);
					}
				});
				this.node = node;
				return this;
			}
		},
		//深度优先算法
		//参考至 http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
		traverseDF: function(callback) {
			(function recurse(currentNode) {
				if(currentNode.children){
					for (var i = 0, length = currentNode.children.length; i < length; i++) {
						recurse(currentNode.children[i]);
					}
				}
				callback.call(currentNode,currentNode.element,currentNode.title);
			})(this.node);

		},
		//广度优先算法
		//参考至 http://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
		traverseBF : function(callback) {
			//先访问本级节点->入栈
			//堆栈->取出最先放入节点->将该节点的孩子放入堆栈->执行操作
			var queue = [];
			queue.push(this.node);
			currentNode = queue.shift();
			while(currentNode){
				if(currentNode.children){
					for (var i = 0, length = currentNode.children.length; i < length; i++) {
						queue.push(currentNode.children[i]);
					}
				}
				callback.call(currentNode,currentNode.element,currentNode.title);
        		currentNode = queue.shift();
			}

		},
	};
	//为每个生成的目标添加对应的fn方法
	_node.fn.node.prototype = _node.fn;
	_mTree.fn.init.prototype = _mTree.fn;
	//映射btree至windows，但不映射node以保护节点类不被直接访问
	window.mTree = _mTree;
})(window,$);
//mtree end======================================

(function(){
	//变量声明start======================================
	var speed = 500,
		randerStack = [];
	//数据
	var data = 
		{data:'x',children:[
			{data:'a',children:[
				{data:'h',children:[
					{data:'l'}
				]},
				{data:'i'},
				{data:'j'}
			]},
			{data:'c',children:[
				{data:'h'}
			]},
			{data:'d',children:[
				{data:'e'},
				{data:'f'},
			]}
		]};
	var mtree = mTree(data);
	//被选择节点指针
	var selectedNode;
	//变量声明end======================================
	var createNewElement = function(){
		var newElement = document.createElement("ul");
		$(newElement).addClass("context").addClass("bg-white");
		return newElement;
	};

	var createTitle = function(node,element,data){
		var _li = document.createElement("li");
		$(element).append(_li);
		node.title = _li;
		_li.innerText = data;
		return _li;
	};
	var toggleNode = function(node){
		if(node.children){
			if(node.isOpen){
				node.isOpen = false;
				$(node.title).removeClass("open");
				$(node.children).each(function(){
					$(this.element).addClass("display-none");
				});
			}else{
				node.isOpen = true;
				$(node.title).addClass("open");
				$(node.children).each(function(){
					$(this.element).removeClass("display-none");
				});
			}
		}
	};
	//每个元素的监听事件绑定
	var addDataListener = function(_li,node){
		$(_li).on('click',function(event){
			//移除之前元素的样式
			if( selectedNode ) $(selectedNode.title).removeClass('selectedTree');
			//将node绑定到指针
			selectedNode = node;
			//添加样式
			$(this).addClass('selectedTree');
			toggleNode(node);
			event.stopPropagation();
			// return false;
		});
	};

	(function init(){

		//根节点单独设置
		mtree.node.element = createNewElement();
		$(mtree.node.element).addClass("root");
		$("#display").append(mtree.node.element);

		//输出结构
		(function buildConstrut(node,content){
			//如果存在根节点则输出p
			if(node.data){
				//生成一个标题元素
				var _li = createTitle(node,content,node.data);
				addDataListener(_li,node);
				//如果node存在子元素则添加drop-down
				// $(_li).removeClass("file").removeClass("drop-down");
				if(node.children){
					$(_li).addClass("drop-down").addClass("open");
				}else{
					$(_li).addClass("file");
				}
			}

			//如果是子节点则生成
			$(node.children).each(function(){
				var node = this;
				this.element = createNewElement();
				$(content).append(this.element);
				buildConstrut(this,this.element);
			});
		})(mtree.node,mtree.node.element);
	})();
	
	$("#search").on("click",function(){
		//
		var query = $("#query").val();
		mtree.traverseDF(function(element){$(element).removeClass('bg-grey');});
		var visitElement = function(element,title){		
			randerStack.push($.visitElement(title,"bg-blue",speed));
			//TODO:光顾着写遍历了，忘记写查询了！！！！
			if(this.data == query){
				randerStack.push(function(){
					$(title).addClass('bg-grey');
				});
				var node = this.parent
				while( node != null ){
					if (!node.isOpen) toggleNode(node); // 若是收拢状态，则展开
					node = node.parent;
				}
			}
		}
		switch($("#order").val()){
			case "1":mtree.traverseDF(visitElement);break;
			case "2":mtree.traverseBF(visitElement);break;
		}
		$("#search")[0].disabled = true;
		var rander = setInterval(
			function() {
				if(randerStack.length > 0){
					randerStack.shift()();
				}else{
					clearInterval(rander);
					$("#search")[0].disabled = false;
				}
			}
		,speed);
	});

	$("#delete").on('click',function(){
		var parentNode = selectedNode.parent;
		if(!selectedNode.remove()) {
			alert("不允许移除根节点")
		}else{
			if(!parentNode.children) {
				$(parentNode.title).removeClass("drop-down").addClass("file");
			}
		}
	});

	$("#addNew").on('click',function(){
		var data = $("#newNode").val();
		var newElement = createNewElement();
		var node = selectedNode.addNew(data,newElement);
		var _li = createTitle(node,newElement,data)
		$(_li).addClass("file");
		addDataListener(_li,node);
		$(selectedNode.title).removeClass("file").addClass("drop-down");
	});
})();