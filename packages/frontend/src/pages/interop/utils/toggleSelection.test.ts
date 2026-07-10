import { expect } from 'earl'
import { toggleSelection } from './toggleSelection'

const ALL_IDS = ['ethereum', 'arbitrum', 'base']

describe(toggleSelection.name, () => {
  it('removes a selected id', () => {
    expect(toggleSelection(ALL_IDS, 'arbitrum', ALL_IDS)).toEqual([
      'ethereum',
      'base',
    ])
  })

  it('adds an id in canonical order', () => {
    expect(toggleSelection(['base'], 'ethereum', ALL_IDS)).toEqual([
      'ethereum',
      'base',
    ])
  })
})
