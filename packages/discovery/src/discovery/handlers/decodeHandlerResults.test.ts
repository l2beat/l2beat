import { expect } from 'earl'

import { decodeHandlerResults } from './decodeHandlerResults'

describe(decodeHandlerResults.name, () => {
  it('returns empty values and errors', () => {
    expect(decodeHandlerResults([])).toEqual({
      values: {},
      errors: {},
      usedTypes: [],
    })
  })

  it('returns values and errors', () => {
    expect(
      decodeHandlerResults([
        { field: 'a', value: 1 },
        { field: 'b', value: 2 },
        { field: 'c', value: 3 },
        { field: 'd', error: 'Error 1' },
        { field: 'e', error: 'Error 2' },
      ]),
    ).toEqual({
      values: {
        a: 1,
        b: 2,
        c: 3,
      },
      errors: {
        d: 'Error 1',
        e: 'Error 2',
      },
      usedTypes: [],
    })
  })

  it('returns only errors', () => {
    expect(
      decodeHandlerResults([
        { field: 'd', error: 'Error 1' },
        { field: 'e', error: 'Error 2' },
      ]),
    ).toEqual({
      values: {},
      errors: {
        d: 'Error 1',
        e: 'Error 2',
      },
      usedTypes: [],
    })
  })

  it('returns only values', () => {
    expect(
      decodeHandlerResults([
        { field: 'a', value: 1 },
        { field: 'b', value: 2 },
        { field: 'c', value: 3 },
      ]),
    ).toEqual({
      values: {
        a: 1,
        b: 2,
        c: 3,
      },
      errors: {},
      usedTypes: [],
    })
  })
})
