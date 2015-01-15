var gulp = require('gulp'),
    connect = require('gulp-connect'),
    bowerFiles = require('main-bower-files'),
    del = require('del');

gulp.task('default', ['clean', 'bower-files', 'html', 'connect', 'watch']);

gulp.task('connect', ['clean'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('html', ['clean'], function() {
  gulp.src('src/**/*.html')
      .pipe(gulp.dest('dist'));
})

gulp.task('watch', ['clean'], function() {
  gulp.watch(['src/**/*.html'], ['html', 'reload']);
});

gulp.task('bower-files', ['clean'], function() {
  gulp.src(bowerFiles(), { base: 'bower_components' })
      .pipe(gulp.dest('dist/lib'));
});

gulp.task('clean', function(cb) {
  del('dist', cb);
});

gulp.task('reload', function() {
  connect.reload();
});
