import type { ConfigReader } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { projectSchema } from './entries'
import { attachMcpRouter } from './mcp'
import { AgentSession } from './session'

const graphContractSchema = z.object({
  address: z.string(),
  name: z.string(),
  hidden: z.boolean(),
  group: z.string().optional(),
  color: z.number(),
})

export const agentContextSchema = z.object({
  project: projectSchema.optional(),
  selected: z.array(z.object({ address: z.string(), name: z.string() })),
  panels: z.array(z.string()),
  code: z.object({ address: z.string(), text: z.string() }).optional(),
  agent: z
    .object({ step: z.number(), steps: z.number(), view: z.string() })
    .optional(),
  graph: z
    .object({
      contracts: z.array(graphContractSchema),
      pendingView: z
        .object({ title: z.string(), changes: z.number() })
        .optional(),
    })
    .optional(),
})
export type AgentContext = z.infer<typeof agentContextSchema>

export const agentReceiptSchema = z.object({
  id: z.string(),
  missing: z.array(z.string()),
  notHideable: z.array(z.string()),
  cascaded: z.array(z.string()),
  connectors: z.array(z.string()),
  visible: z.number(),
  total: z.number(),
  // Set when discarding: how many views were put back.
  undone: z.number().optional(),
  // Set by a dry run in a tab that does not show the project's graph.
  unavailable: z.boolean().optional(),
})
export type AgentReceipt = z.infer<typeof agentReceiptSchema>

export function attachAgentRouter(app: Express, configReader: ConfigReader) {
  const session = new AgentSession<AgentContext, AgentReceipt>()
  attachMcpRouter(app, { configReader, session })

  app.get('/api/agent/events', (req, res) => session.connect(req, res))

  app.post('/api/agent/clear', (_req, res) => {
    res.json({ tabs: session.clear() })
  })

  app.post('/api/agent/receipt', (req, res) => {
    const body = agentReceiptSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    session.receive(body.data.id, body.data)
    res.json({ ok: true })
  })

  app.put('/api/agent/context', (req, res) => {
    const body = agentContextSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ error: body.message })
      return
    }
    session.context = body.data
    res.json({ ok: true })
  })
}
