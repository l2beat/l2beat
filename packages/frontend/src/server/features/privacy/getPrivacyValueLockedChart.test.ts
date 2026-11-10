import type { TvsToken } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getCurrentChainValue,
  hasPrivacyValueLocked,
} from './getPrivacyValueLockedChart'

const NOW = UnixTime(1_800_000_000)
const OLDEST_CURRENT = NOW - 3 * UnixTime.DAY

describe(getCurrentChainValue.name, () => {
  it('takes the newest row, against the one seven days before', () => {
    expect(
      getCurrentChainValue(
        [
          { timestamp: UnixTime(NOW - 7 * UnixTime.DAY), value: 100 },
          { timestamp: UnixTime(NOW - UnixTime.HOUR), value: 999 },
          { timestamp: NOW, value: 150 },
        ],
        OLDEST_CURRENT,
      ),
    ).toEqual({ value: 150, change7d: 0.5 })
  })

  it('has no value when the newest row is too old to be current', () => {
    expect(
      getCurrentChainValue(
        [{ timestamp: UnixTime(NOW - 4 * UnixTime.DAY), value: 100 }],
        OLDEST_CURRENT,
      ),
    ).toEqual(undefined)
  })
})

describe(hasPrivacyValueLocked.name, () => {
  const tvsConfig = [
    { amount: { type: 'balanceOfEscrow', chain: 'base' } },
    {
      amount: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          { type: 'balanceOfEscrow', chain: 'ethereum' },
          { type: 'balanceOfEscrow', chain: 'arbitrum' },
        ],
      },
    },
  ] as TvsToken[]

  it('follows the TVS config for the project as a whole', () => {
    expect(hasPrivacyValueLocked(tvsConfig, undefined)).toEqual(true)
    expect(hasPrivacyValueLocked(undefined, undefined)).toEqual(false)
  })

  it('takes a token that reads an amount on the chain', () => {
    expect(hasPrivacyValueLocked(tvsConfig, 'base')).toEqual(true)
    expect(hasPrivacyValueLocked(tvsConfig, 'arbitrum')).toEqual(true)
    expect(hasPrivacyValueLocked(tvsConfig, 'optimism')).toEqual(false)
    expect(hasPrivacyValueLocked(undefined, 'base')).toEqual(false)
  })
})
