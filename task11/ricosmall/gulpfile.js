

var gulp = require('gulp');

var rename = require('gulp-rename');

var sass = require('gulp-sass');

var bs = require('browser-sync').create();
var reload = bs.reload;


gulp.task('rename', function(){
    return gulp.src("index.html")
        .pipe(rename("task00011-ricosmall.html"))
        .pipe(gulp.dest("./"));
});


gulp.task('sass', function(){
    return gulp.src("*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(bs.stream());
});


gulp.task('serve', ['sass'], function(){
    bs.init({
        server: "./"
    });


    gulp.watch("*.scss", ['sass']);
    gulp.watch("index.html").on('change', reload);
});

gulp.task('watch', function(){
    gulp.watch("index.html", ['rename']);
    gulp.watch("img/*.svg").on('change', reload);
});


gulp.task('default', ['serve', 'watch']);
