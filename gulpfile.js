/**
 * Created by timur on 9/5/16.
 */

const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const Promise = require('bluebird')
const execAsync = Promise.promisify(require('child_process').exec)
const rimrafAsync = Promise.promisify(require('rimraf'))
const log = require('gutil-color-log')


const paths = {
  
  all: path.join(path.resolve('src'), '**/*'),
  html: path.join(path.resolve('src'), '**/*.html'),
  css: path.join(path.resolve('src'), '**/*.css'),
  js: path.join(path.resolve('src'), '**/*.js'),
  dist: path.resolve('dist'),
  webpack: path.resolve('node_modules/.bin/webpack'),
  mainJs: path.resolve('dist/main/main.js')
}

gulp.task('clean', () => rimrafAsync(paths.dist))

gulp.task('transpile', ['clean'], () => gulp.src(paths.js).pipe(babel()).pipe(gulp.dest(paths.dist)))

gulp.task('copy', ['clean'], () => gulp.src([paths.html, paths.css]).pipe(gulp.dest(paths.dist)))

gulp.task('bundle', ['clean'], () => execAsync(paths.webpack))

gulp.task('build', ['clean', 'transpile', 'copy', 'bundle'])

gulp.task('watch', () => gulp.watch(paths.all, ['build']))
