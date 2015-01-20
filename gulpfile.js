var gulp = require('gulp'),
    connect = require('gulp-connect'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    jshint = require('gulp-jshint');

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('build', [ 'bower-files', 'html', 'js', 'connect', 'watch']);

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('src/**/*.html')
      .pipe(gulp.dest('dist'));
})

gulp.task('js', function() {
  gulp.src('src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(gulp.dest('dist'));
})

gulp.task('watch', function() {
  gulp.watch(['src/**/*.html'], ['html', 'reload']);
  gulp.watch(['src/**/*.js'], ['js', 'reload']);
});

gulp.task('bower-files', function() {
  gulp.src(bowerFiles(), { base: 'bower_components' })
      .pipe(gulp.dest('dist/lib'));
});

gulp.task('clean', function(cb) {
  del('dist', cb);
});

gulp.task('reload', function() {
  connect.reload();
});
