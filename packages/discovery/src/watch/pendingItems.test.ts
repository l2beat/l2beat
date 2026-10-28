import { expect } from 'earl'
import { countPendingItems, stripPendingItems } from './pendingItems'

describe(stripPendingItems.name, () => {
  it('removes pending items at the top level and inside keyed objects', () => {
    const values = {
      open: { pending: true },
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

  it('rejects a pending item inside an array', () => {
    expect(() => stripPendingItems({ list: [{ pending: true }] })).toThrow(
      'Pending item inside an array',
    )
  })
})

describe(countPendingItems.name, () => {
  it('counts pending items at every level', () => {
    const values = {
      open: { pending: true },
      leads: {
        a: { status: 'handled' },
        b: { pending: true },
        nested: { c: { pending: true }, d: { pending: false } },
      },
    }
    expect(countPendingItems(values)).toEqual(3)
    expect(countPendingItems(stripPendingItems(values))).toEqual(0)
  })
})
