import { v as z } from '@l2beat/validate'

export type ChatStatus = 'idle' | 'starting' | 'ready' | 'working' | 'failed'
export type ToolStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

export interface ConfigOption {
  id: string
  name: string
  category: string | undefined
  value: string
  choices: { value: string; name: string; description: string | undefined }[]
}

export interface PermissionChoice {
  id: string
  name: string
  kind: string
}

// What DiscoUI's AI panel draws, built from the agent's raw updates on the
// server, so the panel never parses protocol messages itself.
export type ChatEvent =
  | { type: 'status'; status: ChatStatus; provider?: string; error?: string }
  | { type: 'user'; text: string }
  | { type: 'text'; role: 'agent' | 'thought'; text: string }
  | {
      type: 'tool'
      id: string
      title?: string
      kind?: string
      status?: ToolStatus
      output?: string
      outputAppend?: string
      dryRun?: boolean
    }
  | { type: 'plan'; entries: { content: string; status: string }[] }
  | {
      type: 'permission'
      id: string
      title: string
      choices: PermissionChoice[]
    }
  | { type: 'permission-done'; id: string; choice: string | undefined }
  | { type: 'turn-end'; stopReason: string }
  | { type: 'error'; message: string }
  | { type: 'config'; options: ConfigOption[] }
  | { type: 'title'; title: string }
  | { type: 'usage'; used: number; size: number }

export const TOOL_OUTPUT_LENGTH_MAX = 4_000

const chunkSchema = z.object({
  sessionUpdate: z.enum(['agent_message_chunk', 'agent_thought_chunk']),
  content: z.object({ type: z.string(), text: z.string().optional() }),
})

const toolContentSchema = z.object({
  type: z.string(),
  content: z
    .object({ type: z.string(), text: z.string().optional() })
    .optional(),
  path: z.string().optional(),
})

const toolSchema = z.object({
  sessionUpdate: z.enum(['tool_call', 'tool_call_update']),
  toolCallId: z.string(),
  title: z.union([z.string(), z.null()]).optional(),
  kind: z.union([z.string(), z.null()]).optional(),
  status: z
    .union([
      z.enum(['pending', 'in_progress', 'completed', 'failed']),
      z.null(),
    ])
    .optional(),
  content: z.union([z.array(toolContentSchema), z.null()]).optional(),
  rawInput: z.unknown().optional(),
  rawOutput: z.unknown().optional(),
  _meta: z
    .object({
      terminal_output_delta: z.object({ data: z.string() }).optional(),
    })
    .optional(),
})

const planSchema = z.object({
  sessionUpdate: z.literal('plan'),
  entries: z.array(z.object({ content: z.string(), status: z.string() })),
})

const selectOptionSchema = z.object({
  value: z.string(),
  name: z.string(),
  description: z.union([z.string(), z.null()]).optional(),
})

const configOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  category: z.union([z.string(), z.null()]).optional(),
  currentValue: z.unknown().optional(),
  options: z.array(z.unknown()).optional(),
})

export const configOptionsSchema = z.array(configOptionSchema)

const configUpdateSchema = z.object({
  sessionUpdate: z.literal('config_option_update'),
  configOptions: configOptionsSchema,
})

const titleSchema = z.object({
  sessionUpdate: z.literal('session_info_update'),
  title: z.union([z.string(), z.null()]).optional(),
})

const usageSchema = z.object({
  sessionUpdate: z.literal('usage_update'),
  used: z.number(),
  size: z.number(),
})

// Updates the panel does not draw, or that do not parse, come back as
// nothing: an agent may send more than this client knows.
export function toChatEvents(update: unknown): ChatEvent[] {
  const chunk = chunkSchema.safeParse(update)
  if (chunk.success) {
    const { text } = chunk.data.content
    if (text === undefined || text.length === 0) {
      return []
    }
    const role =
      chunk.data.sessionUpdate === 'agent_message_chunk' ? 'agent' : 'thought'
    return [{ type: 'text', role, text }]
  }
  const tool = toolSchema.safeParse(update)
  if (tool.success) {
    return [toToolEvent(tool.data)]
  }
  const plan = planSchema.safeParse(update)
  if (plan.success) {
    return [{ type: 'plan', entries: plan.data.entries }]
  }
  const config = configUpdateSchema.safeParse(update)
  if (config.success) {
    return [
      { type: 'config', options: toConfigOptions(config.data.configOptions) },
    ]
  }
  const title = titleSchema.safeParse(update)
  if (title.success && typeof title.data.title === 'string') {
    return [{ type: 'title', title: title.data.title }]
  }
  const usage = usageSchema.safeParse(update)
  if (usage.success) {
    return [{ type: 'usage', used: usage.data.used, size: usage.data.size }]
  }
  return []
}

