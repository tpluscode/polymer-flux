var gulp = require('gulp'),
    connect = require('gulp-connect'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    historyApiFallback = require('connect-history-api-fallback'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    gulpIgnore = require('gulp-ignore'),
    vulcanize = require('gulp-vulcanize'),
    htmlmin = require('gulp-minify-html'),
    minifyInline = require('gulp-minify-inline-scripts');

require('web-component-tester').gulp.init(gulp);
//historyApiFallback.setLogger(console.log.bind(console));

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('prod', ['clean'], function() {
    gulp.start('build-prod');
});

gulp.task('build', [ 'bower-files', 'html', 'connect', 'watch']);

gulp.task('build-prod', [ 'bower-files', 'index', 'vulcanize' ]);

gulp.task('vulcanize', function() {
    gulp.src('src/dependencies.html')
        .pipe(vulcanize({
            inlineScripts: true
        }))
        .pipe(htmlmin())
        .pipe(minifyInline())
        .pipe(gulp.dest('dist'));

    gulp.src([
            'src/components/article-box.html',
            'src/components/article-details.html',
            'src/components/search-router.html'
        ], { base: 'src' })
        .pipe(vulcanize())
        .pipe(htmlmin())
        .pipe(minifyInline())
        .pipe(gulp.dest('dist'));
});

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

gulp.task('index', function() {
    gulp.src([ 'src/index.html', 'src/styles.html' ])
        .pipe(htmlmin())
        .pipe(minifyInline())
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
      .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('clean', function(cb) {
  del('dist', cb);
});

gulp.task('reload', function() {
  connect.reload();
});
