/**
 * Reads the `opencode run --format json` event stream.
 *
 * opencode reports a turn as JSONL of parts: `step_start`, `text` (the
 * assistant's message, possibly in several parts), `step_finish` with token
 * counts and cost, and, when the model calls a tool, `tool` parts. Every
 * event carries the `sessionID` a later `--session` needs. As with Codex,
 * the stream is the evidence for isolation: tools are disabled in the
 * working directory's config, and any part that only a tool call could have
 * produced refuses the turn.
 *
 * DeepSeek models sometimes write their tool-call markup into the text
 * itself when no tool is offered (`<｜｜DSML｜｜ calls>` … `<｜｜DSML｜｜ invoke
 * name="bash">`, or with single bars, `<｜DSML｜function_calls>`); such a
 * text is a tool call that never ran, not an answer, and is recorded as a
 * tool part so the turn is refused and sampled again instead of being sent
 * back as a JSON error the model would repeat.
 *
 * Verified against opencode 1.18.32; fields are read defensively so an
 * unknown part is kept in the artifact rather than failing the turn.
 */
import type { ModelUsage } from './ModelClient'

export interface OpenCodeEvent {
  type?: string
  sessionID?: string
  part?: { type?: string; text?: string; [key: string]: unknown }
  [key: string]: unknown
}

const TEXT_PART_TYPES: ReadonlySet<string> = new Set(['text'])
const HARMLESS_PART_TYPES: ReadonlySet<string> = new Set([
  'step-start',
  'step_start',
  'step-finish',
  'step_finish',
  'text',
  'reasoning',
])

/** DeepSeek's tool-call markup, with fullwidth bars (U+FF5C), one or two of them. */
const TOOL_CALL_MARKUP = /<｜{1,2}DSML｜{1,2}\s*(function_calls|calls|invoke)\b/

export interface ParsedOpenCodeEvents {
  events: OpenCodeEvent[]
  sessionId?: string
  usage?: ModelUsage
  /** Concatenated `text` parts, in order. */
  text?: string
  errors: string[]
  /** Parts that only a tool call could have produced. */
  toolParts: string[]
  unparsedLines: string[]
}

export function parseOpenCodeEvents(jsonl: string): ParsedOpenCodeEvents {
  const parsed: ParsedOpenCodeEvents = {
    events: [],
    errors: [],
    toolParts: [],
    unparsedLines: [],
  }
  const texts: string[] = []
  for (const line of jsonl.split('\n')) {
    if (line.trim() === '') {
      continue
    }
    const event = parseLine(line)
    if (event === undefined) {
      parsed.unparsedLines.push(line)
      continue
    }
    parsed.events.push(event)
    readEvent(event, parsed, texts)
  }
  if (texts.length > 0) {
    parsed.text = texts.join('')
  }
  return parsed
}

function parseLine(line: string): OpenCodeEvent | undefined {
  try {
    const value: unknown = JSON.parse(line)
    return isRecord(value) ? (value as OpenCodeEvent) : undefined
  } catch {
    return undefined
  }
}

function readEvent(
  event: OpenCodeEvent,
  parsed: ParsedOpenCodeEvents,
  texts: string[],
): void {
  if (typeof event.sessionID === 'string') {
    parsed.sessionId = event.sessionID
  }
  if (event.type === 'error') {
    parsed.errors.push(describeError(event.error ?? event.message))
    return
  }
  const part = event.part
  if (!isRecord(part) || typeof part.type !== 'string') {
    return
  }
  if (TEXT_PART_TYPES.has(part.type) && typeof part.text === 'string') {
    texts.push(part.text)
    if (TOOL_CALL_MARKUP.test(part.text)) {
      parsed.toolParts.push('text holding tool-call markup (DSML)')
    }
  }
  if (part.type === 'step-finish' || part.type === 'step_finish') {
    parsed.usage = readUsage(part.tokens)
    return
  }
  if (!HARMLESS_PART_TYPES.has(part.type)) {
    parsed.toolParts.push(describePart(part))
  }
}

function readUsage(tokens: unknown): ModelUsage | undefined {
  if (!isRecord(tokens)) {
    return undefined
  }
  const cache = isRecord(tokens.cache) ? tokens.cache : {}
  const cached = numberOr(cache.read)
  const reasoning = numberOr(tokens.reasoning)
  // opencode reports in parts what Codex reports whole: its `input` leaves
  // out the tokens read from and written to the prompt cache, and its
  // `output` leaves out the reasoning (its `total` is the sum of all five).
  // ModelUsage follows Codex, so the parts add up here.
  return {
    inputTokens: sumOf(numberOr(tokens.input), cached, numberOr(cache.write)),
    cachedInputTokens: cached,
    outputTokens: sumOf(numberOr(tokens.output), reasoning),
    reasoningOutputTokens: reasoning,
  }
}

function sumOf(...values: (number | undefined)[]): number | undefined {
  const known = values.filter((value) => value !== undefined)
  return known.length === 0 ? undefined : known.reduce((a, b) => a + b, 0)
}

function describePart(part: Record<string, unknown>): string {
  const tool = typeof part.tool === 'string' ? ` ${part.tool}` : ''
  return `${part.type as string}${tool}`
}

function describeError(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (isRecord(error)) {
    const data = isRecord(error.data) ? error.data : error
    return typeof data.message === 'string'
      ? data.message
      : JSON.stringify(error)
  }
  return String(error)
}

function numberOr(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
