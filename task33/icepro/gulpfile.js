// gulpfile.js
var gulp = require('gulp');
var sass = require('gulp-sass');
//如果需要可以生成sourcemap
var sourcemaps = require('gulp-sourcemaps');
//css压缩
var minifycss = require('gulp-minify-css');    
//重命名
var rename = require('gulp-rename');
//gulp监视器
var watch = require('gulp-watch');
//js检测
var jshint = require('gulp-jshint'); 

gulp.task('default',['sass','watch']);

gulp.task('sass', function(){
    return gulp.src("sass/main.scss")
    	//.pipe(sourcemaps.init())
        .pipe(sass({ style: 'expanded'}))
        //.pipe(sourcemaps.write('css/maps'))
        .pipe(gulp.dest("css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest("css"))
});
gulp.task('script', function() {
    return gulp.src("js/**/*.js")
        .pipe(jshint({"esnext" : true}))//{"esnext" : true}))
        .pipe(jshint.reporter('default'))
});


gulp.task('watch', function(){
    watch("sass/**/*.scss", function(){  //监听所有less
        gulp.start('sass');             //出现修改、立马执行less任务
    })
    watch("js/**/*.js", function(){  //监听所有less
        gulp.start('script');             //出现修改、立马执行less任务
    })
})