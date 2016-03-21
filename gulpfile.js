
var gulp = require('gulp');
var gulpSwig = require('gulp-swig');
var swig = require('swig');
var del = require('del');

gulp.task('templates', function() {
  var swigOpts = {
    defaults : {
      loader: swig.loaders.fs(__dirname + '/src'),
      autoescape: false,
      cache: false
    }
  }
	gulp.src('src/index.html')
	  .pipe(gulpSwig(swigOpts))
		.pipe(gulp.dest('dist/'))
});

gulp.task('assets', function() {
  gulp.src('src/!(components)/**/!(*.html)')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
	return del(['dist']);
});

gulp.task('build', ['clean'], function() {
  gulp.start('templates');
  gulp.start('assets');
});

