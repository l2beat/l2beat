// Terminal output truncation for verbose call graph logging
export const MAX_OUTPUT_LENGTH = 50_000
export const TRUNCATE_TO_LENGTH = 40_000

export function truncateOutput(output: string): string {
  if (output.length <= MAX_OUTPUT_LENGTH) {
    return output
  }
  const truncatePoint = output.length - TRUNCATE_TO_LENGTH
  const nextNewline = output.indexOf('\n', truncatePoint)
  if (nextNewline === -1) {
    return '[...truncated...]\n' + output.slice(truncatePoint)
  }
  return '[...truncated...]\n' + output.slice(nextNewline + 1)
}
