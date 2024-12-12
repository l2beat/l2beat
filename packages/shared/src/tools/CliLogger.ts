import { randomBytes } from 'crypto'
import { writeSync } from 'fs'

const START_SYNC: string = '\x1b[?2026h'
const UP_ONE_LINE = '\x1bM'
const FINISH_SYNC: string = '\x1b[?2026l'
const CLEAR_SCREEN: string = '\x1b[J'

export type StatusLineHandle = string

const getWindowSize: (() => [number, number]) | undefined =
  process.stdout.getWindowSize

export class CliLogger {
  private readonly REDRAW_DELAY: number = 1000 / 30 // 30fps
  private readonly statusLines: Map<string, string> = new Map()
  private logs: string[] = []
  private logsToWrite: number = 0
  private lastLines: number = 0
  private lastRedraw: number = 0
  private drawTimeoutId?: ReturnType<typeof setTimeout>
  private termWidth: number = getWindowSize
    ? process.stdout.getWindowSize()[0]
    : 80

  logLine(input: string) {
    this.logs.push(input + '\n')
    this.redraw()
  }

  updateStatus(id: StatusLineHandle | string, content: string) {
    this.statusLines.set(id, content + '\n')
    this.redraw()
  }

  createStatus(): StatusLineHandle {
    const key = generateUUID()
    this.createEmptyStatus(key)
    return key
  }

  private createEmptyStatus(key: string) {
    this.statusLines.set(key, '')
  }

  removeStatus(key: StatusLineHandle): void {
    this.statusLines.delete(key)
  }

  redraw() {
    let buffer = ''

    buffer += START_SYNC
    buffer += UP_ONE_LINE.repeat(this.lastLines)
    buffer += CLEAR_SCREEN

    this.logsToWrite = this.logs.length
    for (const log of this.logs) {
      buffer += log
    }

    let newLines = 0
    if (this.statusLines.size > 0) {
      const third = Math.floor(this.termWidth / 3)
      const ninth = Math.floor(this.termWidth / 9)

      const minus = '-'.repeat(ninth)
      const equal = '='.repeat(ninth)
      const divider = `${' '.repeat(third)}${minus}${equal}${minus}\n`
      buffer += divider
      newLines += countNewlines(divider)
    }

    const maxWidth = this.termWidth - 3
    for (const [_, status] of this.statusLines) {
      const postfix = status.length > maxWidth ? '\n' : ''
      buffer += status.slice(0, maxWidth) + postfix
      newLines += countNewlines(status)
    }

    buffer += FINISH_SYNC

    const now = Date.now()
    clearTimeout(this.drawTimeoutId)
    const timeout = Math.max(0, this.lastRedraw - now + this.REDRAW_DELAY)
    if (timeout === 0) {
      this.lastRedraw = now
      this.lastLines = newLines
      writeAllBlocking(buffer)
      this.logs = this.logs.slice(this.logsToWrite)
    } else {
      this.drawTimeoutId = setTimeout(() => {
        this.lastLines = newLines
        this.lastRedraw = Date.now()
        writeAllBlocking(buffer)
        this.logs = this.logs.slice(this.logsToWrite)
      }, timeout)
    }
  }
}

function writeAllBlocking(data: string): void {
  writeSync(process.stderr.fd, data)
  //fsyncSync(process.stderr.fd)
}

function countNewlines(str: string): number {
  let count = 0

  for (const c of str) {
    if (c === '\n') {
      count += 1
    }
  }

  return count
}

function generateUUID(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) =>
    (+c ^ (randomBytes(1)[0] & (15 >> (+c / 4)))).toString(16),
  )
}
