import { expect } from 'earl'
import { countPendingItems, stripPendingItems } from './pendingItems'

describe(stripPendingItems.name, () => {
  it('removes pending items inside keyed objects, keeping pending: false', () => {
    const values = {
      leads: {
        a: { status: 'handled' },
        b: { status: 'open', pending: true },
        nested: { c: { pending: true }, d: { pending: false } },
      },
    }
    expect(stripPendingItems(values)).toEqual({
      leads: {
        a: { status: 'handled' },
        nested: { d: { pending: false } },
      },
    })
  })

  it('does not mutate its input', () => {
    const values = { leads: { b: { pending: true } } }
    stripPendingItems(values)
    expect(values).toEqual({ leads: { b: { pending: true } } })
  })

  it('rejects a watch value that is itself pending', () => {
    expect(() => stripPendingItems({ open: { pending: true } })).toThrow(
      'Watch value is a pending item',
    )
    expect(() => countPendingItems({ open: { pending: true } })).toThrow(
      'Watch value is a pending item',
    )
  })

  it('rejects a pending item inside an array', () => {
    expect(() => stripPendingItems({ list: [{ pending: true }] })).toThrow(
      'Pending item inside an array',
    )
  })
})

describe(countPendingItems.name, () => {
  it('counts pending items at every level', () => {
    const values = {
      leads: {
        a: { status: 'handled' },
        b: { pending: true },
        nested: { c: { pending: true }, d: { pending: false } },
      },
    }
    expect(countPendingItems(values)).toEqual(2)
    expect(countPendingItems(stripPendingItems(values))).toEqual(0)
  })
})
