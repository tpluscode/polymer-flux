var gulp = require('gulp'),
    connect = require('gulp-connect'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    historyApiFallback = require('connect-history-api-fallback'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    gulpIgnore = require('gulp-ignore');

require('web-component-tester').gulp.init(gulp);
//historyApiFallback.setLogger(console.log.bind(console));

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('build', [ 'bower-files', 'html', 'css', 'js', 'connect', 'watch']);

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 10001,
    middleware: function(connect, opt) {
      return [
        historyApiFallback
      ];
    }
  });
});

gulp.task('html', function() {
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    gulp.src('src/**/*.css')
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
  gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(gulp.dest('dist'));
});

gulp.task('compress', function() {
  gulp.src('dist/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'));

  gulp.src('dist/**/*.css')
      .pipe(minifyCSS())
      .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.html'], ['html', 'reload']);
    gulp.watch(['src/**/*.js'], ['js', 'reload']);
    gulp.watch(['src/**/*.css'], ['css', 'reload']);
});

gulp.task('bower-files', function() {
  gulp.src('bower_components/**/*.*', { base: 'bower_components' })
      .pipe(gulpIgnore.exclude("*.map"))
      .pipe(gulp.dest('dist/lib'));
});

gulp.task('clean', function(cb) {
  del('dist', cb);
});

gulp.task('reload', function() {
  connect.reload();
});
