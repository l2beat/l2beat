import { randomBytes } from 'crypto'
import { stripAnsiEscapeCodes } from '@l2beat/shared-pure'

const START_SYNC: string = '\x1b[?2026h'
const FINISH_SYNC: string = '\x1b[?2026l'
const UP_ONE_LINE = '\x1bM'
const DOWN_ONE_LINE = '\x1bD'
const CLEAR_SCREEN: string = '\x1b[J'
const HIDE_CURSOR: string = '\x1b[?25l'
const SHOW_CURSOR: string = '\x1b[?25h'

export type StatusLineHandle = string

export class CliLogger {
  private readonly REDRAW_DELAY: number = 1000 / 30 // 30fps
  private readonly statusLines: Map<string, string> = new Map()
  private readonly logs: string[] = []
  private lastLines: number = 0
  private lastRedraw: number = 0
  private drawTimeoutId?: ReturnType<typeof setTimeout>

  constructor() {
    // NOTE(radomski): Without this on process exit the entire output would be cleared
    process.on('exit', async () => {
      await writeAllBlocking(
        START_SYNC +
          SHOW_CURSOR +
          DOWN_ONE_LINE.repeat(this.lastLines) +
          FINISH_SYNC,
      )
    })

    process.on('SIGINT', async () => {
      await writeAllBlocking(START_SYNC + SHOW_CURSOR + FINISH_SYNC)
      process.exit()
    })
  }

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
    buffer += HIDE_CURSOR
    buffer += CLEAR_SCREEN

    let newLines = 0
    for (const log of this.logs) {
      buffer += log
      newLines += countNewlines(log)
    }

    let longestStatusLine: number = 0
    for (const [_, status] of this.statusLines) {
      const raw = stripAnsiEscapeCodes(status)
      longestStatusLine = Math.max(longestStatusLine, raw.length)
    }

    if (this.statusLines.size > 0) {
      const divider = `${'<*>'.repeat(Math.ceil(longestStatusLine / 15) * 5)}\n`
      buffer += divider
      newLines += countNewlines(divider)
    }

    for (const [_, status] of this.statusLines) {
      buffer += status
      newLines += countNewlines(status)
    }

    buffer += FINISH_SYNC
    buffer += UP_ONE_LINE.repeat(newLines)

    const now = Date.now()
    clearTimeout(this.drawTimeoutId)
    this.drawTimeoutId = setTimeout(
      async () => {
        await writeAllBlocking(buffer)
        this.lastLines = newLines
        this.lastRedraw = now
      },
      Math.max(0, this.lastRedraw - now + this.REDRAW_DELAY),
    )
  }
}

function writeAllBlocking(data: string): Promise<void> {
  return new Promise((resolve) => {
    function write() {
      if (process.stdout.write(data)) {
        resolve()
      } else {
        process.stdout.once('drain', write)
      }
    }
    write()
  })
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
