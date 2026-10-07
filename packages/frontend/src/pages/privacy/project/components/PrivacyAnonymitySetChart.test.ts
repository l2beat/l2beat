import { expect } from 'earl'
import { sortAnonymitySetTooltipEntries } from './PrivacyAnonymitySetChart'

describe(sortAnonymitySetTooltipEntries.name, () => {
  it('sorts entries by the hovered value without mutating their source order', () => {
    const entries = [
      { label: 'zero-a', value: 0 },
      { label: 'largest', value: 1_090 },
      { label: 'tied-a', value: 5 },
      { label: 'second', value: 641 },
      { label: 'tied-b', value: 5 },
      { label: 'zero-b', value: 0 },
    ]

    const result = sortAnonymitySetTooltipEntries(entries)

    expect(result.map((entry) => entry.label)).toEqual([
      'largest',
      'second',
      'tied-a',
      'tied-b',
      'zero-a',
      'zero-b',
    ])
    expect(entries.map((entry) => entry.label)).toEqual([
      'zero-a',
      'largest',
      'tied-a',
      'second',
      'tied-b',
      'zero-b',
    ])
  })
})
