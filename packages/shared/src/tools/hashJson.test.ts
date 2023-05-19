import { expect } from 'earl'

import { hashJson } from './hashJson'

describe(hashJson.name, () => {
  it('returns same hash for similar objects', () => {
    const hashA = hashJson({ foo: 1, bar: 2 })
    const hashB = hashJson({ foo: 1, bar: 2 })
    expect(hashA).toEqual(hashB)
  })

  it('returns different hash for different objects', () => {
    const hashA = hashJson({ foo: 1, bar: 2 })
    const hashB = hashJson({ foo: 123 })
    expect(hashA).not.toEqual(hashB)
  })

  it('key order matters', () => {
    const hashA = hashJson({ foo: 1, bar: 2 })
    const hashB = hashJson({ bar: 2, foo: 1 })
    expect(hashA).not.toEqual(hashB)
  })
})
