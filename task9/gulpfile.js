// gulp/task/css.js
var gulp = require('gulp');
var sass = require('gulp-sass');
//文件合并
var concat = require('gulp-concat');
//文件更名
var rename = require('gulp-rename');
//css压缩
var minifycss = require('gulp-minify-css');
var fileinclude = require('gulp-file-include');
var rev = require('gulp-rev-append');
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

gulp.task('work',function(cb){
	gulpSequence(['sass'],'html')(cb);
});//,'watch']);