import { expect } from 'earl'
import { reconcileHiddenFields, reconcileNodeHiddenFields } from './storage'

describe(reconcileHiddenFields.name, () => {
  it('keeps entries that exist on the node', () => {
    const result = reconcileHiddenFields(['a', 'b', 'c'], ['a', 'c'])
    expect(result).toEqual(['a', 'c'])
  })

  it('drops stale entries no longer on the node', () => {
    const result = reconcileHiddenFields(['a', 'b'], ['a', 'removed', 'b'])
    expect(result).toEqual(['a', 'b'])
  })

  it('dedupes duplicates', () => {
    const result = reconcileHiddenFields(['a', 'b'], ['a', 'a', 'b', 'a'])
    expect(result).toEqual(['a', 'b'])
  })

  it('returns empty when no entries match', () => {
    const result = reconcileHiddenFields(['a', 'b'], ['x', 'y'])
    expect(result).toEqual([])
  })

  it('returns empty for empty hidden input', () => {
    const result = reconcileHiddenFields(['a', 'b'], [])
    expect(result).toEqual([])
  })

  it('returns empty when node has no fields', () => {
    const result = reconcileHiddenFields([], ['a', 'b'])
    expect(result).toEqual([])
  })
})

describe(reconcileNodeHiddenFields.name, () => {
  it('migrates legacy group labels to stable field identities', () => {
    const fields = [
      { name: 'group-field:first', label: 'member' },
      { name: 'group-field:second', label: 'member' },
    ]

    const result = reconcileNodeHiddenFields(fields, ['member'])

    expect(result).toEqual(['group-field:first', 'group-field:second'])
  })

  it('preserves stable field identities', () => {
    const fields = [{ name: 'group-field:first', label: 'member' }]

    const result = reconcileNodeHiddenFields(fields, ['group-field:first'])

    expect(result).toEqual(['group-field:first'])
  })
})
