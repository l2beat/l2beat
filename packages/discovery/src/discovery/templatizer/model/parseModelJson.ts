/**
 * Reads the JSON object out of a model's final message.
 *
 * The prompt asks for bare JSON, but models wrap answers in code fences or
 * add a sentence around them often enough that refusing would spend a
 * repair round on formatting. So: the whole message, then a fenced block,
 * then the outermost braces. Anything that still does not parse is reported
 * as a finding for the model to fix, not thrown.
 */
export type ParsedJson =
  | { value: unknown; error?: undefined }
  | { error: string }

export function parseModelJson(text: string): ParsedJson {
  const candidates = [text.trim(), fencedBlock(text), outermostBraces(text)]
  let firstError: string | undefined
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === '') {
      continue
    }
    try {
      return { value: JSON.parse(candidate) }
    } catch (error) {
      firstError ??= error instanceof Error ? error.message : String(error)
    }
  }
  return { error: firstError ?? 'the response is empty' }
}

function fencedBlock(text: string): string | undefined {
  const match = /```(?:json)?\s*\n?([\s\S]*?)```/.exec(text)
  return match?.[1]?.trim()
}

function outermostBraces(text: string): string | undefined {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  return start !== -1 && end > start ? text.slice(start, end + 1) : undefined
}
