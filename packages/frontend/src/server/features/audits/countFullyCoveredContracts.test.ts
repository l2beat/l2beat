import { expect } from 'earl'
import {
  countFullyCoveredContracts,
  fullyCoveredShare,
} from './countFullyCoveredContracts'

describe(countFullyCoveredContracts.name, () => {
  function contract(
    units: Partial<
      Record<'identical' | 'library' | 'differs' | 'unaudited', number>
    >,
    noSource = false,
  ) {
    return {
      noSource,
      summary: {
        contracts: 1,
        contractsWithoutSource: noSource ? 1 : 0,
        units: {
          identical: 0,
          library: 0,
          differs: 0,
          unaudited: 0,
          ...units,
        },
        uniqueUnits: { identical: 0, library: 0, differs: 0, unaudited: 0 },
        lines: { total: 0, covered: 0, uncovered: 0 },
      },
    }
  }

  it('counts contracts whose units are all identical or library', () => {
    expect(
      countFullyCoveredContracts([
        contract({ identical: 2, library: 3 }),
        contract({ library: 1 }),
      ]),
    ).toEqual(2)
  })

  it('rejects a single differing or unaudited unit', () => {
    expect(
      countFullyCoveredContracts([
        contract({ identical: 9, differs: 1 }),
        contract({ identical: 9, unaudited: 1 }),
      ]),
    ).toEqual(0)
  })

  it('rejects contracts without source or without units', () => {
    expect(
      countFullyCoveredContracts([contract({}, true), contract({})]),
    ).toEqual(0)
  })
})

describe(fullyCoveredShare.name, () => {
  it('divides by every contract, including unverified ones', () => {
    expect(
      fullyCoveredShare({ fullyCoveredContracts: 1, contracts: 4 }),
    ).toEqual(0.25)
  })

  it('is zero without contracts', () => {
    expect(
      fullyCoveredShare({ fullyCoveredContracts: 0, contracts: 0 }),
    ).toEqual(0)
  })
})
