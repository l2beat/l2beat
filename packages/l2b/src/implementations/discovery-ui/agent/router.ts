import type { ConfigReader } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { isMadeOf } from './characters'
import { attachMcpRouter } from './mcp'
import type { AgentTabs } from './tabs'

// Proxies and the browser drop a stream that stays silent for long.
const KEEPALIVE_INTERVAL_MS = 25_000

const TAB_ID_LENGTH_MAX = 64
const tabSchema = z
  .string()
  .check((v) => v.length <= TAB_ID_LENGTH_MAX && isMadeOf(v, '-'), 'Bad tab id')
const focusSchema = z.object({
  tab: tabSchema,
  project: z.string().optional(),
})

export function attachAgentRouter(
  app: Express,
  configReader: ConfigReader,
  tabs: AgentTabs,
) {
  attachMcpRouter(app, { configReader, tabs })

  app.get('/api/agent/events', (req, res) => {
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
    res.write(': connected\n\n')
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

  app.post('/api/agent/focus', (req, res) => {
    const body = focusSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    const isConnected = tabs.focus(body.data.tab, body.data.project)
    res.status(isConnected ? 200 : 404).json({ connected: isConnected })
  })
}
