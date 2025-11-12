import { inspect } from 'util'
import type { LogEntry, LoggerTransport } from './types'
import { safeToJSON, tagService } from './utils'

export class ConsoleTransport implements LoggerTransport {
  constructor(private format: (entry: LogEntry) => string) {}

  static JSON = new ConsoleTransport(formatJson)
  static PLAIN = new ConsoleTransport(formatPlain(localTime))
  static PLAIN_UTC = new ConsoleTransport(formatPlain(utcTime))
  static PRETTY = new ConsoleTransport(formatPretty(localTime))
  static PRETTY_UTC = new ConsoleTransport(formatPretty(utcTime))
  static RAW = new ConsoleTransport(formatRaw())

  log(entry: LogEntry): void {
    const formatted = this.format(entry)
    switch (entry.level) {
      case 'CRITICAL':
      case 'ERROR':
        console.error(formatted)
        break
      case 'WARN':
        console.warn(formatted)
        break
      case 'INFO':
        console.log(formatted)
        break
      case 'DEBUG':
      case 'TRACE':
        console.debug(formatted)
        break
    }
  }

  flush(): void {}
}

export function formatJson(entry: LogEntry): string {
  const { service, tag, error, ...rest } = entry.parameters
  const core = {
    time: entry.time.toISOString(),
    level: entry.level,
    service: tagService(service, tag),
    message: entry.message,
    error,
  }
  return safeToJSON({ ...core, parameters: rest })
}

export function utcTime(time: Date) {
  const h = time.getUTCHours().toString().padStart(2, '0')
  const m = time.getUTCMinutes().toString().padStart(2, '0')
  const s = time.getUTCSeconds().toString().padStart(2, '0')
  const ms = time.getUTCMilliseconds().toString().padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

export function localTime(time: Date) {
  const h = time.getHours().toString().padStart(2, '0')
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')
  const ms = time.getMilliseconds().toString().padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

function withError(parameters: Record<string, unknown>, error: unknown) {
  if (typeof error === 'object' && error !== null && !Array.isArray(error)) {
    return { ...error, ...parameters }
  }
  return { error, ...parameters }
}

export function formatPlain(formatTime: (time: Date) => string) {
  return function formatPlain(entry: LogEntry): string {
    const { service, tag, error, ...rest } = entry.parameters
    const tagged = tagService(service, tag)
    const serviceFmt = tagged ? ` [${tagged}]` : ''
    const restJson = safeToJSON(withError(rest, error))
    const restFmt = restJson !== '{}' ? ` ${restJson}` : ''
    return `${formatTime(entry.time)} ${entry.level}${serviceFmt} ${entry.message}${restFmt}`
  }
}

const COLOR_RESET = '\x1b[0m'
const COLOR_GRAY = '\x1b[90m'
const COLOR_YELLOW = '\x1b[33m'

const LEVEL_COLOR = {
  NONE: '\x1b[90;1mNONE\x1b[0m',
  CRITICAL: '\x1b[31;1mCRITICAL\x1b[0m',
  ERROR: '\x1b[31;1mERROR\x1b[0m',
  WARN: '\x1b[33;1mWARN\x1b[0m',
  INFO: '\x1b[32;1mINFO\x1b[0m',
  DEBUG: '\x1b[35;1mDEBUG\x1b[0m',
  TRACE: '\x1b[90;1mTRACE\x1b[0m',
}

export function formatPretty(formatTime: (time: Date) => string) {
  return function formatPretty(entry: LogEntry): string {
    const { service, tag, error, ...rest } = entry.parameters
    const tagged = tagService(service, tag)
    const serviceFmt = tagged
      ? ` ${COLOR_GRAY}[${COLOR_YELLOW}${tagged}${COLOR_GRAY}]${COLOR_RESET}`
      : ''
    const restFmt = formatParametersPretty(
      JSON.parse(safeToJSON(withError(rest, error))),
    )
    const timeFmt = `${COLOR_GRAY}${formatTime(entry.time)}${COLOR_RESET}`
    const levelFmt = LEVEL_COLOR[entry.level]
    return `${timeFmt} ${levelFmt}${serviceFmt} ${entry.message}${restFmt}`
  }
}

export function formatRaw() {
  return function formatRaw(entry: LogEntry): string {
    const { error, service: _, tag: __, ...rest } = entry.parameters
    const restFmt = formatParametersPretty(
      JSON.parse(safeToJSON(withError(rest, error))),
    )
    return `${entry.message}${restFmt}`
  }
}

const STYLES = {
  bigint: 'white',
  boolean: 'white',
  date: 'white',
  module: 'white',
  name: 'blue',
  null: 'white',
  number: 'white',
  regexp: 'white',
  special: 'white',
  string: 'white',
  symbol: 'white',
  undefined: 'white',
}

const INDENT_SIZE = 4
const INDENT = ' '.repeat(INDENT_SIZE)

function formatParametersPretty(parameters: Record<string, unknown>): string {
  const oldStyles = inspect.styles
  inspect.styles = STYLES
  const inspected = inspect(parameters, {
    colors: true,
    breakLength: 80 - INDENT_SIZE,
    depth: 5,
  })
  inspect.styles = oldStyles

  if (inspected === '{}') {
    return ''
  }

  const indented = inspected
    .split('\n')
    .map((x) => INDENT + x)
    .join('\n')

  return `\n${COLOR_GRAY}${indented}${COLOR_RESET}`
}
