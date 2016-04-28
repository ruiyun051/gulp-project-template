 
// Load plugins
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    jasmine = require('gulp-jasmine'),
    del = require('del');

//html
gulp.task('html', function() {
    return gulp.src("app/*.html")
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
        .pipe(notify({ message: 'html task complete' }));
});


// css
gulp.task('css', function() {
    gulp.src('app/scss/*.scss')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(compass({
            config_file: 'config.rb',
            css: 'app/css',
            sass: 'app/scss'
        }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/css'))
    .pipe(concat('style.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload())
    .pipe(notify({ message: 'css task complete' }));
});
 
// js
gulp.task('js', function() {
  return gulp.src('app/js/**/*.js')
    //.pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload())
    .pipe(notify({ message: 'js task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.{png,jpg,gif,ico}')

    .pipe(cache(imagemin({
        optimizationLevel:5,
        progressive: true ,
        interlaced: true,
        use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload())
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/','app/css/**/*.css'], cb)
});
 
 
// Watch
gulp.task('watch', function() {

  //Watch .html files
  gulp.watch('app/**/*.html', ['html']);

  // Watch .scss files
  gulp.watch('app/scss/**/*.scss', ['css']);

    // Watch .css files
   // gulp.watch('app/css/**/*.css', ['css']);
 
  // Watch .js files
  gulp.watch('app/js/**/*.js', ['js']);
 
  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
 
  // Create LiveReload server
  livereload.listen();
 
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
 
});

//Build
gulp.task('build', ['clean'], function() {
    gulp.start('html','css', 'js', 'images');
});

gulp.task('test', function () {
  return gulp.src('spec/**/*.js')
    .pipe(jasmine());
});


//Server
gulp.task('server', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
  gulp.start('watch');
});

// Default task
gulp.task('default', ['build']);