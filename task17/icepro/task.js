/* 数据格式演示
var aqiSourceData = {
    "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
    }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
},
    // 用于渲染图表的数据
    chartData = {},
    //用于渲染的图标位置！
    chartWrap = $(".aqi-chart-wrap");

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    //清空内容TODO: [ ]-清空动画
    chartWrap[0].innerHTML = "";
    //计算并返回min，length，max
    var detail = initAqiChartData();
    //生成start=========
    //TODO: [x]-动画效果！
    //先计算长宽高！
    var width = 50/detail.length;
    //元素间间隔
    var deltaWidth = 40/detail.length;
    //定义一个width的sum，用来设置x方向位置偏移 5*2=10
    var sum = 5;
    //随机生成一个颜色
    var alpha = 0.5;//决定偏色程度
    var rand1 = Math.random( )*0x777777 + 0x111111;
    var rand2 = Math.random( )*0x777777 + 0x888888;
    var delata = rand1 * alpha + (1-alpha) * rand2;
    var baseColor = Math.floor(rand1).toString(16),//.toString(16)
        lighterColor = Math.floor(rand2).toString(16),
        darkerColor = Math.floor(delata).toString(16);
    // #d33434测试通过！
    $("#title")[0].innerHTML = parseInt(detail.max) + "<hr>";
    $(chartData).each(function(i,item){
        //首位位置添加空白
        sum += deltaWidth/2;
        var _div = $(document.createElement('div'));
        _div[0].title = parseInt(item) + '/' + (pageState.nowGraTime == "day"?i:(pageState.nowGraTime == "week")?'第'+(parseInt(i)+1)+'周':i);
        _div.css({"width":width+"%","height":(parseInt(item)/detail.max*100)+"%","left":sum+"%"});
        _div.addClass("column");
        var low = (detail.max-detail.min) * 1/3 + detail.min,
            middle = (detail.max-detail.min) * 2/3 + detail.min;
        //不同级别的颜色选择
        if((item < low) && (item >= detail.min) ){
            _div.css("background-color",("#"+lighterColor))
        }
        if((item > low) && (item < middle) ){
            _div.css("background-color",("#"+baseColor))
        }
        if((item > middle) && (item <= detail.max) ){
            _div.css("background-color",("#"+darkerColor))
        }
        //推入div
        chartWrap.append(_div);
        //末尾位置添加空白
        sum += width + deltaWidth/2;
    });
    // chartWrap.append();
    //生成end ==========
    return true;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化 
    nowGraTime = $("#form-gra-time input:checked")[0].value;
    if(pageState.nowGraTime != nowGraTime ){
        // 设置对应数据
        pageState.nowGraTime = nowGraTime;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化 
    nowSelectCity = $("#city-select")[0].value;
    //使用了 onchange理论上应该是change了的，所以不做处理，但保留函数
    // if(pageState.nowSelectCity != nowSelectCity ){
        // 设置对应数据
        pageState.nowSelectCity = nowSelectCity;
        // 调用图表渲染函数
        renderChart();
    // }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    $("#form-gra-time input").on('click', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = $("#city-select");
    citySelect[0].innerHTML="";
    var index = 0;
    $(aqiSourceData).each(function(i){
        //设置默认城市！
        if(index == 0){
            pageState.nowSelectCity = i;
            index++;
        }
        citySelect.append('<option>'+i+'</option>');
    });
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    $("#city-select").on('change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    chartData = {};
    //for day情况下：counter统计所有
    var counter = 0,
        index = 0,
        max = 0,
        min = 999;
    $(aqiSourceData[pageState.nowSelectCity]).each(function(i,item){
        //day的处理
        var today = new Date(i);
        if(pageState.nowGraTime == "day"){
            chartData[i] = parseInt(item);
            index++;
            max = (max- parseInt(item) > 0)?max:parseInt(item);
            min = (min- parseInt(item) < 0)?min:parseInt(item);
        }else{
            //week的处理
            if(pageState.nowGraTime == "week"){
                var day = today.getDay();
                if( (chartData[index]) && (day == 0) ){
                    //到周一了说明要下移一位！
                    index++;
                }
                if(!chartData[index]){
                    //要加上这个防止出现undefined
                    chartData[index] = [];
                }
                chartData[index].push(item);
                
            }
            //month的处理
            if(pageState.nowGraTime == "month"){
                //将日期补全0处理
                var month = today.getFullYear()+"-"+((today.getMonth()+1)+"").replace(/(^\d$)/g,"0$1");
                if(!chartData[month]){
                    //要加上这个防止出现undefined
                    chartData[month] = [];
                }
                chartData[month].push(item);
            }
        }
    });
    //month/week需要计算平均值，而day不需要！
    if( (pageState.nowGraTime == "month") || (pageState.nowGraTime == "week") ){
        index = 0;
        $(chartData).each(function(i,item){
            index++;
            var sum = 0;
            for (var j in item) {
                sum += item[j];
            };
            chartData[i] = sum/item.length;
            max = (max- chartData[i] > 0)?max:chartData[i];
            min = (min- chartData[i] < 0)?min:chartData[i];
        });
    }
    //最大值以及长度
    //数据计算完毕！返回对应的最大最小和长度！
    return {length:index,max:max,min:min};
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
    //开始先渲染一次
    renderChart();
}

init();