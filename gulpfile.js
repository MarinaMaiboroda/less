var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var tinypng = require('gulp-tinypng-compress');
var del = require('del');
var merge = require('merge-stream');
var notify = require("gulp-notify");
var gulpSequence = require('gulp-sequence');

/* Clean Dist Dir */

gulp.task('clean', function() {
    return del(['./dist/fonts', './dist/images', './dist/css', './dist/js', './dist']);
});

/* Assemble Styles */

gulp.task('styles', function() {
    var lessStream = gulp.src('./assets/less/main.less')
        .pipe(less())
        .pipe(concat('less-files.less'));

    var cssStream = gulp.src('./assets/css/**/*.css')
        .pipe(concat('css-files.css'));

    var mergedStr = merge(lessStream, cssStream)
        .pipe(concat('styles.css'))
        .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
        .pipe(csso())
        .pipe(rename({basename: "general"}))
        .pipe(gulp.dest('./dist/css'))

    return mergedStr;
});


gulp.task('create-main', function() {
    gulp.src('./assets/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./assets/css'))
});

/* Assemble Scripts */

gulp.task('scripts', function() {
    gulp.src(['./assets/js/modernizr.custom.js', './assets/js/jquery.cbpFWSlider.min.js', './assets/js/main.js'])
        .pipe(concat('general.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(notify("All Is Done"));
});

/* Compress Images */

gulp.task('tinypng', function () {
    gulp.src('./assets/images/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: 'key',
            sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('./dist/images'));
});

/* Fonts to Dist */

gulp.task('fonts', function() {
    gulp.src('./assets/fonts/*.*')
    .pipe(gulp.dest('./dist/fonts'));
});

/* Files to Dist */

gulp.task('files', function() {
    gulp.src('./assets/*.html')
        .pipe(gulp.dest('./dist'));
});

/* Build Task */

/*gulp.task('build', gulpSequence('clean', 'fonts', 'files', 'tinypng', 'styles', 'scripts'));*/
gulp.task('build', gulpSequence('clean', 'fonts', 'files', 'styles', 'scripts'));


/* Watcher for Less */

gulp.task('watch', function() {
    gulp.watch('./assets/less/**/*.less', ['styles']);
});