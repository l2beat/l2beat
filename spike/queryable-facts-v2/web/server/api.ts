// The API, mounted into Vite's dev server (web/vite.config.ts). One process: `pnpm dev`.

import { existsSync, readFileSync } from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'
import { join } from 'path'
import { ask, askConfig, listAsks } from '../../src/agent'
import { runDirOf } from '../../src/paths'
import { promote } from '../../src/promote'
import { allQueryDirs, explainAnywhere } from '../../src/proof'
import type {
  ExplainRequest,
  ExplainResult,
  PromoteRequest,
  RunEvent,
  RunRequest,
} from '../shared/types'
import {
  askDetail,
  listInputs,
  listRunItems,
  rowsPage,
  runInfo,
  startRun,
  unitInfo,
  unitSolcOutput,
} from './runs'

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

function ndjson(res: ServerResponse): (event: unknown) => void {
  res.writeHead(200, {
    'content-type': 'application/x-ndjson; charset=utf-8',
    'cache-control': 'no-cache',
    'x-accel-buffering': 'no',
  })
  return (event) => {
    if (!res.writableEnded) res.write(`${JSON.stringify(event)}\n`)
  }
}

export async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const p = url.pathname
  const q = (name: string) => url.searchParams.get(name) ?? undefined
  try {
    if (req.method === 'GET' && p === '/api/inputs')
      return send(res, 200, listInputs())
    if (req.method === 'GET' && p === '/api/runs')
      return send(res, 200, listRunItems())
    if (req.method === 'GET' && p === '/api/run')
      return send(res, 200, runInfo(q('id') ?? ''))
    if (req.method === 'GET' && p === '/api/run/unit')
      return send(res, 200, unitInfo(q('id') ?? '', q('unit') ?? ''))
    if (req.method === 'GET' && p === '/api/run/solc') {
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(unitSolcOutput(q('id') ?? '', q('unit') ?? ''))
      return
    }
    if (req.method === 'GET' && p === '/api/run/rows')
      return send(
        res,
        200,
        rowsPage(q('id') ?? '', q('relation') ?? '', {
          unit: q('unit'),
          offset: q('offset') ? Number(q('offset')) : undefined,
          limit: q('limit') ? Number(q('limit')) : undefined,
          filter: q('filter'),
          ask: q('ask'),
          query: q('query'),
        }),
      )
    if (req.method === 'GET' && p === '/api/run/source') {
      const runDir = runDirOf(q('id') ?? '')
      const slug = q('unit') ?? ''
      if (!/^[\w.-]+$/.test(slug)) throw new Error('bad unit')
      const path = join(runDir, 'units', slug, 'source.sol')
      if (!existsSync(path)) throw new Error('no source')
      res.statusCode = 200
      res.setHeader('content-type', 'text/plain; charset=utf-8')
      res.end(readFileSync(path, 'utf8'))
      return
    }
    if (req.method === 'GET' && p === '/api/run/discovered') {
      const path = join(runDirOf(q('id') ?? ''), 'discovered.json')
      if (!existsSync(path)) throw new Error('no discovered.json in this run')
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(readFileSync(path, 'utf8'))
      return
    }
    if (req.method === 'POST' && p === '/api/run') {
      const body = JSON.parse(await readBody(req)) as RunRequest
      const emit = ndjson(res)
      try {
        const run = await startRun(body, (e) => emit(e satisfies RunEvent))
        emit({ type: 'done', run } satisfies RunEvent)
      } catch (error) {
        emit({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        } satisfies RunEvent)
      }
      res.end()
      return
    }
    if (req.method === 'POST' && p === '/api/explain') {
      const body = JSON.parse(await readBody(req)) as ExplainRequest
      const runDir = runDirOf(body.id)
      const queryDirs = allQueryDirs(runDir)
      if (body.ask && /^\d+$/.test(body.ask)) {
        // the ask's own queries first, so its relations win over same-named ones elsewhere
        const own = queryDirs.filter((d) => d.includes(`/asks/${body.ask}/`))
        queryDirs.splice(
          0,
          queryDirs.length,
          ...own,
          ...queryDirs.filter((d) => !own.includes(d)),
        )
      }
      const explained = explainAnywhere(runDir, body.atom, {
        queryDirs,
        depth: body.depth,
      })
      const result: ExplainResult = {
        atom: explained.located.atom,
        home: explained.located.home,
        proof: explained.proof,
        ms: explained.ms,
      }
      return send(res, 200, result)
    }
    if (req.method === 'GET' && p === '/api/ask/config')
      return send(res, 200, askConfig())
    if (req.method === 'GET' && p === '/api/asks')
      return send(res, 200, listAsks(runDirOf(q('id') ?? '')))
    if (req.method === 'GET' && p === '/api/ask')
      return send(res, 200, askDetail(q('id') ?? '', q('ask') ?? ''))
    if (req.method === 'POST' && p === '/api/ask') {
      const body = JSON.parse(await readBody(req)) as {
        id: string
        question: string
        model: string
        effort: string
        threadId?: string
      }
      const runDir = runDirOf(body.id)
      const emit = ndjson(res)
      const aborted = { aborted: false, handlers: [] as Array<() => void> }
      res.on('close', () => {
        aborted.aborted = true
        for (const h of aborted.handlers) h()
      })
      try {
        await ask(
          runDir,
          {
            question: body.question,
            model: body.model,
            effort: body.effort,
            threadId: body.threadId,
          },
          (e) => emit(e),
          { aborted: false, onAbort: (fn) => aborted.handlers.push(fn) },
        )
      } catch (error) {
        emit({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        })
      }
      res.end()
      return
    }
    if (req.method === 'POST' && p === '/api/promote') {
      const body = JSON.parse(await readBody(req)) as PromoteRequest
      return send(res, 200, promote(body))
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
