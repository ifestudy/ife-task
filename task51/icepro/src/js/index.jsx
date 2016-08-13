//查看页面的页面
var SqaTr = React.createClass({
	callEdit: function(){
		this.props.callEdit(this.props.index);
	},
	render: function(){
		var url = '#/page/'+this.props.index;
        return (
        	<tr>
	        	<td>{this.props.item.title}</td>
	        	<td>{this.props.item.LTime}</td>
	        	<td>{this.props.item.status}</td>
	        	<td><a href={url} onClick={this.callEdit}>edit</a></td>
        	</tr>
    	)
    }
});
var SqaTable = React.createClass({
	callEdit: function(index){
	    var page = "edit";
	    // 这里要注意：setState 是一个异步方法，所以需要操作缓存的当前值
	    this.props.callPageChange(page,index);
	},
    render:function(){
        let items = window.questionnaire.question,
    		self = this;
        return (
	        <table>
				<tbody>
				<tr><th>标题</th><th>时间</th><th>状态</th><th>操作</th></tr>
                {
                	items.map(function (item,index) {
                		return <SqaTr  key={index} item={item} index={index} callEdit={self.callEdit}/>
                	})
                }
				</tbody>
			</table>
        )
    }
});
var Edit = React.createClass({
	render: function(){
		return (
			<h1>这是新的页面,index是{this.props.index}</h1>
		)
	}
});
var PageControl = React.createClass({
	getInitialState: function() {
		var page = localStorage.getItem("lastPage");
		return {
			page: page
		};
	},
	callPageChange: function(page,index){
		this.setState({
			page: page,
			index: index
	    });
	},
	render: function(){
		var page = "nothing";
		if (this.state.page == "edit") {
		  page = <Edit index={this.state.index} />;
		} else if(this.state.page == "table"){
		  page = <SqaTable callPageChange={this.callPageChange} />;
		}
		return (
			<div>{page}</div>
		)
	}
});
ReactDOM.render(<PageControl/>,document.getElementById('content'))