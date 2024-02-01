const gulp = require('gulp')
const del = require('del')
const child_process = require('child_process')
const path = require('path')
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

function clean() {
  return del('build')
}

function buildScripts() {
  return multipleExec(
    `esbuild --bundle src/scripts/index.ts --outfile=build/scripts/main.js --minify`,
    'esbuild --bundle src/scripts/prerenderIndex.ts --outfile=build/scripts/prerender.js --minify',
  )
}

function watchScripts() {
  return gulp.watch(['src/**/*.ts'], buildScripts)
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

const proxyUrls = [
  '/api/projects',
  '/api/tvl/aggregate',
  '/api/activity/aggregate',
]

function serve() {
  const app = express()
  app.use(express.static('build'))
  app.get('/', (req, res) => {
    res.redirect('/scaling/summary')
  })

  const deploymentEnvironment = process.env.DEPLOYMENT_ENV || 'ci'
  const apiUrl = {
    ci: 'https://api.l2beat.com',
    production: 'https://api.l2beat.com',
    staging: 'https://staging.l2beat.com',
    local: 'http://localhost:3000',
  }[deploymentEnvironment]
  if (!apiUrl) {
    throw new Error('Unknown environment: ' + deploymentEnvironment)
  }

  for (const proxyUrl of proxyUrls) {
    app.use(
      proxyUrl,
      createProxyMiddleware({
        target: apiUrl,
        changeOrigin: true,
      }),
    )
  }

  const server = app.listen(8080, '0.0.0.0')
  console.log('Listening on http://localhost:8080')
  return server
}

const build = gulp.series(
  clean,
  gulp.parallel(buildScripts, buildStyles, buildContent, copyStatic),
  ...(process.env.GENERATE_METAIMAGES ? [generateMetaImages] : []),
)

const watch = gulp.series(
  gulp.parallel(buildScripts, buildStyles, buildContent, copyStatic),
  gulp.parallel(watchScripts, watchStyles, watchContent, watchStatic, serve),
)

module.exports = {
  clean,
  watch,
  build,
}

// Utilities

function multipleExec(...commands) {
  return Promise.all(commands.map((command) => exec(command)))
}

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
