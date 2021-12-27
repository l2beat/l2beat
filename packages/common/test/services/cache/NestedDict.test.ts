import { expect } from 'chai'
import { NestedDict } from '../../../src'

describe('NestedDict', () => {
  it('returns value when present', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.get('a', 'b')).to.equal(123)
  })

  it('returns undefined for known module unknown key', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.get('a', 'c')).to.equal(undefined)
  })

  it('returns undefined for unknown module', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.get('c', 'd')).to.equal(undefined)
  })

  it('can tell if keys are present', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    expect(dict.has('a', 'b')).to.equal(true)
    expect(dict.has('a', 'c')).to.equal(false)
    expect(dict.has('d', 'e')).to.equal(false)
    expect(dict.has('a', 'toString')).to.equal(false)
  })

  it('has correct data', () => {
    const dict = new NestedDict({})
    dict.set('a', 'b', 123)
    dict.set('a', 'c', 456)
    dict.set('b', 'd', true)
    expect(dict.data).to.deep.equal({
      a: {
        b: 123,
        c: 456,
      },
      b: {
        d: true,
      },
    })
  })
})
