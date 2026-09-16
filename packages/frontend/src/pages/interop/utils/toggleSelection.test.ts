import { describe, expect, it } from 'vitest'
import { toggleSelection } from './toggleSelection'

const ALL_IDS = ['ethereum', 'arbitrum', 'base']

describe(toggleSelection.name, () => {
  it('removes a selected id', () => {
    expect(toggleSelection(ALL_IDS, 'arbitrum', ALL_IDS)).toStrictEqual([
      'ethereum',
      'base',
    ])
  })

  it('adds an id in canonical order', () => {
    expect(toggleSelection(['base'], 'ethereum', ALL_IDS)).toStrictEqual([
      'ethereum',
      'base',
    ])
  })
})
