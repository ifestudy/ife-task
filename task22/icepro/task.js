/**
*理解错题意55555
*后面有看到这里的小伙伴注意啦！这里的操作完全可以直接用element代替，而不是自己写一个bTree！
*因为element本身就是一个多叉树，添加一个方法就可以做到了
*/
(function(window,$,undefined){
	//采用工厂生成node
	var _node = function(data){
		return new _node.fn.node(data);
	};
	_node.fn = _node.prototype = {
		element:null,
		constructor: _node,
		node: function(data){
			this.data = data;
			//同步创建一个树
			this.element = document.createElement("div");
			$(this.element).addClass("bTree");
			if(data){
				$(this.element).append("<p>"+data+"</p>");
			}
			return this;
		},
		setData: function(data){
			this.data = data;
			if(this.element){
				$(this.element.querySelectorAll("p")).remove();
				$(this.element).append("<p>"+data+"</p>");
			}
		},
		setLeft: function(left){
			if(left){
				this.left = left;
				if(this.element) $(this.element).append(this.left.element);
			}
		},
		setRight: function(right){
			if(right){
				this.right = right;
				if(this.element) $(this.element).append(this.right.element);
			}
		},
		getData: function(){
			return this.data;
		},
		getLeft: function(){
			return this.left;
		},
		getRight: function(){
			return this.right;
		},
		removeChild: function(child){
			delete child;
			$(child.element).remove();
		}
	};
	//采用工厂产生btree
	var _bTree = function(data){
		return new bTree.fn.init(data);
	};
	_bTree.fn = _bTree.prototype = {
		node: null,	
		_length: 0,
		constructor: _bTree,
		init: function(data){
			if(data instanceof Array){
				//使用前序创建树，不允许外部访问！
				var createTree = function(node,data){
					//如果节点是null则不处理
					if(!node) return;
					if(data.length > 0){
						//由于哈曼夫树的算法逻辑没看懂
						//数量充足的情况下，该算法可以做到生成一个完全二叉树（满二叉树）
						//但在数量不足的情况下仅仅能够满足最小的AVL树
						//相关的sbTree等等尚无能力复现
						node.setData(data.shift());
						//左侧至少要有一个，如果没有则返回null
						node.setLeft(data.length>0?_node(null):null);
						//先满足左侧，右侧可以为空
						node.setRight(data.length>1?_node(null):null);
						var bp = Math.ceil(data.length/2);
						var left = data.splice(0,bp);
						var right = data;
						createTree(node.getLeft(),left);
						createTree(node.getRight(),right);
					}
				}
				//计算深度
				var data = data.concat();
				//记录元素数量和深度
				this._length = data.length;
				this.depth = Math.ceil(Math.sqrt(data.length + 1));
				if(data.length > 0){
					this.node = _node(null);
					createTree(this.node,data);
				}
				return this;
			}
		},
		//由于只需要显示一次所以加个callback就好了！
		//中序
		inOrder: function(callback){
			var orderloop = function(node,callback){
				if(node){
					orderloop(node.getLeft(),callback);
					callback.call(node.getData(),node.element,node);
					orderloop(node.getRight(),callback);
				}
			}
			orderloop(this.node,callback);
		},
		//前序
		preOrder: function(callback){
			var orderloop = function(node,callback){
				if(node){
					callback.call(node.getData(),node.element,node);
					orderloop(node.getLeft(),callback);
					orderloop(node.getRight(),callback);
				}
			}
			orderloop(this.node,callback);
		},
		//后续
		postOrder: function(callback){
			var orderloop = function(node,callback){
				if(node){
					orderloop(node.getLeft(),callback);
					orderloop(node.getRight(),callback);
					callback.call(node.getData(),node.element,node);
				}
			}
			orderloop(this.node,callback);
		},
	};
	//为每个生成的目标添加对应的fn方法
	_node.fn.node.prototype = _node.fn;
	_bTree.fn.init.prototype = _bTree.fn;
	//映射btree至windows，但不映射node以保护节点类不被直接访问
	window.bTree = _bTree;
})(window,$);

(function(){
	var btree = bTree(['A','B','D','H','I','E','J','C', 'F', 'K','G','L','M','N']);
	var speed = 500;
	$("#display").append(btree.node.element);
	var randerStack = [];
	
	$("#order").on("change",function(){
		var visitElement = function(element){
			randerStack.push(
				function(){
					$(element).addClass("bg-blue");
					setTimeout(
						function(){
							$(element).removeClass("bg-blue");
						}
					,speed);
				}
			);
		}
		switch($(this).val()){
			case "1":btree.preOrder(visitElement);break;
			case "2":btree.inOrder(visitElement);break;
			case "3":btree.postOrder(visitElement);break;
		}
		$("#order")[0].disabled = true;
		var rander = setInterval(
			function() {
				if(randerStack.length > 0){
					randerStack.shift()();
				}else{
					clearInterval(rander);
					$("#order")[0].disabled = false;
				}
			}
		,speed);
	});
})();