/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var city = $("#aqi-city-input");
var value = $("#aqi-value-input");
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var cityName = city.val().trim(),
		cityValue = value.val().trim();
	if(/(^[a-zA-Z\s]+$)|(^[^x00-xff]+$)/g.test(cityName)&&/^[\d]+$/g.test(cityValue)){
		aqiData[cityName] = cityValue;
		$("#aqi-table").append('<td>'+cityName+'</td><td>'+cityValue+'</td><td><button data="'+cityName+'">删除</button></td></td>');
		return true;
	}else{
		alert("非法输入");
		return false;
	}
}

/**
 * 渲染aqi-table表格//不做全表渲染了！但保留做他用
 */
function renderAqiList() {
	// $(aqiData).each(function(city,value){
	// 	$("#aqi-table").append('<td>'+city+'</td><td>'+value+'</td><td><button data="'+city+'">删除</button></td></td>');
	// });
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	// renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
	// do sth.
	if(this.tagName.toLowerCase() == "button"){
		delete aqiData[$(this).data()];
		$(this).parent().parent().remove();
	}
	// renderAqiList();
}

function init() {

	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	$('#add-btn').on('click',function(){
		addBtnHandle();
	});
	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	$('#aqi-table').on('click',function(event){
		delBtnHandle.call(event.target);
	});
	$("#aqi-table").append("<td>城市</td><td>空气质量</td><td>操作</td>");
}

init();