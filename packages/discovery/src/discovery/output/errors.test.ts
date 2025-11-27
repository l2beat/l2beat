import { expect } from 'earl'
import { neuterErrors } from './errors.js'

describe(neuterErrors.name, () => {
  it('multiple entries', () => {
    const entry = {
      foo: 'This is an error with API KEY b4f6db3fb96',
      bar: 'This is an error with API KEY 72b179c8c33',
      baz: 'This is an error with API KEY 26fd710b28d',
    }

    expect(neuterErrors(entry)).toEqual({
      foo: 'Processing error occurred.',
      bar: 'Processing error occurred.',
      baz: 'Processing error occurred.',
    })
  })

  it('single entry', () => {
    const entry = { key: 'This is an error' }
    expect(neuterErrors(entry)).toEqual({ key: 'Processing error occurred.' })
  })

  it('empty returns empty', () => {
    expect(neuterErrors({})).toEqual({})
  })
})
