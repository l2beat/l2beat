import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectOssificationContract } from '../types'
import { mergeOssificationInputs } from './mergeOssificationInputs'
import type { OssificationInput } from './OssificationInput'

const NOW = UnixTime(1_800_000_000)
const ADDRESS_A = 'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f'
const ADDRESS_B = 'eth:0x059dAF31F571da48Ab4e74Ae12F64f907681Cd8b'

function contract(address: string): ProjectOssificationContract {
  return {
    name: address,
    address,
    isVerified: true,
    ossifyingSince: 100,
    codeChangeCount: 0,
    stateChangeCount: 0,
  }
}

function input(
  address: string,
  overrides: Partial<OssificationInput> = {},
): OssificationInput {
  return {
    now: NOW,
    contracts: [contract(address)],
    changes: [],
    resets: [],
    observedSince: 100,
    ...overrides,
  }
}

describe(mergeOssificationInputs.name, () => {
  it('joins the tables and observes from the earliest start', () => {
    const merged = mergeOssificationInputs([
      input(ADDRESS_A, {
        changes: [{ timestamp: 300, type: 'code' }],
        resets: [200],
        observedSince: 200,
      }),
      input(ADDRESS_B, {
        changes: [{ timestamp: 250, type: 'state', updateId: 'u1' }],
        resets: [150],
        observedSince: 150,
      }),
    ])
    expect(merged).toEqual({
      now: NOW,
      contracts: [contract(ADDRESS_A), contract(ADDRESS_B)],
      changes: [
        { timestamp: 300, type: 'code' },
        { timestamp: 250, type: 'state', updateId: 'u1' },
      ],
      resets: [200, 150],
      observedSince: 150,
    })
  })

  it('is nothing without a live contract', () => {
    expect(mergeOssificationInputs([])).toEqual(undefined)
    expect(
      mergeOssificationInputs([input(ADDRESS_A, { contracts: [] })]),
    ).toEqual(undefined)
  })

  it('keeps the history of a perimeter whose contracts all retired', () => {
    const merged = mergeOssificationInputs([
      input(ADDRESS_A),
      input(ADDRESS_B, {
        contracts: [],
        changes: [{ timestamp: 50, type: 'code' }],
        resets: [40],
        observedSince: 40,
      }),
    ])
    expect(merged?.contracts).toEqual([contract(ADDRESS_A)])
    expect(merged?.changes).toEqual([{ timestamp: 50, type: 'code' }])
    expect(merged?.resets).toEqual([40])
    expect(merged?.observedSince).toEqual(40)
  })

  it('keeps one row of a contract two perimeters share', () => {
    const merged = mergeOssificationInputs([input(ADDRESS_A), input(ADDRESS_A)])
    expect(merged?.contracts).toEqual([contract(ADDRESS_A)])
  })

  it('refuses a shared contract whose rows differ', () => {
    expect(() =>
      mergeOssificationInputs([
        input(ADDRESS_A),
        input(ADDRESS_A, {
          contracts: [{ ...contract(ADDRESS_A), ossifyingSince: 200 }],
        }),
      ]),
    ).toThrow('differs between the discoveries')
  })
})
