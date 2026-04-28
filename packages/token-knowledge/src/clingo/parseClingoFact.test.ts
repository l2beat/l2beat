import { expect } from 'earl'
import { parseClingoFact } from './parseClingoFact'

describe(parseClingoFact.name, () => {
  it('parses a simple fact with atom params', () => {
    expect(parseClingoFact('transfer(ethereum,base,hop)')).toEqual({
      atom: 'transfer',
      params: ['ethereum', 'base', 'hop'],
    })
  })

  it('parses a fact with string params', () => {
    expect(parseClingoFact('token("0xA0b8","USDC")')).toEqual({
      atom: 'token',
      params: ['0xA0b8', 'USDC'],
    })
  })

  it('parses a fact with numeric params', () => {
    expect(parseClingoFact('amount(42,-3.14)')).toEqual({
      atom: 'amount',
      params: [42, -3.14],
    })
  })

  it('parses nested facts', () => {
    expect(parseClingoFact('outer(inner(a,b),c)')).toEqual({
      atom: 'outer',
      params: [{ atom: 'inner', params: ['a', 'b'] }, 'c'],
    })
  })

  it('throws on invalid input', () => {
    expect(() => parseClingoFact('123')).toThrow()
    expect(() => parseClingoFact('foo')).toThrow()
  })

  it('properly parses clingo facts, casting cons to arrays and nil to undefined', () => {
    const clingoFact = String.raw`
complexFact(
  thisIs_simple_Atom_0x123abc,
  "this is a string with closing bracket )",
  "this is a string with escaped quote \"",
  nestedFact(a, b, 123),
  -12.345,
  nil,
  cons(a, cons(b, nil)),
  cons(
    pair(a, b),
    cons(
      pair(c, d),
      cons(e, nil)
    )
  )
)
    `
    const parsed = parseClingoFact(clingoFact)
    expect(parsed).toEqual({
      atom: 'complexFact',
      params: [
        'thisIs_simple_Atom_0x123abc',
        'this is a string with closing bracket )',
        'this is a string with escaped quote "',
        { atom: 'nestedFact', params: ['a', 'b', 123] },
        -12.345,
        undefined,
        ['a', 'b'],
        [
          { atom: 'pair', params: ['a', 'b'] },
          { atom: 'pair', params: ['c', 'd'] },
          'e',
        ],
      ],
    })
  })

  it('fails on invalid facts', () => {
    // Invalid atom (with space in-between letters)
    expect(() => parseClingoFact('hello a( b, c)')).toThrow()

    // Invalid cons list (should only have two params, head and tail)
    expect(() => parseClingoFact('hello(cons(a, b, nil))')).toThrow()

    // We treat 'cons' as a keyword, so 'cons' is not a valid atom
    expect(() => parseClingoFact('hello(cons)')).toThrow()

    // We only accept facts, not atoms or params
    expect(() => parseClingoFact('123')).toThrow()
    expect(() => parseClingoFact('foo')).toThrow()
    expect(() => parseClingoFact('"bar"')).toThrow()
  })
})
