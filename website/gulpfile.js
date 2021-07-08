const gulp = require('gulp')
const ts = require('gulp-typescript')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const { exec } = require('child_process')
const express = require('express')

const SCRIPT_IN_PATH = 'src/scripts/**/*.ts'
const SCRIPT_OUT_PATH = 'build/scripts'

const STYLE_IN_PATH = 'src/styles/**/*.scss'
const STYLE_OUT_PATH = 'build/styles'

const STATIC_IN_PATH = 'src/static/**/*'
const STATIC_OUT_PATH = 'build'

const CONTENT_IN_PATH = 'src/content/**/*'

const OUT_PATH = 'build'

const tsProject = ts.createProject('tsconfig.json')

function clean() {
  return del(OUT_PATH)
}

function buildScripts() {
  return gulp
    .src(SCRIPT_IN_PATH)
    .pipe(tsProject())
    .pipe(gulp.dest(SCRIPT_OUT_PATH))
}

function watchScripts() {
  return gulp.watch(SCRIPT_IN_PATH, buildScripts)
}

function buildStyles() {
  return gulp
    .src(STYLE_IN_PATH)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(STYLE_OUT_PATH))
}

function watchStyles() {
  return gulp.watch(STYLE_IN_PATH, buildStyles)
}

function copyStatic() {
  return gulp.src(STATIC_IN_PATH).pipe(gulp.dest(STATIC_OUT_PATH))
}

function watchStatic() {
  return gulp.watch(STATIC_IN_PATH, copyStatic)
}

function buildContent(cb) {
  return exec(
    '../node_modules/.bin/ts-node src/content',
    (err, stdout, stderr) => {
      stdout && console.log(stdout)
      stderr && console.error(stderr)
      cb(err)
    }
  )
}

function watchContent() {
  return gulp.watch(CONTENT_IN_PATH, buildContent)
}

function serve() {
  const app = express()
  app.use(express.static(OUT_PATH))
  const server = app.listen(8080)
  console.log('Listening on http://localhost:8080')
  return server
}

const build = gulp.series(
  clean,
  gulp.parallel(buildScripts, buildStyles, buildContent, copyStatic)
)

const watch = gulp.series(
  build,
  gulp.parallel(watchScripts, watchStyles, watchContent, watchStatic, serve)
)

module.exports = {
  clean,
  watch,
  build,
}
