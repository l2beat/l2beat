/* eslint-disable @typescript-eslint/ban-types */
import ErrorStackParser from 'error-stack-parser'

export function resolveLog(
  message: unknown,
  parameters: unknown,
  cwd: string,
): {} {
  if (typeof message === 'string') {
    return { message, ...resolveLogParameters(parameters, cwd) }
  } else {
    return { ...resolveLogParameters(message, cwd) }
  }
}

function resolveLogParameters(value: unknown, cwd: string): {} {
  if (value instanceof Error) {
    return {
      name: value.name,
      error: value.message,
      stack: ErrorStackParser.parse(value).map((frame) =>
        formatFrame(frame, cwd),
      ),
    }
  }

  if (typeof value === 'object' && value !== null) {
    const shallow = { ...value } as Record<string, unknown>
    delete shallow.level
    delete shallow.message
    delete shallow.service
    return shallow
  } else if (value !== undefined) {
    return { value: value }
  } else {
    return {}
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
