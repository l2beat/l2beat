/**
 * Reads the JSON object out of a model's final message.
 *
 * The prompt asks for bare JSON, but models wrap answers in code fences, add
 * a sentence around them, or end a one-line object with a stray `}` often
 * enough that refusing would spend a repair round on formatting. So: the
 * whole message, then a fenced block, then the outermost braces, then the
 * first object that closes. Anything that still does not parse is reported
 * as a finding for the model to fix, not thrown; when the object is never
 * closed, the finding says by how many braces, because a character position
 * alone was not something models acted on.
 */
export type ParsedJson =
  | { value: unknown; error?: undefined }
  | { error: string }

export function parseModelJson(text: string): ParsedJson {
  const braces = scanBraces(text)
  const candidates = [
    text.trim(),
    fencedBlock(text),
    outermostBraces(text),
    braces.closed,
  ]
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
  if (firstError === undefined) {
    return { error: 'the response is empty' }
  }
  if (braces.unclosed > 0) {
    return {
      error: `${firstError}; the object is never closed, there are ${braces.unclosed} more "{" than "}"`,
    }
  }
  return { error: firstError }
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

interface BraceScan {
  /** From the first `{` to the `}` that closes it; undefined when it never closes. */
  closed?: string
  /** `{` left open at the end of the text. */
  unclosed: number
}

/** Braces outside strings only, so a `}` in a reason does not count. */
function scanBraces(text: string): BraceScan {
  const start = text.indexOf('{')
  if (start === -1) {
    return { unclosed: 0 }
  }
  let depth = 0
  let inString = false
  for (let i = start; i < text.length; i++) {
    const char = text[i]
    if (inString) {
      if (char === '\\') {
        i++
      } else if (char === '"') {
        inString = false
      }
    } else if (char === '"') {
      inString = true
    } else if (char === '{') {
      depth++
    } else if (char === '}' && --depth === 0) {
      return { closed: text.slice(start, i + 1), unclosed: 0 }
    }
  }
  return { unclosed: depth }
}
