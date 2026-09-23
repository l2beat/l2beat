import { formatCurrency } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { trimTrailingZeros } from './trimTrailingZeros'

describe(trimTrailingZeros.name, () => {
  const HAIR_SPACE = ' '
  const testCases = [
    { label: formatCurrency(0, 'usd'), expected: '$0' },
    { label: formatCurrency(100, 'usd'), expected: '$100' },
    { label: formatCurrency(4_500, 'usd'), expected: `$4.5${HAIR_SPACE}K` },
    { label: formatCurrency(12e9, 'usd'), expected: `$12${HAIR_SPACE}B` },
    {
      label: formatCurrency(1_050_000, 'usd'),
      expected: `$1.05${HAIR_SPACE}M`,
    },
    { label: formatCurrency(0.05, 'eth'), expected: 'Ξ0.05' },
    { label: formatCurrency(-1_500, 'usd'), expected: `-$1.5${HAIR_SPACE}K` },
    { label: '2.00 GiB', expected: '2 GiB' },
    { label: '1.50x', expected: '1.5x' },
    { label: '10 days', expected: '10 days' },
  ]

  for (const { label, expected } of testCases) {
    it(`trims ${JSON.stringify(label)} to ${JSON.stringify(expected)}`, () => {
      expect(trimTrailingZeros(label)).toEqual(expected)
    })
  }
})
