import { expect } from 'earl'

import { Hash256 } from '../types'
import { hashJson } from './hashJson'

describe(hashJson.name, () => {
  it('returns a known hash', () => {
    const hash = hashJson({ x: 'foo', y: 'bar' })
    expect(hash).toEqual(
      Hash256(
        '0x4f38d2bd43161918292b972fb077c7915193a5aa62fda799aa2cf5aa1f4fabf0',
      ),
    )
  })

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
