import { assert } from '@l2beat/shared-pure'
import { Terminal } from '@xterm/headless'
import chalk from 'chalk'
import { expect } from 'earl'
import { clearLine, clearScreenDown, cursorTo, moveCursor } from 'readline'
import { Writable } from 'stream'
import { CliLogger, type LiveScreen } from './CliLogger'

const ANSI_RED = 1

function terminalLogger(columns = 80, rows = 24) {
  // convertEol stands in for the tty line discipline (onlcr) that turns our
  // '\n' into '\r\n' on a real terminal.
  const terminal = new Terminal({
    cols: columns,
    rows,
    convertEol: true,
    allowProposedApi: true,
    scrollback: 1000,
  })
  const captured: string[] = []
  const stream = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      const text = chunk.toString()
      captured.push(text)
      terminal.write(text)
      callback()
    },
  })
  const screen: LiveScreen = {
    get columns() {
      return terminal.cols
    },
    write: (text) => {
      stream.write(text)
    },
    moveCursor: (dx, dy) => {
      moveCursor(stream, dx, dy)
    },
    cursorTo: (x) => {
      cursorTo(stream, x)
    },
    clearLine: (dir) => {
      clearLine(stream, dir)
    },
    clearScreenDown: () => {
      clearScreenDown(stream)
    },
  }
  const clock = { now: 0 }
  const logger = new CliLogger(screen.write, { screen, now: () => clock.now })

  async function screenRows(): Promise<string[]> {
    await new Promise<void>((resolve) => terminal.write('', resolve))
    const buffer = terminal.buffer.active
    const lines: string[] = []
    for (let y = 0; y < buffer.length; y++) {
      const line = buffer.getLine(y)
      assert(line !== undefined)
      lines.push(line.translateToString(true))
    }
    while (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop()
    }
    return lines
  }

  function foregroundColor(row: number, column: number) {
    const line = terminal.buffer.active.getLine(row)
    assert(line !== undefined)
    const cell = line.getCell(column)
    assert(cell !== undefined)
    return { isDefault: cell.isFgDefault(), palette: cell.getFgColor() }
  }

  return { terminal, logger, clock, captured, screenRows, foregroundColor }
}

function plainLogger() {
  const written: string[] = []
  const logger = new CliLogger((text) => written.push(text), undefined)
  return { written, logger }
}

function csiFinalBytes(captured: string[]): Set<string> {
  const finals = new Set<string>()
  const text = captured.join('')
  let index = text.indexOf('\x1b')
  while (index !== -1) {
    expect(text[index + 1]).toEqual('[')
    let end = index + 2
    while ('0123456789;'.includes(text[end])) {
      end += 1
    }
    finals.add(text[end])
    index = text.indexOf('\x1b', end)
  }
  return finals
}

