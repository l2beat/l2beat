import type { OssificationContract, OssificationHistory } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mergeOssificationHistories } from './mergeOssificationHistories'

const ADDRESS_A = 'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f'
const ADDRESS_B = 'eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b'

function contract(address: string): OssificationContract {
  return {
    name: address,
    address: ChainSpecificAddress(address),
    isVerified: true,
    ossifyingSince: 100,
    codeChangeCount: 0,
    stateChangeCount: 0,
  }
}

function history(
  address: string,
  overrides: Partial<OssificationHistory> = {},
): OssificationHistory {
  return {
    contracts: [contract(address)],
    changes: [],
    arrivals: [],
    observedSince: 100,
    ...overrides,
  }
}

describe(mergeOssificationHistories.name, () => {
  it('joins the tables in time order and observes from the earliest start', () => {
    const younger = { ...contract(ADDRESS_B), ossifyingSince: 200 }
    const merged = mergeOssificationHistories([
      history(ADDRESS_A, {
        changes: [{ timestamp: 300, type: 'code' }],
        arrivals: [200],
        observedSince: 200,
      }),
      history(ADDRESS_B, {
        contracts: [younger],
        changes: [{ timestamp: 250, type: 'state', updateId: 'u1' }],
        arrivals: [150],
        observedSince: 150,
      }),
    ])
    expect(merged).toEqual({
      contracts: [younger, contract(ADDRESS_A)],
      changes: [
        { timestamp: 250, type: 'state', updateId: 'u1' },
        { timestamp: 300, type: 'code' },
      ],
      arrivals: [150, 200],
      observedSince: 150,
    })
  })

  it('is nothing without a live contract', () => {
    expect(mergeOssificationHistories([])).toEqual(undefined)
    expect(
      mergeOssificationHistories([history(ADDRESS_A, { contracts: [] })]),
    ).toEqual(undefined)
  })

  it('keeps the history of a perimeter whose contracts all retired', () => {
    const merged = mergeOssificationHistories([
      history(ADDRESS_A),
      history(ADDRESS_B, {
        contracts: [],
        changes: [{ timestamp: 50, type: 'code' }],
        arrivals: [40],
        observedSince: 40,
      }),
    ])
    expect(merged?.contracts).toEqual([contract(ADDRESS_A)])
    expect(merged?.changes).toEqual([{ timestamp: 50, type: 'code' }])
    expect(merged?.arrivals).toEqual([40])
    expect(merged?.observedSince).toEqual(40)
  })

  it('keeps one row of a contract two perimeters share', () => {
    const merged = mergeOssificationHistories([
      history(ADDRESS_A),
      history(ADDRESS_A),
    ])
    expect(merged?.contracts).toEqual([contract(ADDRESS_A)])
  })

  it('refuses a shared contract whose rows differ', () => {
    expect(() =>
      mergeOssificationHistories([
        history(ADDRESS_A),
        history(ADDRESS_A, {
          contracts: [{ ...contract(ADDRESS_A), ossifyingSince: 200 }],
        }),
      ]),
    ).toThrow('differs between the discoveries')
  })
})
