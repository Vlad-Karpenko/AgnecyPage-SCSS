var gulp = require('gulp');
var sass = require('gulp-sass');
var sass_glob = require('gulp-sass-glob');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var reload = browserSync.reload;


gulp.task("sass", function () {
    return gulp.src("./src/scss/app.scss")
        .pipe(sass_glob())
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("main.css"))
        .pipe(gulp.dest("./build/css"))
        .pipe(reload({stream: true}))
});

gulp.task("html", function () {
    gulp.src("./src/index.html")
        .pipe(gulp.dest("./build"))
        .pipe(reload({stream: true}))
});

gulp.task("js", function () {
    gulp.src("./src/js/tabs.js")
        .pipe(gulp.dest("./build/js"))
        .pipe(reload({stream: true}))

});

gulp.task('images', function () {
    return gulp.src("./src/images" + '**/*')
        .pipe(cache(imagemin([
                imagemin.gifsicle({interlaced: true}), //сжатие .gif
                imagemin.jpegtran({progressive: true}), //сжатие .jpeg
                imagemin.optipng({optimizationLevel: 5}), //сжатие .png
                imagemin.svgo({                         // сжатие .svg
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ], {
                verbose: true  //отображает инфо о сжатии изображения
            })
        ))
        .pipe(gulp.dest("./build"))
        .pipe(reload({stream: true}))

});


gulp.task("clean", function () {
    gulp.src("./build/index.html")
        .pipe(clean())

});

gulp.task("clear-cache", function () {
    cache.clearAll()

});

gulp.task("build", shell.task([
    "gulp clean",
    "gulp images",
    "gulp html",
    "gulp sass",
    "gulp js"]));

gulp.task("browser-sync", function () {
    browserSync({
        starPath: "/",
        server: {
            baseDir: "build"
        },
        notify: false
    })

});

gulp.task('server', function () {
    runSequence("build", "browser-sync", "watch")
});

gulp.task("watch", function () {
    gulp.watch("./src/scss/**/*.scss", ["sass"]);
    gulp.watch("./src/index.html", ["html"]);
    gulp.watch("./src/images/**/*", ["images"]);
    gulp.watch("./src/js/**/*.js", ["js"]);
});

