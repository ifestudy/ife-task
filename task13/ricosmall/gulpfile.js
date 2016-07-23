// TODO: 加载需要的组件
var gulp = require('gulp');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// TODO: 生成副本
gulp.task('rename', function(){
    gulp.src("index.html")
        .pipe(rename("task00013-ricosmall.html"))
        .pipe(gulp.dest("./"));
});

// TODO: 静态服务器 + 监听index.html
gulp.task('serve', ['watch'], function(){
    browserSync.init({
        server: "./"
    });

    gulp.watch("index.html").on('change', reload);
});

// TODO: 监听index.html并执行rename
gulp.task('watch', function(){
    gulp.watch("index.html", ['rename']);
});

// TODO:
gulp.task('default', ['serve']);
