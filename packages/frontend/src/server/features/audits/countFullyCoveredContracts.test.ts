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
      coverage: {
        units: {
          identical: 0,
          library: 0,
          differs: 0,
          unaudited: 0,
          ...units,
        },
        lines: { total: 0, covered: 0, uncovered: 0 },
      },
    }
  }

  it('counts contracts whose every unit is identical or a library', () => {
    expect(
      countFullyCoveredContracts([
        contract({ identical: 3 }),
        contract({ identical: 1, library: 2 }),
        contract({ library: 1 }),
      ]),
    ).toEqual(3)
  })

  it('rejects contracts with a differing or unaudited unit', () => {
    expect(
      countFullyCoveredContracts([
        contract({ identical: 3, differs: 1 }),
        contract({ identical: 3, unaudited: 1 }),
      ]),
    ).toEqual(0)
  })

  it('rejects contracts without source or without units', () => {
    expect(
      countFullyCoveredContracts([
        contract({}),
        contract({ identical: 1 }, true),
      ]),
    ).toEqual(0)
  })
})

describe(fullyCoveredShare.name, () => {
  it('divides by the contract count, 0 without contracts', () => {
    expect(
      fullyCoveredShare({ fullyCoveredContracts: 1, contracts: 4 }),
    ).toEqual(0.25)
    expect(
      fullyCoveredShare({ fullyCoveredContracts: 0, contracts: 0 }),
    ).toEqual(0)
  })
})
