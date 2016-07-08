
//加载gulp
var gulp = require('gulp');
//加载gulp—sass
var sass = require('gulp-sass');
//加载gulp—rename
var rename = require('gulp-rename');
//加载browser—sync
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//自动生成task00010-ricosmall.html
gulp.task('rename', function(){
    return gulp.src("index.html")
        .pipe(rename("task00010-ricosmall.html"))
        .pipe(gulp.dest("./"));
});

//自动编译sass
gulp.task('sass', function(){
    return gulp.src("main.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

//静态服务器 ＋ 监听＊.scss / index.html
gulp.task('serve', ['sass'], function(){
    browserSync.init({
        server: "./"
    });


    gulp.watch("*.scss", ['sass']);
    gulp.watch("index.html").on('change', reload);
});

//一键运行
gulp.task('default', ['serve']);
