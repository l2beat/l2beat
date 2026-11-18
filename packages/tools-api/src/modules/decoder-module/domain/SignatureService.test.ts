import { Logger } from '@l2beat/backend-tools'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import type { FourByteClient } from '../../../third-party/FourByteClient'
import type { Sourcify4ByteClient } from '../../../third-party/Sourcify4ByteClient'
import { SignatureService } from './SignatureService'

const SELECTOR = '0xa9059cbb'
const SIGNATURE = 'function transfer(address,uint256)'
const LOOKUP_TIMEOUT_MS = 1000

describe(SignatureService.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  describe(SignatureService.prototype.lookup.name, () => {
    // The first call hits upstreams that never answer, and the fake clock is
    // advanced past the timeout. The second call must ask the upstreams again
    // rather than return the empty result of the first one.
    it('does not cache a lookup that timed out', async () => {
      const sourcifyLookup = mockFn<Sourcify4ByteClient['lookup']>()
        .returnsOnce(new Promise<string[]>(() => {}))
        .resolvesToOnce([SIGNATURE])
      const fourByteLookup = mockFn<FourByteClient['lookup']>()
        .returnsOnce(new Promise<string[]>(() => {}))
        .resolvesToOnce([])
      const service = createService(sourcifyLookup, fourByteLookup)

      const first = service.lookup(SELECTOR)
      await time.tickAsync(LOOKUP_TIMEOUT_MS)
      expect(await first).toEqual([])
      expect(time.countTimers()).toEqual(0)

      expect(await service.lookup(SELECTOR)).toEqual([SIGNATURE])
      expect(sourcifyLookup).toHaveBeenCalledTimes(2)
      expect(fourByteLookup).toHaveBeenCalledTimes(2)
      expect(time.countTimers()).toEqual(0)
    })

    // An upstream error is not evidence that the selector is unknown, so the
    // partial answer of the first call must not stick.
    it('does not cache a lookup that failed', async () => {
      const sourcifyLookup = mockFn<Sourcify4ByteClient['lookup']>()
        .rejectsWithOnce(new Error('Sourcify is down'))
        .resolvesToOnce([SIGNATURE])
      const fourByteLookup = mockFn<FourByteClient['lookup']>()
        .resolvesToOnce([])
        .resolvesToOnce([])
      const service = createService(sourcifyLookup, fourByteLookup)

      expect(await service.lookup(SELECTOR)).toEqual([])
      expect(await service.lookup(SELECTOR)).toEqual([SIGNATURE])
    })

    it('caches a lookup that every upstream answered', async () => {
      const sourcifyLookup = mockFn<
        Sourcify4ByteClient['lookup']
      >().resolvesToOnce([SIGNATURE])
      const fourByteLookup = mockFn<FourByteClient['lookup']>().resolvesToOnce([
        SIGNATURE,
      ])
      const service = createService(sourcifyLookup, fourByteLookup)

      expect(await service.lookup(SELECTOR)).toEqual([SIGNATURE])
      expect(await service.lookup(SELECTOR)).toEqual([SIGNATURE])
      expect(sourcifyLookup).toHaveBeenCalledTimes(1)
      expect(fourByteLookup).toHaveBeenCalledTimes(1)
    })
  })
})

function createService(
  sourcifyLookup: Sourcify4ByteClient['lookup'],
  fourByteLookup: FourByteClient['lookup'],
): SignatureService {
  return new SignatureService(
    mockObject<Sourcify4ByteClient>({ lookup: sourcifyLookup }),
    mockObject<FourByteClient>({ lookup: fourByteLookup }),
    { names: {}, abis: {}, allAbis: [], preImages: [] },
    {},
    Logger.SILENT,
  )
}
