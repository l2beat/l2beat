const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const child_process = require('child_process')
const path = require('path')
const express = require('express')

const SCRIPT_IN_PATH = 'src/scripts/**/*.ts'

const STYLE_IN_PATH = 'src/styles/**/*.scss'
const STYLE_OUT_PATH = 'build/styles'

const STATIC_IN_PATH = 'src/static/**/*'
const STATIC_OUT_PATH = 'build'

const CONTENT_IN_PATH = 'src/content/**/*'

const OUT_PATH = 'build'

function exec(command) {
  const nodeModulesHere = path.join(__dirname, './node_modules/.bin')
  const nodeModulesUp = path.join(__dirname, '../node_modules/.bin')
  const PATH = `${nodeModulesHere}:${nodeModulesUp}:${process.env.PATH}`
  return new Promise((resolve, reject) =>
    child_process.exec(command, { env: { PATH } }, (err, stdout, stderr) => {
      stdout && console.log(stdout)
      if (err) {
        stderr && console.error(stderr)
        reject(err)
      } else {
        resolve()
      }
    })
  )
}

function clean() {
  return del(OUT_PATH)
}

function buildScripts() {
  return exec('rollup -c rollup.config.js')
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

function buildContent() {
  return exec('ts-node src/content')
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
