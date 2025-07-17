import { expect } from 'earl'

import { decodeHandlerResults } from './decodeHandlerResults'

describe(decodeHandlerResults.name, () => {
  const longChain = 'ethereum'
  const emptyFieldOverrides = {}
  const emptyTypes = {}
  it('returns empty values and errors', () => {
    expect(
      decodeHandlerResults(longChain, [], emptyFieldOverrides, emptyTypes),
    ).toEqual({
      values: {},
      errors: {},
      usedTypes: [],
    })
  })

  it('returns values and errors', () => {
    expect(
      decodeHandlerResults(
        longChain,
        [
          { field: 'a', value: 1 },
          { field: 'b', value: 2 },
          { field: 'c', value: 3 },
          { field: 'd', error: 'Error 1' },
          { field: 'e', error: 'Error 2' },
        ],
        emptyFieldOverrides,
        emptyTypes,
      ),
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
      decodeHandlerResults(
        longChain,
        [
          { field: 'd', error: 'Error 1' },
          { field: 'e', error: 'Error 2' },
        ],
        emptyFieldOverrides,
        emptyTypes,
      ),
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
      decodeHandlerResults(
        longChain,
        [
          { field: 'a', value: 1 },
          { field: 'b', value: 2 },
          { field: 'c', value: 3 },
        ],
        emptyFieldOverrides,
        emptyTypes,
      ),
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
