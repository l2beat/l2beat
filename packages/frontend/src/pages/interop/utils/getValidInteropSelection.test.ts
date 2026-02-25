import { expect } from 'earl'
import { getValidInteropSelection } from './getValidInteropSelection'

const CHAINS = ['ethereum', 'arbitrum', 'base']

describe(getValidInteropSelection.name, () => {
  it('filters unknown ids and dedupes by chain order', () => {
    const result = getValidInteropSelection(
      {
        from: ['base', 'ethereum', 'base', 'unknown'],
        to: ['arbitrum', '', 'arbitrum', 'unknown'],
      },
      CHAINS,
    )

    expect(result).toEqual({
      from: ['ethereum', 'base'],
      to: ['arbitrum'],
    })
  })
})
