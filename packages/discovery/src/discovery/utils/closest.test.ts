import { expect } from 'earl'
import { closest } from './closest'

/**
 * Pins the ranking so hints in validator messages stay stable: distance
 * first, then alphabetical, duplicates collapsed, case ignored.
 */
describe(closest.name, () => {
  it('ranks by edit distance then name, ignoring case and duplicates', () => {
    expect(
      closest(['owner()', 'Owner()', 'paused()', 'registry()'], 'ownr()'),
    ).toEqual(['Owner()', 'owner()', 'paused()'])
    expect(closest(['a', 'a', 'b'], 'a', 5)).toEqual(['a', 'b'])
    expect(closest([], 'a')).toEqual([])
  })
})
