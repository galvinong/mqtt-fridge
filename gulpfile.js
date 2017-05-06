var gulp = require('gulp')
var gutil = require('gulp-util')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var connect = require('gulp-connect')
var pump = require('pump')

var jsSources = ['public/javascript/*.js']
var sassSources = ['public/css/*.scss']
var htmlSources = ['public/*.html']
var outputDir = 'assets'

gulp.task('copy', function() {
  gulp.src('index.html')
  .pipe(gulp.dest('assets'))
})

gulp.task('log', function() {
	gutil.log('== My Log Task ==')
})

gulp.task('sass', function() {
	gulp.src(sassSources)
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('assets'))
  .pipe(connect.reload())
})

gulp.task('compress', function(cb) {
	pump([
		gulp.src('public/javascript/*.js'),
		uglify(),
		gulp.dest('dist'),
	],
    cb
  )
})
