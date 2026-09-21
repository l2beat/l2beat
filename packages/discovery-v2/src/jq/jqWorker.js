/**
 * Worker-side half of the jq runner.
 *
 * jq-wasm executes a filter synchronously and cannot be interrupted from
 * inside its own thread, so it lives here, in a worker the main thread can
 * `terminate()` when a filter runs past its deadline.
 *
 * Plain CommonJS on purpose: tsx transforms TypeScript only on the main
 * thread, so a `.ts` worker would load solely through Node's native type
 * stripping, which the repo's minimum Node version does not enable. A `.js`
 * file loads identically under tsx, mocha and the `tsc` build.
 */
const { parentPort } = require('worker_threads')
const { loadJq } = require('jq-wasm')

if (!parentPort) {
  throw new Error('jqWorker must be started as a worker thread')
}
const port = parentPort

// One wasm instance per worker: compiling it is the expensive part, running a
// filter is cheap, and a fresh instance would make each call pay the compile.
const jq = loadJq()

port.on('message', (/** @type {import('./protocol').JqRequest} */ request) => {
  jq.then(
    (instance) => {
      const result = instance.raw(request.inputJson, request.filter, ['-c'])
      /** @type {import('./protocol').JqResponse} */
      const response = { id: request.id, ok: true, ...result }
      port.postMessage(response)
    },
    (/** @type {unknown} */ error) => {
      /** @type {import('./protocol').JqResponse} */
      const response = {
        id: request.id,
        ok: false,
        message: `jq-wasm failed to load: ${describe(error)}`,
      }
      port.postMessage(response)
    },
  )
})

/** @param {unknown} error */
function describe(error) {
  return error instanceof Error ? error.message : String(error)
}
