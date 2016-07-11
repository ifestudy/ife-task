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
		//删除节点
		remove: function(){
			if(this.parent){
				//删除元素以及其子元素
				$(this.element).remove();
				//数组中移除该元素
				this.parent.children.splice(this.index,1);
				//index标示修正
				for (var i = this.index; i < this.parent.children.length; i++) {
					this.parent.children[i].index = i;
				};
				//空元素修正
				if(this.parent.children.length == 0) this.parent.children = null;
				return true;
			}else{
				console.log("不能删除根节点，若删除根节点，请使用mTree.remove()");
				return false;
			}
		},
		//添加新节点
		addNew: function(data,element,title){
			//存在data的情况下操作
			if(data) {
				var newNode = _node(data);
				//设置新节点各项属性
				newNode.parent = this;
				newNode.title = title;
				newNode.element = element;
				//存在子节点的情况下修正新元素index，不存在则创建children
				if(this.children) {
					newNode.index = this.children.length;
				}else{
					newNode.index = 0;
					this.children = [];
				}
				$(this.element).append(element);
				this.children.push(newNode);
				//返回节点以做其他处理
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
			//私有元素，不允许外部访问重置mtree
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
			//依次向最深级元素查找，使用递归返还
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
	//创建一个全新的ul元素,此为父级元素
	var createNewElement = function(){
		var newElement = document.createElement("ul");
		$(newElement).addClass("context").addClass("bg-white");
		return newElement;
	};
	//创建一个全新的li元素,此为父级元素的标题
	var createTitle = function(node,element,data){
		var _li = document.createElement("li");
		$(element).append(_li);
		node.title = _li;
		_li.innerText = data;
		return _li;
	};
	//切换node状态
	var toggleNode = function(node){
		//首先要存在children才能被折叠
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
			//对应折叠node
			toggleNode(node);
			event.stopPropagation();
			// return false;
		});
	};
	//初始化
	(function init(){

		//根节点单独设置
		mtree.node.element = createNewElement();
		$(mtree.node.element).addClass("root");
		$("#display").append(mtree.node.element);

		//输出结构
		(function buildConstrut(node,content){
			//如果存在节点则输出li
			if(node.data){
				//生成一个标题元素
				var _li = createTitle(node,content,node.data);
				//为_li添加事件侦听
				addDataListener(_li,node);
				//如果node存在子元素则添加drop-down,否则添加file
				if(node.children){
					$(_li).addClass("drop-down").addClass("open");
				}else{
					$(_li).addClass("file");
				}
			}

			//如果是子节点则递归生成element
			$(node.children).each(function(){
				var node = this;
				this.element = createNewElement();
				$(content).append(this.element);
				buildConstrut(this,this.element);
			});
		})(mtree.node,mtree.node.element);
	})();

	//绑定搜索按钮
	$("#search").on("click",function(){
		var query = $("#query").val();
		//按照深度遍历移除被查找状态
		mtree.traverseDF(function(element){$(element).removeClass('bg-grey');});
		var visitElement = function(element,title){	
			//遍历动画入栈
			randerStack.push($.visitElement(title,"bg-blue",speed));
			if(this.data == query){
				//查找到则标记
				randerStack.push(function(){
					$(title).addClass('bg-grey');
				});
				var node = this.parent
				//逐层向上展开（动画尚未完成）
				while( node != null ){
					if (!node.isOpen) toggleNode(node); // 若是收拢状态，则展开
					node = node.parent;
				}
			}
		}
		//按照获得的类别遍历
		switch($("#order").val()){
			case "1":mtree.traverseDF(visitElement);break;
			case "2":mtree.traverseBF(visitElement);break;
		}

		$("#search")[0].disabled = true;
		//动画
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

	//删除节点
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
	//增加新节点
	$("#addNew").on('click',function(){
		var data = $("#newNode").val();
		var newElement = createNewElement();
		//先生成node
		var node = selectedNode.addNew(data,newElement);
		//将生成title
		var _li = createTitle(node,newElement,data)
		$(_li).addClass("file");
		//添加事件侦听
		addDataListener(_li,node);
		$(selectedNode.title).removeClass("file").addClass("drop-down");
	});
})();