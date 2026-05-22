import { expect } from 'earl'
import { toJsonSafe } from './toJsonSafe'

describe(toJsonSafe.name, () => {
  it('serializes bigint values as decimal strings', () => {
    const result = toJsonSafe({
      amount: 123n,
      nested: [{ amount: 456n }],
    })

    expect(result).toEqual({
      amount: '123',
      nested: [{ amount: '456' }],
    })
    expect(() => JSON.stringify(result)).not.toThrow()
  })

  it('serializes Date values as ISO strings', () => {
    const result = toJsonSafe({
      date: new Date('2026-05-18T00:00:00Z'),
    })

    expect(result).toEqual({
      date: '2026-05-18T00:00:00.000Z',
    })
  })
})
