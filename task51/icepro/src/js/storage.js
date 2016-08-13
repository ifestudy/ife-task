(function() {
    //初始化
    if (!localStorage.getItem("question")) {
        localStorage.setItem("question", JSON.stringify([]));
    }
    if (!localStorage.getItem("lastPage")) {
        localStorage.setItem("lastPage", "table");
    }
    var _question = {};
    //question的格式
    //{"LTime":time String,"status":0~5,"title":String,"content":Json}
    var questionnaire = {
        constructor: function() {

        },
        addNew: function() {
            var now = new Date();
            var _question = this.question;
            _question.push({
                "LTime": now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay(),
                "status": 0,
                "title": "这是我的第一份问卷调查",
                "content": {}
            });
            this.question = _question;
        },
        set question(json) {
            //储存格式[json,json……]
            localStorage.setItem("question", JSON.stringify(json));
        },
        get question() {
            return JSON.parse(localStorage.getItem("question"));
        }
    };

    window.questionnaire = questionnaire;
})();