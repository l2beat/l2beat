import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { TimeLoop } from './TimeLoop'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class TestTimeLoop extends TimeLoop {
  private fn: () => Promise<string>
  protected logger: Logger

  constructor(fn: () => Promise<string>, logger: Logger) {
    super({ intervalMs: 1 })
    this.fn = fn
    this.logger = logger
  }

  async run() {
    await this.fn()
  }

  override loopBody(): Promise<void> {
    return super.loopBody()
  }
}

describe(TimeLoop.name, () => {
  describe(TimeLoop.prototype.start.name, () => {
    it('executes and sets interval', async () => {
      const fn = mockFn().resolvesTo('')

      const timeLoop = new TestTimeLoop(fn, Logger.SILENT)

      const intervalHandle = timeLoop.start()
      assert(intervalHandle)

      await wait(10)
      clearInterval(intervalHandle)

      expect(fn.calls.length).toBeGreaterThan(1)
    })

    it('returns undefined if already started', async () => {
      const fn = mockFn().resolvesTo('')

      const timeLoop = new TestTimeLoop(fn, Logger.SILENT)

      const intervalHandle = timeLoop.start()
      const secondIntervalHandle = timeLoop.start()
      clearInterval(intervalHandle)

      expect(secondIntervalHandle).toEqual(undefined)
    })
  })

  describe(TestTimeLoop.prototype.loopBody.name, () => {
    it('skips execution when already running (prevents concurrent runs)', async () => {
      const fn = mockFn().resolvesTo('')

      const timeLoop = new TestTimeLoop(fn, Logger.SILENT)

      await Promise.all([timeLoop.loopBody(), timeLoop.loopBody()])

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('clears running flag after finish', async () => {
      const fn = mockFn().resolvesTo('')

      const timeLoop = new TestTimeLoop(fn, Logger.SILENT)

      await timeLoop.loopBody()
      await timeLoop.loopBody()

      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe(TimeLoop.prototype.pause.name, () => {
    it('stops interval ticks when paused', async () => {
      const fn = mockFn().resolvesTo('')

      const timeLoop = new TestTimeLoop(fn, Logger.SILENT)
      timeLoop.start()

      await wait(10)
      timeLoop.pause()

      await wait(5)
      const callsAfterPause = fn.calls.length

      await wait(10)
      expect(fn.calls.length).toEqual(callsAfterPause)
    })
  })

  describe(TimeLoop.prototype.unpause.name, () => {
    it('restarts interval ticks when unpaused', async () => {
      const fn = mockFn().resolvesTo('')

      const timeLoop = new TestTimeLoop(fn, Logger.SILENT)
      timeLoop.start()

      await wait(10)
      timeLoop.pause()

      await wait(5)
      const callsAfterPause = fn.calls.length

      timeLoop.unpause()

      await wait(10)
      timeLoop.pause()

      expect(fn.calls.length).toBeGreaterThan(callsAfterPause)
    })
  })
})
