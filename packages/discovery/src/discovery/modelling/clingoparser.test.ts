import { expect } from 'earl'
import { parseClingoFact } from './clingoparser.js'

describe(parseClingoFact.name, () => {
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
