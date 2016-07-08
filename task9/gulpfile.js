// gulp/task/css.js
var gulp = require('gulp');
var sass = require('gulp-sass');
//文件合并
var concat = require('gulp-concat');
//文件更名
var rename = require('gulp-rename');
//css压缩
var minifycss = require('gulp-minify-css');
//html文件@@include导入
var fileinclude = require('gulp-file-include');
//自动对css和js文件增加版本号
var rev = require('gulp-rev-append');
//gulp监视器
var watch = require('gulp-watch');
var gulpSequence = require('gulp-sequence');



gulp.task('html', function(){
	gulp.src('src/html/index.html')
		.pipe(fileinclude())
		.pipe(gulp.dest("dist/"))
		.pipe(rev())
		.pipe(gulp.dest('dist/'));
});

gulp.task('sass', function(){
    return gulp.src('src/main.scss')
    	//.pipe(sourcemaps.init())
        .pipe(sass({ style: 'expanded'}))
        //.pipe(sourcemaps.write('css/maps'))
        .pipe(gulp.dest("dist/css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest("dist/css"))
});

gulp.task('img', function(){
    return gulp.src('src/img/**/*.png')
        .pipe(gulp.dest("dist/img"))
});

gulp.task('watch', function(){
	//监视css和sass
    watch(["src/css/**/*.scss","src/css/**/*.css"], function(){  //监听所有less
        gulp.start('sass');             //出现修改、立马执行less任务
    })
    //监视html
    watch("src/html/**/*.html", function(){  //监听所有html
        gulp.start('html');             //出现修改、立马执行html任务
    })
    //监视img
    watch("src/html/img/**/*.png", function(){  //监听所有html
        gulp.start('html');             //出现修改、立马执行html任务
    })
})
//执行一遍work，理论上应该先删除的（先手动吧）
gulp.task('work',function(cb){
	gulpSequence(['sass'],'img','html')(cb);
});//,'watch']);

gulp.task('default',['work','watch']);