function toToolEvent(tool: z.infer<typeof toolSchema>): ChatEvent {
  const event: ChatEvent = { type: 'tool', id: tool.toolCallId }
  if (typeof tool.title === 'string' && tool.title.length > 0) {
    event.title = tool.title
  }
  if (typeof tool.kind === 'string') {
    event.kind = tool.kind
  }
  if (typeof tool.status === 'string') {
    event.status = tool.status
  }
  if (Array.isArray(tool.content) && tool.content.length > 0) {
    event.output = clip(tool.content.map(describeContent).join('\n'))
  } else {
    const output = mcpOutput(tool.rawOutput)
    if (output !== undefined) {
      event.output = clip(output)
    }
  }
  if (isDryRun(tool.rawInput)) {
    event.dryRun = true
  }
  const delta = tool._meta?.terminal_output_delta?.data
  if (delta !== undefined && delta.length > 0) {
    event.outputAppend = delta
  }
  return event
}

const mcpOutputSchema = z.object({
  result: z.object({
    content: z.array(
      z.object({ type: z.string(), text: z.string().optional() }),
    ),
  }),
})

// Codex sends an MCP tool's answer only as its raw result.
function mcpOutput(rawOutput: unknown): string | undefined {
  const output = mcpOutputSchema.safeParse(rawOutput)
  if (!output.success) {
    return undefined
  }
  const texts = output.data.result.content.flatMap((c) => c.text ?? [])
  return texts.length > 0 ? texts.join('\n') : undefined
}

const toolInputSchema = z.object({
  dryRun: z.boolean().optional(),
  // Codex wraps an MCP call's arguments with its server and tool.
  arguments: z.object({ dryRun: z.boolean().optional() }).optional(),
})

// A dry run changes nothing on screen, which the panel says.
function isDryRun(rawInput: unknown): boolean {
  const input = toolInputSchema.safeParse(rawInput)
  if (!input.success) {
    return false
  }
  return input.data.dryRun === true || input.data.arguments?.dryRun === true
}

function describeContent(content: z.infer<typeof toolContentSchema>): string {
  if (content.type === 'diff' && content.path !== undefined) {
    return `Edited \`${content.path}\``
  }
  const text = content.content?.text
  return text ?? ''
}

export function toConfigOptions(
  options: z.infer<typeof configOptionsSchema>,
): ConfigOption[] {
  const result: ConfigOption[] = []
  for (const option of options) {
    if (option.type !== 'select' || typeof option.currentValue !== 'string') {
      continue
    }
    const choices = (option.options ?? []).flatMap((choice) => {
      const parsed = selectOptionSchema.safeParse(choice)
      if (!parsed.success) {
        return []
      }
      const { value, name, description } = parsed.data
      return [{ value, name, description: description ?? undefined }]
    })
    result.push({
      id: option.id,
      name: option.name,
      category: option.category ?? undefined,
      value: option.currentValue,
      choices,
    })
  }
  return result
}

function clip(text: string): string {
  if (text.length <= TOOL_OUTPUT_LENGTH_MAX) {
    return text
  }
  return `${text.slice(0, TOOL_OUTPUT_LENGTH_MAX)}\n…`
}

// Chunks of one message arrive a few words at a time. Merged in the log,
// a reloaded tab replays a message as one event, not hundreds.
export function appendToLog(log: ChatEvent[], event: ChatEvent) {
  const last = log[log.length - 1]
  if (
    event.type === 'text' &&
    last?.type === 'text' &&
    last.role === event.role
  ) {
    log[log.length - 1] = { ...last, text: last.text + event.text }
    return
  }
  const lastDelta = outputDeltaOf(last)
  const delta = outputDeltaOf(event)
  if (lastDelta !== undefined && delta !== undefined) {
    if (lastDelta.id === delta.id) {
      const output = (lastDelta.outputAppend + delta.outputAppend).slice(
        -TERMINAL_OUTPUT_LENGTH_MAX,
      )
      log[log.length - 1] = { type: 'tool', id: delta.id, outputAppend: output }
      return
    }
  }
  log.push(event)
}

// The panel shows only this much of a command's tail, so the log keeps no more.
const TERMINAL_OUTPUT_LENGTH_MAX = 8_000

function outputDeltaOf(
  event: ChatEvent | undefined,
): { id: string; outputAppend: string } | undefined {
  if (event?.type !== 'tool' || event.outputAppend === undefined) {
    return undefined
  }
  if (Object.keys(event).length !== 3) {
    return undefined
  }
  return { id: event.id, outputAppend: event.outputAppend }
}
