import { expect } from 'earl'
import {
  formatCriticalDate,
  getCriticalStatus,
  getNextCriticalTransitionDelayMs,
  isOssificationCritical,
  MAX_CRITICAL_TIMEOUT_MS,
} from './ossification'

describe('ossification helpers', () => {
  const NOW = 1_750_000_000

  it('classifies undefined as none', () => {
    expect(getCriticalStatus(undefined, NOW)).toEqual('none')
    expect(isOssificationCritical(undefined, NOW)).toEqual(false)
  })

  it('classifies true and active windows as critical', () => {
    expect(getCriticalStatus(true, NOW)).toEqual('critical')
    expect(isOssificationCritical(true, NOW)).toEqual(true)

    expect(getCriticalStatus({ sinceTimestamp: NOW - 100 }, NOW)).toEqual(
      'critical',
    )
    expect(isOssificationCritical({ sinceTimestamp: NOW - 100 }, NOW)).toEqual(
      true,
    )

    expect(getCriticalStatus({ untilTimestamp: NOW + 100 }, NOW)).toEqual(
      'critical',
    )
    expect(isOssificationCritical({ untilTimestamp: NOW + 100 }, NOW)).toEqual(
      true,
    )

    expect(getCriticalStatus({ untilTimestamp: NOW }, NOW)).toEqual('critical')
    expect(isOssificationCritical({ untilTimestamp: NOW }, NOW)).toEqual(true)

    expect(
      getCriticalStatus(
        { sinceTimestamp: NOW - 100, untilTimestamp: NOW + 100 },
        NOW,
      ),
    ).toEqual('critical')
  })

  it('classifies windows whose untilTimestamp has passed as retired', () => {
    expect(getCriticalStatus({ untilTimestamp: NOW - 1 }, NOW)).toEqual(
      'retired',
    )
    expect(isOssificationCritical({ untilTimestamp: NOW - 1 }, NOW)).toEqual(
      false,
    )

    expect(
      getCriticalStatus(
        {
          sinceTimestamp: NOW - 100,
          untilTimestamp: NOW - 10,
        },
        NOW,
      ),
    ).toEqual('retired')
    expect(
      isOssificationCritical(
        {
          sinceTimestamp: NOW - 100,
          untilTimestamp: NOW - 10,
        },
        NOW,
      ),
    ).toEqual(false)
  })

  it('classifies windows whose sinceTimestamp is in the future as scheduled', () => {
    expect(getCriticalStatus({ sinceTimestamp: NOW + 1 }, NOW)).toEqual(
      'scheduled',
    )
    expect(isOssificationCritical({ sinceTimestamp: NOW + 1 }, NOW)).toEqual(
      false,
    )

    expect(
      getCriticalStatus(
        { sinceTimestamp: NOW + 10, untilTimestamp: NOW + 100 },
        NOW,
      ),
    ).toEqual('scheduled')
  })

  it('computes the delay until the next critical window transition', () => {
    const nowMs = NOW * 1000
    expect(
      getNextCriticalTransitionDelayMs(
        [
          undefined,
          true,
          { sinceTimestamp: NOW - 10, untilTimestamp: NOW - 1 },
        ],
        nowMs,
      ),
    ).toEqual(undefined)

    expect(
      getNextCriticalTransitionDelayMs([{ untilTimestamp: NOW }], nowMs),
    ).toEqual(1000)

    expect(
      getNextCriticalTransitionDelayMs([{ sinceTimestamp: NOW + 0.5 }], nowMs),
    ).toEqual(1000)

    expect(
      getNextCriticalTransitionDelayMs([{ untilTimestamp: NOW + 0.5 }], nowMs),
    ).toEqual(1000)

    expect(
      getNextCriticalTransitionDelayMs(
        [{ sinceTimestamp: NOW + 50 }, { untilTimestamp: NOW + 20 }],
        nowMs,
      ),
    ).toEqual(21_000)

    expect(
      getNextCriticalTransitionDelayMs(
        [{ untilTimestamp: NOW + 60 * 60 * 24 * 60 }],
        nowMs,
      ),
    ).toEqual(MAX_CRITICAL_TIMEOUT_MS)
  })

  it('formats unix seconds as UTC YYYY-MM-DD', () => {
    expect(formatCriticalDate(1_700_000_000)).toEqual('2023-11-14')
  })
})
