const LOG_LEVELS = [
  'NONE',
  'CRITICAL',
  'ERROR',
  'WARN',
  'INFO',
  'DEBUG',
  'TRACE',
  'METRIC',
] as const
export type LogLevel = (typeof LOG_LEVELS)[number]
export const LEVEL = {} as Record<LogLevel, number>
for (const [index, level] of LOG_LEVELS.entries()) {
  LEVEL[level] = index
}
