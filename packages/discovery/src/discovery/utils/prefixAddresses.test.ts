import { expect } from 'earl'
import { prefixAddresses } from './prefixAddresses'

describe(prefixAddresses.name, () => {
  const CHAIN = 'ethereum'

  it('does nothing to primitives', () => {
    expect(prefixAddresses(CHAIN, 'foo')).toEqual('foo')
    expect(prefixAddresses(CHAIN, 1)).toEqual(1)
    expect(prefixAddresses(CHAIN, 0)).toEqual(0)
    expect(prefixAddresses(CHAIN, -0)).toEqual(-0)
    expect(prefixAddresses(CHAIN, -1)).toEqual(-1)
    expect(prefixAddresses(CHAIN, false)).toEqual(false)
    expect(prefixAddresses(CHAIN, true)).toEqual(true)
  })

  it('does nothing to arrays with primitives', () => {
    const arr = ['foo', 1, 0, -0, -1, false, true]
    expect(prefixAddresses(CHAIN, arr)).toEqual(arr)
  })

  it('does nothing to objects with primitives', () => {
    const obj = { k1: 'foo', k2: 1, k3: 0, k4: -0, k5: -1, k6: false, k7: true }
    expect(prefixAddresses(CHAIN, obj)).toEqual(obj)
  })

  it('prefixes a string address', () => {
    const address = '0x33D66941465ac776C38096cb1bc496C673aE7390'
    expect(prefixAddresses(CHAIN, address)).toEqual(
      'eth:0x33D66941465ac776C38096cb1bc496C673aE7390',
    )
  })

  it('fixes wrong checksum in address', () => {
    const addresses = [
      '0x33d66941465ac776c38096cb1bc496c673ae7390',
      '0x33D66941465AC776C38096CB1BC496C673ae7390',
      '0x33D66941465AC776C38096CB1BC496C673AE7390',
    ]

    for (const address of addresses) {
      expect(prefixAddresses(CHAIN, address)).toEqual(
        'eth:0x33D66941465ac776C38096cb1bc496C673aE7390',
      )
    }
  })

  it('prefixes array of addresses', () => {
    const addresses = [
      '0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956',
      '0x33D66941465ac776C38096cb1bc496C673aE7390',
    ]

    expect(prefixAddresses(CHAIN, addresses)).toEqual([
      'eth:0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956',
      'eth:0x33D66941465ac776C38096cb1bc496C673aE7390',
    ])
  })

  it('prefixes only addresses in array', () => {
    const addresses = [
      '0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956',
      1,
      '0x33D66941465ac776C38096cb1bc496C673aE7390',
      'foo',
    ]

    expect(prefixAddresses(CHAIN, addresses)).toEqual([
      'eth:0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956',
      1,
      'eth:0x33D66941465ac776C38096cb1bc496C673aE7390',
      'foo',
    ])
  })

  it('prefixes addresses in objects values and keys', () => {
    const obj = {
      '0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956':
        '0x33D66941465ac776C38096cb1bc496C673aE7390',
    }

    expect(prefixAddresses(CHAIN, obj)).toEqual({
      'eth:0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956':
        'eth:0x33D66941465ac776C38096cb1bc496C673aE7390',
    })
  })

  it('prefixes addresses in objects values and keys', () => {
    const obj = {
      k1: 123,
      k2: 'foo',
      k3: '0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956',
      k4: '0x33D66941465ac776C38096cb1bc496C673aE7390',
    }

    expect(prefixAddresses(CHAIN, obj)).toEqual({
      k1: 123,
      k2: 'foo',
      k3: 'eth:0x07D5c2f0eC7f791F1BB0760C7BaC21Eef10a0956',
      k4: 'eth:0x33D66941465ac776C38096cb1bc496C673aE7390',
    })
  })
})
