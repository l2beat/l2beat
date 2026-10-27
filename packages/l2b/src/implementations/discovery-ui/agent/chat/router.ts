import { type Validator, v as z } from '@l2beat/validate'
import type { Express, Response } from 'express'
import { localOnly } from '../localOnly'
import type { AgentContext } from '../router'
import { AcpError } from './acp'
import { ChatError, ChatSession } from './ChatSession'
import { PROVIDER_IDS } from './providers'

const startSchema = z.object({ provider: z.enum(PROVIDER_IDS) })
const promptSchema = z.object({
  text: z.string().check((t) => t.trim().length > 0, 'Empty message'),
})
const permissionSchema = z.object({ id: z.string(), choice: z.string() })
const configSchema = z.object({ configId: z.string(), value: z.string() })

export function attachChatRouter(
  app: Express,
  cwd: string,
  readContext: () => AgentContext | undefined,
) {
  const url = `http://localhost:${process.env.PORT ?? 2021}`
  const chat = new ChatSession(cwd, url, readContext)
  process.once('exit', () => chat.close())

  // The agent runs shell commands.
  app.use('/api/agent/chat', localOnly('The AI chat answers only on localhost'))

  app.get('/api/agent/chat/events', (req, res) => chat.connect(req, res))

  app.post('/api/agent/chat/start', (req, res) => {
    const body = parse(startSchema, req.body, res)
    if (body !== undefined) {
      chat.start(body.provider)
      res.json({ ok: true })
    }
  })

  app.post('/api/agent/chat/prompt', async (req, res) => {
    const body = parse(promptSchema, req.body, res)
    if (body !== undefined) {
      await answer(res, async () => chat.prompt(body.text))
    }
  })

  app.post('/api/agent/chat/cancel', (_req, res) => {
    chat.cancel()
    res.json({ ok: true })
  })

  app.post('/api/agent/chat/permission', (req, res) => {
    const body = parse(permissionSchema, req.body, res)
    if (body !== undefined) {
      res.json({ ok: chat.answer(body.id, body.choice) })
    }
  })

  app.post('/api/agent/chat/config', async (req, res) => {
    const body = parse(configSchema, req.body, res)
    if (body !== undefined) {
      await answer(res, () => chat.configure(body.configId, body.value))
    }
  })

  app.post('/api/agent/chat/reset', (_req, res) => {
    chat.reset()
    res.json({ ok: true })
  })
}

function parse<T>(
  schema: Validator<T>,
  body: unknown,
  res: Response,
): T | undefined {
  const result = schema.safeParse(body)
  if (!result.success) {
    res.status(400).json({ error: result.message })
    return undefined
  }
  return result.data
}

// The panel follows the conversation over the event stream, so a request
// answers only whether the chat took it.
async function answer(res: Response, run: () => Promise<void>) {
  try {
    await run()
    res.json({ ok: true })
  } catch (error) {
    if (error instanceof ChatError || error instanceof AcpError) {
      res.status(409).json({ error: error.message })
      return
    }
    throw error
  }
}
