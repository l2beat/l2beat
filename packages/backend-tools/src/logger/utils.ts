import ErrorStackParser from 'error-stack-parser'

export function safeToJSON(parameters: object): string {
  try {
    return JSON.stringify(parameters, (_k, v: unknown) =>
      typeof v === 'bigint' ? v.toString() : v,
    )
  } catch {
    return '{}'
  }
}

export function tagService(service: unknown, tag: unknown): string | undefined {
  const serviceStr = service !== undefined ? `${service}` : ''
  const tagStr = tag !== undefined ? `:${tag}` : ''
  return serviceStr + tagStr || undefined
}

export function resolveError(error: Error, cwd: string) {
  return {
    name: error.name,
    error: error.message,
    stack: ErrorStackParser.parse(error).map((frame) =>
      formatFrame(frame, cwd),
    ),
  }
}

function formatFrame(frame: StackFrame, cwd: string): string {
  const file = frame.fileName?.startsWith(cwd)
    ? frame.fileName.slice(cwd.length)
    : frame.fileName
  const functionName = frame.functionName ? `${frame.functionName} ` : ''

  const fileLocation =
    frame.lineNumber !== undefined && frame.columnNumber !== undefined
      ? `:${frame.lineNumber}:${frame.columnNumber}`
      : ''
  const location = file !== undefined ? `(${file}${fileLocation})` : ''

  return `${functionName}${location}`
}
