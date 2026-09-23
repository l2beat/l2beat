import { Logger, type LogLevel } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import { stripVTControlCharacters } from 'util'

const FRAME_MS = 1000 / 30

export interface LiveScreen {
  readonly columns: number
  write(text: string): void
  moveCursor(dx: number, dy: number): void
  cursorTo(x: number): void
  clearLine(dir: -1 | 0 | 1): void
  clearScreenDown(): void
}

export interface LiveOptions {
  screen: LiveScreen
  now: () => number
}

export interface StatusLine {
  update(text: string): void
  done(finalText?: string): void
}

interface StatusEntry {
  text: string
  active: boolean
}

export function createCliLogger(options: {
  output: NodeJS.WriteStream
  quiet: boolean
}): CliLogger {
  if (options.quiet) {
    return new CliLogger(() => {}, undefined)
  }
  const write = (text: string) => {
    options.output.write(text)
  }
  const live = options.output.isTTY && options.output.columns > 1
  if (!live) {
    return new CliLogger(write, undefined)
  }
  return new CliLogger(write, { screen: options.output, now: Date.now })
}

export class CliLogger {
  private readonly statuses: StatusEntry[] = []
  private pendingLogs: string[] = []
  private drawnRows = 0
  private lastDrawAt = Number.NEGATIVE_INFINITY

  constructor(
    private readonly write: (text: string) => void,
    private readonly live: LiveOptions | undefined,
  ) {}

  log(line: string): void {
    this.pendingLogs.push(line)
    this.flush()
  }

  toLogger(level: LogLevel): Logger {
    return Logger.INFO.configure({
      level,
      transports: [
        { log: (entry) => this.log(entry.message), flush: () => {} },
      ],
    })
  }

  status(): StatusLine {
    const entry: StatusEntry = { text: '', active: true }
    this.statuses.push(entry)
    return {
      update: (text) => this.updateStatus(entry, text),
      done: (finalText) => this.finishStatus(entry, finalText),
    }
  }

  private updateStatus(entry: StatusEntry, text: string): void {
    assert(entry.active, 'status line is already done')
    assert(!text.includes('\n'), 'status text must be a single line')
    entry.text = text
    if (this.live === undefined) {
      return
    }
    if (this.live.now() - this.lastDrawAt < FRAME_MS) {
      return
    }
    this.draw(this.live)
  }

  private finishStatus(entry: StatusEntry, finalText: string | undefined) {
    assert(entry.active, 'status line is already done')
    entry.active = false
    const index = this.statuses.indexOf(entry)
    assert(index !== -1)
    this.statuses.splice(index, 1)
    if (finalText !== undefined) {
      this.pendingLogs.push(finalText)
    }
    this.flush()
  }

  private flush(): void {
    if (this.live !== undefined) {
      this.draw(this.live)
      return
    }
    for (const line of this.pendingLogs) {
      this.write(`${line}\n`)
    }
    this.pendingLogs = []
  }

  private draw(live: LiveOptions): void {
    const screen = live.screen
    assert(Number.isInteger(screen.columns))
    assert(screen.columns > 1)

    screen.moveCursor(0, -this.drawnRows)
    screen.cursorTo(0)
    for (const line of this.pendingLogs) {
      for (const row of line.split('\n')) {
        writeRow(screen, row)
      }
    }
    this.pendingLogs = []

    const widthMax = screen.columns - 1
    for (const entry of this.statuses) {
      writeRow(screen, fitWidth(entry.text, widthMax))
    }
    screen.clearScreenDown()

    this.drawnRows = this.statuses.length
    this.lastDrawAt = live.now()
  }
}

function writeRow(screen: LiveScreen, text: string): void {
  screen.write(text)
  screen.clearLine(1)
  screen.write('\n')
}

function fitWidth(text: string, widthMax: number): string {
  assert(widthMax >= 1)
  const visible = stripVTControlCharacters(text)
  if (visible.length <= widthMax) {
    return text
  }
  return visible.slice(0, widthMax)
}
