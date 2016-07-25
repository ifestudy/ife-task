// 加载需要的插件
var gulp        = require('gulp');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// 生成task00014-ricosmall.html
gulp.task('rename', function(){
	gulp.src("index.html")
		.pipe(rename("task00014-ricosmall.html"))
		.pipe(gulp.dest("./"))
});

// 监听index.html ＋ 触发rename
gulp.task('watch', function(){
	gulp.watch("index.html", ['rename'])
});

// 静态服务器 ＋ 监听index.html ＋ 检查watch
gulp.task('serve', ['watch'], function(){
	// 服务器初始化
	browserSync.init({
		server: "./"
	});

	// 当index.html发生变化的时候重载服务器
	gulp.watch("index.html").on('change', reload)
}); 

// 默认执行serve
gulp.task('default', ['serve']);