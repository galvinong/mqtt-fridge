var gulp = require('gulp')
var babel = require('gulp-babel');
var gutil = require('gulp-util')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var connect = require('gulp-connect')
var concat = require('gulp-concat')
var inline = require('gulp-inline')
var minifyCss = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
// var browserify = require('gulp-browserify')
var watch = require('gulp-watch')
var pump = require('pump')

var jsSources = 'public/javascript/*.js'
var sassSources = 'public/css/*.scss'
var htmlSources = 'public/*.html'
var outputDir = 'public/dist'

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

gulp.task('css', function() {
	gulp.src('public/index.html')
	.pipe(inline({
		base: 'public/',
		js: uglify,
		css: [minifyCss, autoprefixer({browsers:['last 2 versions']})],
		disabledTypes: ['svg', 'img', 'js'], // Only inline css files
		ignore: ['./css/do-not-inline-me.css']
	  }))
	  .pipe(gulp.dest(outputDir));
})


gulp.task('watch', function() {
  // watch("css/*.scss", function () {
  //   gulp.start("css")
  // })
	watch(jsSources, function() {
		gulp.start('scripts')
	})
})

gulp.task('scripts', function() {
	gulp.src(jsSources)
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(outputDir))
})
