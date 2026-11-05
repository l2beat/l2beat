import type { ConfigReader } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import { randomUUID } from 'crypto'
import express, { type Router } from 'express'
import { safeStringSchema } from '../safeStringSchema'
import type { ApiAgentEvent } from '../types'
import { localOnly } from './localOnly'
import { attachMcpRoutes } from './mcp'
import { AgentTabs } from './tabs'

// Proxies and the browser drop a stream that stays silent for long.
const KEEPALIVE_INTERVAL_MS = 25_000

const TAB_ID_LENGTH_MAX = 64
const tabSchema = safeStringSchema.check(
  (v) => v.length <= TAB_ID_LENGTH_MAX,
  'Tab id too long',
)
const countSchema = z
  .number()
  .check((v) => Number.isSafeInteger(v) && v >= 0, 'Bad count')
// Far above a selection anyone makes; the server ignores what it cannot find.
const SELECTED_MAX = 200
const ADDRESS_LENGTH_MAX = 200
const shortString = z
  .string()
  .check((v) => v.length <= ADDRESS_LENGTH_MAX, 'Too long')
const contextSchema = z.object({
  tab: tabSchema,
  request: tabSchema,
  context: z.object({
    project: safeStringSchema.optional(),
    selected: z
      .array(shortString)
      .check((v) => v.length <= SELECTED_MAX, 'Too many selected'),
    code: z
      .object({
        address: shortString,
        sourceName: shortString,
        from: countSchema,
        to: countSchema,
      })
      .check((v) => v.from <= v.to, 'Selection ends before it starts')
      .optional(),
    note: z.object({ index: countSchema, stepCount: countSchema }).optional(),
  }),
})

const reportSchema = z.object({
  tab: tabSchema,
  project: safeStringSchema.optional(),
  focusedAt: z
    .number()
    .check((v) => Number.isSafeInteger(v) && v >= 0, 'Bad focus time'),
  sequence: z
    .number()
    .check((v) => Number.isSafeInteger(v) && v > 0, 'Bad sequence'),
})

// The agent routes change what the researcher sees, so they refuse other
// machines and other sites' pages before reading any body.
export function createAgentRouter(
  configReader: ConfigReader,
  tabs = new AgentTabs(),
): Router {
  // A tab whose stream reconnects to a new server drops its note, which
  // that server cannot clear.
  const serverId = randomUUID()
  const router = express.Router()
  router.use(localOnly('DiscoUI agent routes answer only locally'))
  router.use(express.json({ limit: '100kb' }))
  attachMcpRoutes(router, { configReader, tabs })

  router.get('/events', (req, res) => {
    const tab = tabSchema.safeParse(req.query.tab)
    if (!tab.success) {
      res.status(400).json({ error: tab.message })
      return
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    const connected: ApiAgentEvent = { type: 'connected', serverId }
    res.write(`data: ${JSON.stringify(connected)}\n\n`)
    tabs.connect(tab.data, res)
    const keepalive = setInterval(
      () => res.write(': keepalive\n\n'),
      KEEPALIVE_INTERVAL_MS,
    )
    req.on('close', () => {
      clearInterval(keepalive)
      tabs.disconnect(tab.data, res)
    })
  })

  router.post('/tab', (req, res) => {
    const body = reportSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    const { tab, project, focusedAt, sequence } = body.data
    const isConnected = tabs.report(tab, { project, focusedAt, sequence })
    res.status(isConnected ? 200 : 404).json({ connected: isConnected })
  })

  router.post('/context', (req, res) => {
    const body = contextSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    const { tab, request, context } = body.data
    const isPending = tabs.answerContext(tab, request, {
      project: context.project,
      selected: context.selected,
      code: context.code,
      note: context.note,
    })
    res.status(isPending ? 200 : 404).json({ answered: isPending })
  })

  return router
}
