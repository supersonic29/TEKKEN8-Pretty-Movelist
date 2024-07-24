const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');

// Compile sass into CSS & auto-inject into browsers
function compileSass() {
    return gulp.src("./../src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./../src/css"))
        .pipe(browserSync.stream());
}

// Minify JavaScript files
function minifyJs() {
    return gulp.src('./../src/js/**/*.js')
        .pipe(minify({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            ignoreFiles: ['*.min.js'],
            preserveComments: 'some',
            noSource: true
        }))
        .pipe(gulp.dest('./../dist/js/'));
}

// Minify CSS files
function minifyCss() {
    return gulp.src('./../src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./../dist/css'));
}

// Static Server + watching scss/html files
function serve() {
    browserSync.init({
        server: "./../"
    });

    gulp.watch("./../src/scss/*.scss", gulp.series(minifyCss));
    gulp.watch("./../src/js/**/*.js", gulp.series(minifyJs));
    gulp.watch("./../index.html").on('change', browserSync.reload);
}

// Define complex tasks
const build = gulp.series(compileSass, gulp.parallel(minifyCss, minifyJs));
const watch = gulp.series(build, serve);

// Export tasks
exports.compileSass = compileSass;
exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;
exports.serve = serve;
exports.build = build;
exports.watch = watch;
exports.default = watch;
