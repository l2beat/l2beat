import type { ConfigReader } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import { randomUUID } from 'crypto'
import express, { type Router } from 'express'
import { safeStringSchema } from '../safeStringSchema'
import type { ApiAgentEvent } from '../types'
import { type ChatOptions, ChatSession } from './chat/ChatSession'
import { attachChatRoutes } from './chat/router'
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
        sourceHash: shortString,
        from: countSchema,
        to: countSchema,
      })
      .check((v) => v.from <= v.to, 'Selection ends before it starts')
      .optional(),
    note: z.object({ index: countSchema, stepCount: countSchema }).optional(),
  }),
})

// A large project draws a few thousand contracts with a few links each, and
// the 2mb body these routes take holds far less than these.
const ITEMS_MAX = 10_000
const LINKS_MAX = 100_000
const MEMBERS_MAX = 10_000
const coordinateSchema = z
  .number()
  .check((v) => Number.isFinite(v), 'Bad coordinate')
const sizeSchema = z
  .number()
  .check((v) => Number.isFinite(v) && v >= 0, 'Bad size')
const namedSchema = z.object({ id: shortString, name: shortString })
const notLoadedSchema = z.object({
  status: z.literal('not-loaded'),
  project: safeStringSchema.optional(),
})
const graphItemSchema = z.object({
  id: shortString,
  name: shortString,
  x: coordinateSchema,
  y: coordinateSchema,
  width: sizeSchema,
  height: sizeSchema,
  members: z
    .array(shortString)
    .check((v) => v.length <= MEMBERS_MAX, 'Too many members')
    .optional(),
})
const loadedGraphSchema = z
  .object({
    status: z.literal('loaded'),
    items: z
      .array(graphItemSchema)
      .check((v) => v.length <= ITEMS_MAX, 'Too many items'),
    links: z
      .array(z.tuple([countSchema, countSchema, shortString]))
      .check((v) => v.length <= LINKS_MAX, 'Too many links'),
    hidden: z
      .array(namedSchema)
      .check((v) => v.length <= ITEMS_MAX, 'Too many hidden'),
  })
  .check(
    (graph) =>
      graph.links.every(
        ([source, target]) =>
          source < graph.items.length && target < graph.items.length,
      ),
    'Link to an item that is not there',
  )
const graphSchema = z.object({
  tab: tabSchema,
  request: tabSchema,
  graph: z.union([notLoadedSchema, loadedGraphSchema]),
})

// Never more than the agent named, which its own schema bounds lower.
const NAMED_MAX = 1_000
const layoutSchema = z.object({
  tab: tabSchema,
  request: tabSchema,
  layout: z.union([
    notLoadedSchema,
    z.object({
      status: z.literal('arranged'),
      placed: z
        .array(shortString)
        .check((v) => v.length <= NAMED_MAX, 'Too many placed'),
      below: z
        .array(namedSchema)
        .check((v) => v.length <= ITEMS_MAX, 'Too many below'),
      notDrawn: z
        .array(shortString)
        .check((v) => v.length <= NAMED_MAX, 'Too many not drawn'),
    }),
  ]),
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
  chatOptions: ChatOptions,
  tabs = new AgentTabs(),
): Router {
  // A tab whose stream reconnects to a new server drops its note, which
  // that server cannot clear.
  const serverId = randomUUID()
  const router = express.Router()
  router.use(localOnly('DiscoUI agent routes answer only locally'))
  // A large project's node view, read back by the tab, outgrows the limit
  // the other routes keep. The parser after this one skips a parsed body.
  router.use(['/graph', '/layout'], express.json({ limit: '2mb' }))
  router.use(express.json({ limit: '100kb' }))
  attachMcpRoutes(router, { configReader, tabs })
  const chat = new ChatSession(tabs, chatOptions)
  // The adapter would outlive the server otherwise.
  process.once('exit', () => chat.close())
  attachChatRoutes(router, chat)

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

  router.post('/graph', (req, res) => {
    const body = graphSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    const { tab, request, graph } = body.data
    const isPending = tabs.answerGraph(tab, request, graph)
    res.status(isPending ? 200 : 404).json({ answered: isPending })
  })

  router.post('/layout', (req, res) => {
    const body = layoutSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    const { tab, request, layout } = body.data
    const isPending = tabs.answerLayout(tab, request, layout)
    res.status(isPending ? 200 : 404).json({ answered: isPending })
  })

  return router
}
