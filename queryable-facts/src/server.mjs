import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { root, runPipeline } from './pipeline.mjs'
import { ask, aiConfig, loadRun } from './ask.mjs'
import { makeBriefing } from './briefing.mjs'

const port = Number(process.env.PORT || 5181)
const examples = [
  { id: '01-direct', title: 'A setter and a reader', description: 'Find the assignment. What can this rule tell us about it?' },
  { id: '02-unreachable', title: 'The same write, after a revert', description: 'The assignment is still in the AST. Does that mean it can happen?' },
  { id: '03-owner', title: 'A write guarded by an owner check', description: 'The rule still finds a potential writer. Read the condition to understand who can use it.' },
  { id: '04-external-gate', title: 'A write delegated to an unknown gate', description: 'The interface is present, but the gate implementation and deployed address are not. What can we conclude?' },
  { id: '05-internal-chain', title: 'An entry point with a guard in a helper', description: 'updateScore calls checkAndSetScore, which calls setScore. Enable lesson 03 to follow the chain and find the intermediate code to read.' },
  { id: '06-known-gate', title: 'An external gate with a discovery snapshot', description: 'First resolve nothing: the gate is a source dependency. Then attach the synthetic snapshot to locate OwnerGate and its owner.' },
]
const assets = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/reader.js': ['reader.js', 'text/javascript'], '/briefing.mjs': ['../src/briefing.mjs', 'text/javascript'], '/id-labels.js': ['id-labels.js', 'text/javascript'], '/ast-tree.js': ['ast-tree.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] }
let busy = false
let setupChecked = false

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' })
  res.end(type === 'application/json' ? JSON.stringify(body) : body)
}

const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, `http://localhost:${port}`).pathname
    if (req.method === 'GET' && assets[path]) {
      const [file, type] = assets[path]
      return send(res, 200, await readFile(join(root, 'web', file), 'utf8'), type)
    }
    if (req.method === 'GET' && path === '/api/examples') {
      const items = await Promise.all(examples.map(async (example) => {
        if (example.id !== '06-known-gate') return { ...example, source: await readFile(join(root, 'examples', `${example.id}.sol`), 'utf8') }
        const project = join(root, 'examples/playground')
        const files = (await readdir(join(project, '.flat'))).filter((f) => f.endsWith('.sol')).sort((a, b) => a === 'Playground.sol' ? -1 : b === 'Playground.sol' ? 1 : a.localeCompare(b))
        return { ...example, snapshot: JSON.parse(await readFile(join(project, 'discovered.json'), 'utf8')),
          sources: Object.fromEntries(await Promise.all(files.map(async (file) => [`.flat/${file}`, await readFile(join(project, '.flat', file), 'utf8')]))),
        }
      }))
      return send(res, 200, items)
    }
    if (req.method === 'GET' && path === '/api/ai-config') return send(res, 200, { ...aiConfig(), setupChecked })
    if (req.method === 'POST' && ['/api/run', '/api/ask'].includes(path)) {
      // This local teaching server accepts same-origin browser requests only.
      if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) {
        return send(res, 403, { error: 'Use the local prototype page to run the pipeline.' })
      }
      if (busy) return send(res, 409, { error: 'An analysis is already in progress. Wait for it to finish.' })
      busy = true
      try {
        const chunks = []
        let size = 0
        for await (const chunk of req) {
          size += chunk.length
          if (size > 100_000) return send(res, 413, { error: 'Keep this lesson below 100 KB of source.' })
          chunks.push(chunk)
        }
        let body
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
        catch { return send(res, 400, { error: 'Expected a JSON request.' }) }
        if (path === '/api/ask') {
          const controller = new AbortController()
          res.once('close', () => { if (!res.writableEnded) controller.abort() })
          const run = await loadRun(body?.runId)
          makeBriefing(run, body.question) // Validate before starting the event stream.
          res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' })
          const emit = (event) => { if (!res.destroyed) res.write(JSON.stringify(event) + '\n') }
          try {
            const record = await ask(run, body.question, { signal: controller.signal, onEvent: emit })
            emit({ type: 'done', record })
          } catch (error) { emit({ type: 'error', message: error.message }) }
          return res.end()
        }
        if (!body?.sources && typeof body?.source !== 'string') return send(res, 400, { error: 'Expected Solidity source.' })
        return send(res, 200, await runPipeline(body.sources ?? body.source, { followCalls: body.followCalls === true, connectContracts: body.connectContracts === true, snapshot: body.snapshot ?? null }))
      } finally { busy = false }
    }
    send(res, 404, { error: 'Not found' })
  } catch (error) {
    send(res, 422, { error: error.message })
  }
})

export function startServer(options = {}) {
  setupChecked = options.setupChecked === true
  server.listen(port, '127.0.0.1', () => console.log(`Queryable facts: http://localhost:${port}`))
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1 })
}
