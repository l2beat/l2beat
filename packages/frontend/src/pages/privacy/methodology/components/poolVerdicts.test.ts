import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { expect } from 'earl'
import type { Lens, PoolDesign } from './poolLensScene'
import { getPoolVerdicts } from './poolVerdicts'

const PRIVATE: PoolDesign = {
  linksDeposit: false,
  traffic: 1,
  publicRpc: false,
  viewingKeys: false,
  ellipticCurves: false,
}

function sentiments(design: Partial<PoolDesign>, caughtShare = 0) {
  const verdicts = getPoolVerdicts({ ...PRIVATE, ...design }, caughtShare)
  return Object.fromEntries(
    Object.entries(verdicts).map(([lens, v]) => [lens, v.sentiment]),
  )
}

describe(getPoolVerdicts.name, () => {
  it('rates every adversary good for a private pool', () => {
    expect(sentiments({})).toEqual({
      publicObserver: 'good',
      chainAnalyst: 'good',
      networkObserver: 'good',
      privilegedInsider: 'good',
      futureAdversary: 'good',
    })
  })

  const flags: [keyof PoolDesign, Lens[]][] = [
    ['linksDeposit', ['publicObserver', 'chainAnalyst', 'futureAdversary']],
    ['publicRpc', ['networkObserver']],
    ['viewingKeys', ['privilegedInsider']],
    ['ellipticCurves', ['futureAdversary']],
  ]
  for (const [flag, bad] of flags) {
    it(`${flag} makes ${bad.join(', ')} bad and nobody else`, () => {
      const result = sentiments({ [flag]: true })
      for (const [lens, sentiment] of Object.entries(result)) {
        expect(sentiment).toEqual(bad.includes(lens as Lens) ? 'bad' : 'good')
      }
    })
  }

  describe('timing', () => {
    const cases: [number, PrivacyAdversarySentiment][] = [
      [0, 'good'],
      [0.0099, 'good'],
      [0.01, 'warning'],
      [0.2499, 'warning'],
      [0.25, 'bad'],
      [1, 'bad'],
    ]
    for (const [caughtShare, expected] of cases) {
      it(`rates the chain analyst ${expected} when ${caughtShare} of withdrawals are caught`, () => {
        expect(sentiments({}, caughtShare).chainAnalyst).toEqual(expected)
      })
    }
  })

  describe('a stronger adversary is never better than a weaker one', () => {
    it('the chain analyst inherits a linkable deposit from the public observer', () => {
      const { chainAnalyst } = getPoolVerdicts(
        { ...PRIVATE, linksDeposit: true },
        0,
      )
      expect(chainAnalyst.sentiment).toEqual('bad')
      expect(chainAnalyst.inheritedFrom).toEqual('publicObserver')
    })

    it('the future adversary inherits timing leaks from the chain analyst', () => {
      const { futureAdversary } = getPoolVerdicts(PRIVATE, 0.1)
      expect(futureAdversary.sentiment).toEqual('warning')
      expect(futureAdversary.inheritedFrom).toEqual('chainAnalyst')
    })

    it('keeps its own verdict when that is at least as bad', () => {
      const { chainAnalyst, futureAdversary } = getPoolVerdicts(
        { ...PRIVATE, linksDeposit: true, ellipticCurves: true },
        0.5,
      )
      expect(chainAnalyst.inheritedFrom).toEqual(undefined)
      expect(futureAdversary.inheritedFrom).toEqual(undefined)
    })
  })
})
