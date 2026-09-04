// The explorer's tiny API, mounted into Vite's dev server (see web/vite.config.ts).
// The server has the CLI at hand: it compiles, extracts, runs Soufflé and answers `explain` queries.

import { existsSync, readFileSync } from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import { join } from 'path'
import type { ExplainRequest } from '../shared/types'
import { explainTuple, formatAtom } from './explain'
import { parseProgram } from './program'
import { listContracts, RUNS_DIR, readContract, runForExplorer } from './run'

const SOUFFLE = process.env.SOUFFLE ?? 'souffle'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(body))
}

export async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  try {
    if (req.method === 'GET' && url.pathname === '/api/contracts') {
      send(res, 200, listContracts())
      return
    }
    if (req.method === 'GET' && url.pathname === '/api/contract') {
      send(res, 200, readContract(url.searchParams.get('id') ?? ''))
      return
    }
    if (req.method === 'POST' && url.pathname === '/api/run') {
      const { name, source } = JSON.parse(await readBody(req)) as {
        name: string
        source: string
      }
      if (typeof source !== 'string' || source.trim() === '')
        throw new Error('empty source')
      send(res, 200, await runForExplorer(name || 'Pasted.sol', source))
      return
    }
    if (req.method === 'POST' && url.pathname === '/api/explain') {
      const body = JSON.parse(await readBody(req)) as ExplainRequest
      if (!/^[\w.-]+$/.test(body.runId)) throw new Error('bad runId')
      const runDir = join(RUNS_DIR, body.runId)
      if (!existsSync(runDir)) throw new Error(`unknown run ${body.runId}`)
      const program = parseProgram(
        readFileSync(join(runDir, 'program.dl'), 'utf8'),
      )
      const info = program.relations.find((r) => r.name === body.relation)
      if (!info) throw new Error(`unknown relation ${body.relation}`)
      const atom = formatAtom(body.relation, body.cols, info.columns)
      send(res, 200, explainTuple(SOUFFLE, runDir, atom))
      return
    }
    if (url.pathname.startsWith('/api/')) {
      send(res, 404, { error: `no route ${req.method} ${url.pathname}` })
      return
    }
    next()
  } catch (error) {
    send(res, 500, {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
