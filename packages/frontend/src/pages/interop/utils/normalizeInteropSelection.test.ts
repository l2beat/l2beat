import { expect } from 'earl'
import { normalizeInteropSelection } from './normalizeInteropSelection'

const CHAINS = ['ethereum', 'arbitrum', 'base']

describe(normalizeInteropSelection.name, () => {
  it('filters unknown ids and dedupes by chain order', () => {
    const result = normalizeInteropSelection(
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
