import { expect } from 'earl'
import { parseHolderInput } from './parseHolderInput'

describe(parseHolderInput.name, () => {
  it('lowercases a checksummed address and trims whitespace', () => {
    expect(
      parseHolderInput(' 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\n'),
    ).toEqual({
      kind: 'address',
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    })
  })

  it('accepts an uppercase 0X prefix', () => {
    expect(parseHolderInput(`0X${'A'.repeat(40)}`)).toEqual({
      kind: 'address',
      address: `0x${'a'.repeat(40)}`,
    })
  })

  it('keeps a dotted name as typed, for ENS normalization to judge', () => {
    expect(parseHolderInput(' Vitalik.eth ')).toEqual({
      kind: 'name',
      name: 'Vitalik.eth',
    })
    expect(parseHolderInput('pay.vitalik.eth')).toEqual({
      kind: 'name',
      name: 'pay.vitalik.eth',
    })
  })

  it('rejects a malformed address instead of reading it as a name', () => {
    expect(parseHolderInput(`0x${'a'.repeat(39)}`)).toEqual(undefined)
    expect(parseHolderInput(`0x${'a'.repeat(41)}`)).toEqual(undefined)
    expect(parseHolderInput(`0x${'g'.repeat(40)}`)).toEqual(undefined)
  })

  it('rejects what is not shaped like a name', () => {
    expect(parseHolderInput('vitalik')).toEqual(undefined)
    expect(parseHolderInput('.eth')).toEqual(undefined)
    expect(parseHolderInput('vitalik..eth')).toEqual(undefined)
    expect(parseHolderInput('vitalik.eth/x')).toEqual(undefined)
    expect(parseHolderInput('a b.eth')).toEqual(undefined)
    expect(parseHolderInput(`${'a'.repeat(252)}.eth`)).toEqual(undefined)
  })
})