describe(CliLogger.name, () => {
  describe('live', () => {
    it('keeps log lines in order above the status rows', async () => {
      const { logger, screenRows } = terminalLogger()
      logger.log('first')
      const status = logger.status()
      status.update('working')
      logger.log('second')
      expect(await screenRows()).toEqual(['first', 'second', 'working'])
    })

    it('redraws a status in place without growing the screen', async () => {
      const { logger, clock, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('step 1 of a long description')
      clock.now += 100
      status.update('step 2')
      expect(await screenRows()).toEqual(['step 2'])
    })

    it('commits the final text on done', async () => {
      const { logger, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('downloading')
      status.done('downloaded 10 MB')
      logger.log('after')
      expect(await screenRows()).toEqual(['downloaded 10 MB', 'after'])
    })

    it('removes the row on done without text', async () => {
      const { logger, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('temporary')
      status.done()
      expect(await screenRows()).toEqual([])
    })

    it('keeps the order of the remaining statuses', async () => {
      const { logger, clock, screenRows } = terminalLogger()
      const a = logger.status()
      const b = logger.status()
      const c = logger.status()
      a.update('a')
      clock.now += 100
      b.update('b')
      clock.now += 100
      c.update('c')
      b.done()
      expect(await screenRows()).toEqual(['a', 'c'])
    })

    it('skips redraws inside one frame and flushes on log', async () => {
      const { logger, clock, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('1')
      clock.now += 10
      status.update('2')
      expect(await screenRows()).toEqual(['1'])
      logger.log('line')
      expect(await screenRows()).toEqual(['line', '2'])
    })

    it('draws the latest text on done even inside one frame', async () => {
      const { logger, clock, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('1')
      clock.now += 10
      status.update('2')
      status.done('final')
      expect(await screenRows()).toEqual(['final'])
    })

    it('cuts an overlong coloured status to the screen width', async () => {
      const { logger, screenRows, foregroundColor } = terminalLogger(10)
      const colored = new chalk.Instance({ level: 1 })
      const status = logger.status()
      status.update(colored.red('0123456789abcdef'))
      expect(await screenRows()).toEqual(['012345678'])
      expect(foregroundColor(0, 0).isDefault).toEqual(true)
    })

    it('keeps colours on a status that fits', async () => {
      const { logger, screenRows, foregroundColor } = terminalLogger(20)
      const colored = new chalk.Instance({ level: 1 })
      const status = logger.status()
      status.update(colored.red('short'))
      expect(await screenRows()).toEqual(['short'])
      expect(foregroundColor(0, 0).palette).toEqual(ANSI_RED)
    })

    it('writes multi-line logs as separate rows', async () => {
      const { logger, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('status')
      logger.log('one\ntwo')
      expect(await screenRows()).toEqual(['one', 'two', 'status'])
    })

    it('wraps an overlong log line and keeps the status below it', async () => {
      const { logger, screenRows } = terminalLogger(20)
      const status = logger.status()
      status.update('status')
      logger.log('x'.repeat(30))
      expect(await screenRows()).toEqual([
        'x'.repeat(20),
        'x'.repeat(10),
        'status',
      ])
    })

    it('survives scrolling at the bottom of a short terminal', async () => {
      const { logger, clock, screenRows } = terminalLogger(80, 5)
      const status = logger.status()
      status.update('status')
      const logs: string[] = []
      for (let i = 0; i < 10; i++) {
        clock.now += 100
        logger.log(`line ${i}`)
        logs.push(`line ${i}`)
      }
      clock.now += 100
      status.update('final status')
      expect(await screenRows()).toEqual([...logs, 'final status'])
    })

    it('fits the status to the width after a resize', async () => {
      const { terminal, logger, clock, screenRows } = terminalLogger(80)
      const status = logger.status()
      status.update('short')
      terminal.resize(40, 24)
      clock.now += 100
      status.update('y'.repeat(60))
      expect(await screenRows()).toEqual(['y'.repeat(39)])
    })

    it('emits only cursor up, column, clear right and clear down', async () => {
      const { logger, clock, captured, screenRows } = terminalLogger()
      const status = logger.status()
      logger.log('log')
      status.update('a')
      clock.now += 100
      status.update('b')
      status.done('c')
      await screenRows()
      expect(csiFinalBytes(captured)).toEqual(new Set(['A', 'G', 'K', 'J']))
    })
  })

  describe('toLogger', () => {
    it('prints logger lines above the status rows', async () => {
      const { logger, screenRows } = terminalLogger()
      const status = logger.status()
      status.update('working')
      const backendLogger = logger.toLogger('INFO')
      backendLogger.info('from logger')
      backendLogger.debug('hidden')
      expect(await screenRows()).toEqual(['from logger', 'working'])
    })
  })

  describe('plain', () => {
    it('prints log lines and final texts only', () => {
      const { written, logger } = plainLogger()
      logger.log('start')
      const status = logger.status()
      status.update('progress 1')
      status.update('progress 2')
      status.done('finished')
      expect(written).toEqual(['start\n', 'finished\n'])
    })

    it('prints nothing for a status done without text', () => {
      const { written, logger } = plainLogger()
      const status = logger.status()
      status.update('progress')
      status.done()
      expect(written).toEqual([])
    })
  })

  describe('misuse', () => {
    it('rejects update after done', () => {
      const { logger } = plainLogger()
      const status = logger.status()
      status.done()
      expect(() => status.update('late')).toThrow()
    })

    it('rejects done twice', () => {
      const { logger } = plainLogger()
      const status = logger.status()
      status.done()
      expect(() => status.done()).toThrow()
    })

    it('rejects multi-line status text', () => {
      const { logger } = plainLogger()
      const status = logger.status()
      expect(() => status.update('a\nb')).toThrow()
    })
  })
})
