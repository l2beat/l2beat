import type { TokenUsage } from '../types.js'

export interface Transcript {
  lastMessage?: string
  commands: string[]
  usage?: TokenUsage
  error?: string
}

/** Parses `codex exec --json` JSONL events. Unknown events are ignored. */
export function parseTranscript(jsonl: string): Transcript {
  const result: Transcript = { commands: [] }
  for (const line of jsonl.split('\n')) {
    if (!line.trim()) continue
    let event: unknown
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    const e = event as {
      type?: string
      message?: string
      error?: { message?: string }
      item?: { type?: string; text?: string; command?: string }
      usage?: Record<string, number>
    }
    switch (e.type) {
      case 'item.completed':
        if (e.item?.type === 'agent_message' && e.item.text !== undefined) {
          result.lastMessage = e.item.text
        } else if (e.item?.type === 'command_execution' && e.item.command) {
          result.commands.push(e.item.command)
        }
        break
      case 'turn.completed':
        result.usage = {
          input: e.usage?.input_tokens ?? 0,
          cachedInput: e.usage?.cached_input_tokens ?? 0,
          output: e.usage?.output_tokens ?? 0,
        }
        break
      case 'turn.failed':
      case 'error':
        result.error = e.error?.message ?? e.message ?? 'unknown engine error'
        break
    }
  }
  return result
}

export function totalTokens(usage: TokenUsage): number {
  return usage.input + usage.output
}
