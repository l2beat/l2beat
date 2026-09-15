// The API, mounted into Vite's dev server (web/vite.config.ts). One process: `pnpm dev`.
//
//   GET  /api/state                          levels and examples
//   POST /api/run {example, level}           run (fast: compile is cached, Soufflé takes ~100 ms)
//   GET  /api/rows?example&level&relation    the rows of one relation of that run
//   GET  /api/source?example                 the example's Solidity source
//   POST /api/explain {example, level, atom} Soufflé's proof of one tuple

import type { IncomingMessage, ServerResponse } from 'http'
import { join } from 'path'
import { exampleSource, listExamples } from '../../src/examples'
import { listLevels, programFor, strengthOf } from '../../src/levels'
import { levelDir, rowsOf, runExample } from '../../src/run'
import { explainAtom } from '../../src/souffle'
import type {
  ExplainResult,
  RelationView,
  RowsResult,
  RunView,
  State,
} from '../shared/types'

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

function state(): State {
  return {
    levels: listLevels().map(({ text: _text, ...rest }) => rest),
    examples: listExamples(),
  }
}

async function run(example: string, level: number): Promise<RunView> {
  const result = await runExample(example, level)
  const levels = listLevels().filter((l) => l.n <= level)
  const levelOfFile = new Map(levels.map((l) => [l.file, l.n]))
  const relations: RelationView[] = result.program.relations.map((r) => ({
    ...r,
    strength: strengthOf(r.comment),
    level: levelOfFile.get(r.file) ?? 0,
    rows: r.isInput
      ? (result.meta.factCounts[r.name] ?? 0)
      : (result.meta.counts[r.name] ?? -1),
  }))
  return {
    meta: result.meta,
    relations,
    files: levels.map((l) => ({ name: l.file, level: l.n, text: l.text })),
  }
}

export async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const p = url.pathname
  const q = (name: string) => url.searchParams.get(name) ?? ''
  try {
    if (req.method === 'GET' && p === '/api/state')
      return send(res, 200, state())
    if (req.method === 'POST' && p === '/api/run') {
      const body = JSON.parse(await readBody(req)) as {
        example: string
        level: number
      }
      return send(res, 200, await run(body.example, Number(body.level)))
    }
    if (req.method === 'GET' && p === '/api/rows') {
      const level = Number(q('level'))
      const rows = rowsOf(q('example'), level, q('relation'))
      const program = programFor(level)
      const info = program.relations.find((r) => r.name === q('relation'))
      const result: RowsResult = {
        relation: q('relation'),
        columns: info?.columns ?? [],
        total: rows.length,
        rows: rows.slice(0, 5000),
      }
      return send(res, 200, result)
    }
    if (req.method === 'GET' && p === '/api/source') {
      res.statusCode = 200
      res.setHeader('content-type', 'text/plain; charset=utf-8')
      res.end(exampleSource(q('example')))
      return
    }
    if (req.method === 'POST' && p === '/api/explain') {
      const body = JSON.parse(await readBody(req)) as {
        example: string
        level: number
        atom: string
      }
      const dir = levelDir(body.example, Number(body.level))
      const { proof, ms } = explainAtom({
        programPath: join(dir, 'program.dl'),
        factsDir: join(dir, '..', 'facts'),
        atom: body.atom,
      })
      const result: ExplainResult = { atom: body.atom, proof, ms }
      return send(res, 200, result)
    }
    if (p.startsWith('/api/'))
      return send(res, 404, { error: `no route ${req.method} ${p}` })
    next()
  } catch (error) {
    if (res.headersSent) {
      res.end()
      return
    }
    send(res, 500, {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
