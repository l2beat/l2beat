// Loaded by every package's .mocharc. Two things that keep test files from
// depending on each other:
//
// 1. Runs test files, and the tests inside each suite, in a random order.
//    The seed is printed first; rerun an order with MOCHA_SEED=<seed>.
// 2. After each test file's top-level suite, puts process.env back as it
//    was and fails that suite if it left fake timers installed, so the
//    next file starts clean and the leak is reported where it happened.
//
// See "Unit tests" in AGENTS.md for the rules this enforces.
const { createRequire } = require('node:module')

// The package's own copy of mocha, which may not be the root's
const Mocha = createRequire(`${process.cwd()}/package.json`)('mocha')

const seed = Number(
  process.env.MOCHA_SEED ?? Math.floor(Math.random() * 2 ** 31),
)
console.error(`Mocha random order: MOCHA_SEED=${seed}`)

// mulberry32: small, seedable, good enough to shuffle
let state = seed >>> 0
function random() {
  state = (state + 0x6d2b79f5) >>> 0
  let t = state
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
}

function shuffleSuite(suite) {
  shuffle(suite.suites)
  shuffle(suite.tests)
  for (const child of suite.suites) shuffleSuite(child)
}

const realTimers = {
  Date: globalThis.Date,
  setTimeout: globalThis.setTimeout,
  setInterval: globalThis.setInterval,
}

function checkFileCleanup(suite, env) {
  suite.afterAll(`${suite.title}: clean up after the file`, () => {
    const changed = new Set(
      [...Object.keys(env), ...Object.keys(process.env)].filter(
        (key) => env[key] !== process.env[key],
      ),
    )
    for (const key of changed) {
      if (env[key] === undefined) Reflect.deleteProperty(process.env, key)
      else process.env[key] = env[key]
    }
    const timers = Object.entries(realTimers)
      .filter(([name, real]) => globalThis[name] !== real)
      .map(([name]) => name)
    const leaks = [
      ...[...changed].map((key) => `process.env.${key}`),
      ...timers.map((name) => `fake ${name} still installed`),
    ]
    for (const name of timers) globalThis[name] = realTimers[name]
    if (leaks.length > 0) {
      throw new Error('Test file left state behind', { cause: { leaks } })
    }
  })
}

const run = Mocha.Runner.prototype.run
Mocha.Runner.prototype.run = function (...args) {
  shuffleSuite(this.suite)
  const env = { ...process.env }
  for (const suite of this.suite.suites) checkFileCleanup(suite, env)
  return run.apply(this, args)
}
