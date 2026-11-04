import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { measureOssificationBand } from './measureOssificationBand'
import type { OssificationHistory } from './types'

describe(measureOssificationBand.name, () => {
  const now = UnixTime(1_800_000_000)
  const unchangedFor = (days: number, isVerified = true) =>
    history(now - days * UnixTime.DAY, isVerified)

  it('reads the band from the score', () => {
    // Scores 86 two years after the last change, 66 after four months and 30
    // after a week.
    expect(measureOssificationBand(unchangedFor(730), now)).toEqual('good')
    expect(measureOssificationBand(unchangedFor(120), now)).toEqual('warning')
    expect(measureOssificationBand(unchangedFor(7), now)).toEqual('bad')
  })

  it('is unscored without a history', () => {
    expect(measureOssificationBand(undefined, now)).toEqual('unscored')
  })

  it('is unscored while a critical contract is unverified', () => {
    expect(measureOssificationBand(unchangedFor(730, false), now)).toEqual(
      'unscored',
    )
  })
})

function history(since: number, isVerified: boolean): OssificationHistory {
  return {
    contracts: [
      {
        name: 'Core',
        address: ChainSpecificAddress(
          'eth:0x1F98431c8aD98523631AE4a59f267346ea31F984',
        ),
        isVerified,
        ossifyingSince: since,
        codeChangeCount: 0,
        stateChangeCount: 0,
      },
    ],
    changes: [],
    deployments: [since],
    observedSince: since,
  }
}
