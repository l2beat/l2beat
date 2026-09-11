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
    let event: {
      type?: string
      message?: string
      error?: { message?: string }
      item?: { type?: string; text?: string; command?: string }
      usage?: Record<string, number>
    }
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    switch (event.type) {
      case 'item.completed':
        if (
          event.item?.type === 'agent_message' &&
          event.item.text !== undefined
        ) {
          result.lastMessage = event.item.text
        } else if (
          event.item?.type === 'command_execution' &&
          event.item.command
        ) {
          result.commands.push(event.item.command)
        }
        break
      case 'turn.completed':
        result.usage = {
          input: event.usage?.input_tokens ?? 0,
          cachedInput: event.usage?.cached_input_tokens ?? 0,
          output: event.usage?.output_tokens ?? 0,
        }
        break
      case 'turn.failed':
      case 'error':
        result.error =
          event.error?.message ?? event.message ?? 'unknown engine error'
        break
    }
  }
  return result
}

export function totalTokens(usage: TokenUsage): number {
  return usage.input + usage.output
}
