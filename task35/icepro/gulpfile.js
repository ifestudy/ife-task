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
//util
var gutil = require('gulp-util');
//浏览器同步
var browserSync = require('browser-sync').create();
//简化reload
var reload = browserSync.reload;

gulp.task('default',['server']);

gulp.task('sass', function(){
    return gulp.src("sass/main.scss")
        //.pipe(sourcemaps.init())
        .pipe(sass({ style: 'expanded'}))
        .on('error', function(err) {
            gutil.log('sass Error!', err.message)
            this.emit('end')
        })
        //.pipe(sourcemaps.write('css/maps'))
        .pipe(gulp.dest("css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest("css"))
        .pipe(reload({stream:true}))
});
gulp.task('script', function() {
    return gulp.src("js/**/*.js")
        .pipe(jshint({"esnext" : true}))//{"esnext" : true}))
        .pipe(jshint.reporter('default'))
        .pipe(reload({stream:true}))
});
// 浏览器重载
gulp.task('script-watch', ['script'], reload);

// 静态服务器
gulp.task('server', ['sass','script'], function () {
    // 从这个项目的根目录启动服务器
    browserSync.init({
        server: {
            baseDir: ["./","../../jspublic"],
            index: "./task0035.html"
        },
        rewriteRules: [
            {
                match: "../../jspublic/query.js",
                fn: function (match) {
                    return 'query.js';
                }
            }
        ],
        //禁止网络模式
        online: false,
        //静止ui模式
        ui: false

    });

    // 添加 browserSync.reload 到任务队列里
    // 所有的浏览器重载后任务完成。
    gulp.watch("sass/**/*.scss", ['sass']);
    gulp.watch("js/**/*.js", ['script-watch']);
    gulp.watch("*.html").on("change", reload);
});

gulp.task('watch', function(){
    watch("sass/**/*.scss", function(){  //监听所有sass
        gulp.start('sass');             //出现修改、立马执行sass任务
    })
    watch("js/**/*.js", function(){  //监听所有js
        gulp.start('script');             //出现修改、立马执行js任务
    })
})