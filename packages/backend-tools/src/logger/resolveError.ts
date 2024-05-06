/* eslint-disable @typescript-eslint/ban-types */
import ErrorStackParser from 'error-stack-parser'

export interface ResolvedError {
  name: string
  error: string
  stack: string[]
}

export function resolveError(error: Error, cwd: string): ResolvedError {
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
