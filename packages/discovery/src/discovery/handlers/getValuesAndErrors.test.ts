import { expect } from 'earl'

import { getValuesAndErrors } from './getValuesAndErrors'

describe(getValuesAndErrors.name, () => {
  it('returns empty values and errors', () => {
    expect(getValuesAndErrors([])).toEqual({
      values: {},
      errors: {},
    })
  })

  it('returns values and errors', () => {
    expect(
      getValuesAndErrors([
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
    })
  })

  it('returns only errors', () => {
    expect(
      getValuesAndErrors([
        { field: 'd', error: 'Error 1' },
        { field: 'e', error: 'Error 2' },
      ]),
    ).toEqual({
      values: {},
      errors: {
        d: 'Error 1',
        e: 'Error 2',
      },
    })
  })

  it('returns only values', () => {
    expect(
      getValuesAndErrors([
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
    })
  })
})
