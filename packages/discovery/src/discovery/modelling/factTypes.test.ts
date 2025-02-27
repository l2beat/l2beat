import { expect } from 'earl'
import { parseClingoFact } from './clingoparser'
import { parseExportedFacts } from './factTypes'

describe(parseExportedFacts.name, () => {
  it('should parse exported facts', () => {
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
    const asObject = { facts: [parseClingoFact(clingoFact)] }
    const asJson = JSON.stringify(asObject, null, 2)
    const facts = parseExportedFacts(asJson)
    expect(facts).toEqual({
      facts: [
        {
          atom: 'complexFact',
          params: [
            'thisIs_simple_Atom_0x123abc',
            'this is a string with closing bracket )',
            'this is a string with escaped quote "',
            {
              atom: 'nestedFact',
              params: ['a', 'b', 123],
            },
            -12.345,
            null,
            ['a', 'b'],
            [
              {
                atom: 'pair',
                params: ['a', 'b'],
              },
              {
                atom: 'pair',
                params: ['c', 'd'],
              },
              'e',
            ],
          ],
        },
      ],
    })
  })
})
