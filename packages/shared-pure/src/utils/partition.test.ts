import { expect } from 'earl'
import { partition } from './partition.js'

describe(partition.name, () => {
  it('splits items into pass and fail by predicate', () => {
    const [pass, fail] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)
    expect(pass).toEqual([2, 4])
    expect(fail).toEqual([1, 3, 5])
  })

  it('returns two empty arrays for an empty input', () => {
    const [pass, fail] = partition<number>([], () => true)
    expect(pass).toEqual([])
    expect(fail).toEqual([])
  })

  it('returns all items in pass when predicate is always true', () => {
    const [pass, fail] = partition([1, 2, 3], () => true)
    expect(pass).toEqual([1, 2, 3])
    expect(fail).toEqual([])
  })

  it('returns all items in fail when predicate is always false', () => {
    const [pass, fail] = partition([1, 2, 3], () => false)
    expect(pass).toEqual([])
    expect(fail).toEqual([1, 2, 3])
  })

  it('preserves the original order in both partitions', () => {
    const [pass, fail] = partition(['a1', 'b2', 'a3', 'b4', 'a5'], (s) =>
      s.startsWith('a'),
    )
    expect(pass).toEqual(['a1', 'a3', 'a5'])
    expect(fail).toEqual(['b2', 'b4'])
  })

  it('works with object items', () => {
    const items = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true },
    ]
    const [pass, fail] = partition(items, (item) => item.active)
    expect(pass).toEqual([
      { id: 1, active: true },
      { id: 3, active: true },
    ])
    expect(fail).toEqual([{ id: 2, active: false }])
  })

  it('does not mutate the input array', () => {
    const input = [1, 2, 3, 4]
    const snapshot = [...input]
    partition(input, (n) => n > 2)
    expect(input).toEqual(snapshot)
  })

  it('calls the predicate once per item', () => {
    let calls = 0
    partition([10, 20, 30, 40], (n) => {
      calls++
      return n > 15
    })
    expect(calls).toEqual(4)
  })
})
