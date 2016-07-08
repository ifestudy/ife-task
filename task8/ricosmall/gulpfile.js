// 加载gulp
var gulp = require('gulp');
// 加载gulp-sass
var sass = require('gulp-sass');
// 重命名html文件
var rename = require('gulp-rename')
// 加载browser-sync
var browserSync = require('browser-sync').create();
// 设置reload
var reload = browserSync.reload;

// 静态服务器 ＋ 监听 scss和html 文件
gulp.task('serve', ['sass'], function(){
    browserSync.init({
        server: "./"
    });

    gulp.watch("*.scss", ['sass']);
    gulp.watch("*.html", ['rename']).on('change', reload);
});

// scss编译后的css注入到浏览器里实时更新
gulp.task('sass', function(){
    return gulp.src('main.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

// 生成task0008-ricosmall.html
gulp.task('rename', function(){
    return gulp.src('index.html')
        .pipe(rename('task0008-ricosmall.html'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['serve']);
