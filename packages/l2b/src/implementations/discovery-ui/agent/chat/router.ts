import { type Validator, v as z } from '@l2beat/validate'
import type { Response, Router } from 'express'
import { safeStringSchema } from '../../safeStringSchema'
import { AcpError } from './acp'
import { ChatError, type ChatSession } from './ChatSession'
import { CHAT_PROVIDERS } from './providers'

const PROMPT_CHARACTERS_MAX = 20_000
const tabSchema = safeStringSchema
const startSchema = z.object({
  tab: tabSchema,
  provider: z.enum(CHAT_PROVIDERS),
})
const promptSchema = z.object({
  tab: tabSchema,
  text: z
    .string()
    .check(
      (t) => t.trim().length > 0 && t.length <= PROMPT_CHARACTERS_MAX,
      `Message must be 1 to ${PROMPT_CHARACTERS_MAX} characters`,
    ),
})
const tabOnlySchema = z.object({ tab: tabSchema })
const configSchema = z.object({
  tab: tabSchema,
  configId: z.string(),
  value: z.string(),
})
const permissionSchema = z.object({
  tab: tabSchema,
  id: safeStringSchema,
  optionId: z.string(),
})

// Mounted under /api/agent, after its local-only guard: the agent runs shell
// commands. The tab follows the conversation over its event stream, so a
// request answers only whether the chat took it.
export function attachChatRoutes(router: Router, chat: ChatSession) {
  router.post('/chat/start', async (req, res) => {
    await handle(res, startSchema, req.body, (body) =>
      chat.start(body.tab, body.provider),
    )
  })
  router.post('/chat/prompt', async (req, res) => {
    await handle(res, promptSchema, req.body, (body) =>
      chat.prompt(body.tab, body.text),
    )
  })
  router.post('/chat/cancel', async (req, res) => {
    await handle(res, tabOnlySchema, req.body, (body) => chat.cancel(body.tab))
  })
  router.post('/chat/permission', async (req, res) => {
    await handle(res, permissionSchema, req.body, (body) =>
      chat.answerPermission(body.tab, body.id, body.optionId),
    )
  })
  router.post('/chat/config', async (req, res) => {
    await handle(res, configSchema, req.body, (body) =>
      chat.setConfig(body.tab, body.configId, body.value),
    )
  })
  router.post('/chat/close', async (req, res) => {
    await handle(res, tabOnlySchema, req.body, (body) =>
      chat.closeFor(body.tab),
    )
  })
}

async function handle<T>(
  res: Response,
  schema: Validator<T>,
  body: unknown,
  run: (body: T) => void | Promise<void>,
) {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.message })
    return
  }
  try {
    await run(parsed.data)
    res.json({ ok: true })
  } catch (error) {
    if (error instanceof ChatError) {
      res.status(409).json({ error: error.message })
      return
    }
    if (error instanceof AcpError) {
      res.status(409).json({ error: error.detail })
      return
    }
    throw error
  }
}
