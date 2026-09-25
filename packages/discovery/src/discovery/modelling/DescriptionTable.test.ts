import { expect } from 'earl'
import { DescriptionTable } from './DescriptionTable'

describe(DescriptionTable.name, () => {
  it('resolves an interned id back to its text', () => {
    const table = new DescriptionTable()
    const id = table.intern('upgrade the bridge')

    expect(table.resolve(id)).toEqual('upgrade the bridge')
  })

  it('gives the same id for the same text in any table', () => {
    const a = new DescriptionTable().intern('pause the bridge')
    const b = new DescriptionTable().intern('pause the bridge')
    const other = new DescriptionTable().intern('unpause the bridge')

    expect(a).toEqual(b)
    expect(a).not.toEqual(other)
  })

  it('emits a clingo atom', () => {
    const id = new DescriptionTable().intern('Set fees. "Quoted", 100%')

    const identifierChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
    expect(id.startsWith('d_')).toEqual(true)
    expect(id.length).toEqual(10)
    for (const char of id) {
      expect(identifierChars.includes(char)).toEqual(true)
    }
  })

  it('throws on an unknown id', () => {
    expect(() => new DescriptionTable().resolve('d_AAAAAAAA')).toThrow(
      'Unknown description id d_AAAAAAAA',
    )
  })
})
