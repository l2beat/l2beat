const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const child_process = require('child_process')
const path = require('path')
const express = require('express')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const { createProxyMiddleware } = require('http-proxy-middleware')

function clean() {
  return del('build')
}

function buildScripts() {
  return exec(
    `esbuild --bundle src/scripts/index.ts --outfile=build/scripts/main.js --minify`,
  )
}

function watchScripts() {
  return gulp.watch(['src/**/*.ts'], buildScripts)
}

function buildSass() {
  return gulp
    .src('src/styles/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('build/styles'))
}

function watchSass() {
  return gulp.watch('src/styles/**/*.scss', buildSass)
}

function buildStyles() {
  return exec(
    `tailwindcss -i ./src/styles/style.css -o ./build/styles/style.css`,
  )
}

function watchStyles() {
  return gulp.watch(
    ['src/**/*.{css,html,ts,tsx,md}', 'tailwind.config.js'],
    buildStyles,
  )
}

function copyStatic() {
  return gulp.src('src/static/**/*').pipe(gulp.dest('build'))
}

function watchStatic() {
  return gulp.watch('src/static/**/*', copyStatic)
}

function buildContent() {
  return exec(`node -r esbuild-register src/build/buildPages.ts`)
}

function watchContent() {
  return gulp.watch(['src/**/*.{ts,tsx,md}'], buildContent)
}

function generateMetaImages() {
  return exec('node -r esbuild-register src/build/buildMetaImages.ts')
}

async function updateVerifiedContracts() {
  if (
    process.env.DEPLOYMENT_ENV !== 'production' &&
    process.env.DEPLOYMENT_ENV !== 'staging'
  ) {
    return
  }
  const cwd = process.cwd()
  process.chdir('../config')
  await exec('yarn check-verified-contracts')
  process.chdir(cwd)
}

function serve() {
  const app = express()
  app.use(express.static('build'))
  app.get('/', (req, res) => {
    res.redirect('/scaling/summary')
  })
  app.use(
    '/api/projects',
    createProxyMiddleware({
      target:
        process.env.DEPLOYMENT_ENV === 'local'
          ? 'http://localhost:3000'
          : process.env.DEPLOYMENT_ENV === 'staging'
          ? 'https://staging.l2beat.com'
          : 'https://api.l2beat.com',
      changeOrigin: true,
    }),
  )
  const server = app.listen(8080, '0.0.0.0')
  console.log('Listening on http://localhost:8080')
  return server
}

const build = gulp.series(
  clean,
  updateVerifiedContracts,
  gulp.parallel(buildScripts, buildSass, buildStyles, buildContent, copyStatic),
  generateMetaImages,
)

const watch = gulp.series(
  gulp.parallel(buildScripts, buildSass, buildStyles, buildContent, copyStatic),
  gulp.parallel(
    watchScripts,
    watchSass,
    watchStyles,
    watchContent,
    watchStatic,
    serve,
  ),
)

module.exports = {
  clean,
  watch,
  build,
}

// Utilities

function exec(command) {
  const nodeModulesHere = path.join(__dirname, './node_modules/.bin')
  const nodeModulesUp = path.join(__dirname, '../node_modules/.bin')
  const PATH = `${nodeModulesHere}:${nodeModulesUp}:${process.env.PATH}`
  const [name, ...args] = parseCommand(command)
  const cp = child_process.spawn(name, args, {
    env: { ...process.env, PATH },
    stdio: 'inherit',
  })
  return new Promise((resolve, reject) => {
    cp.on('error', reject)
    cp.on('exit', (code) => (code !== 0 ? reject(code) : resolve()))
  })
}

function parseCommand(text) {
  const SURROUNDED = /^"[^"]*"$/
  const NOT_SURROUNDED = /^([^"]|[^"].*?[^"])$/

  const args = []
  let argPart = ''

  for (const arg of text.split(' ')) {
    if ((SURROUNDED.test(arg) || NOT_SURROUNDED.test(arg)) && !argPart) {
      args.push(arg)
    } else {
      argPart = argPart ? argPart + ' ' + arg : arg
      if (argPart.endsWith('"')) {
        args.push(argPart.slice(1, -1))
        argPart = ''
      }
    }
  }

  return args
}
