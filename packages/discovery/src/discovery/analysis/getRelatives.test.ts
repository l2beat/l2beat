import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getRelatives } from './getRelatives'

describe(getRelatives.name, () => {
  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const ADDRESS_D = EthereumAddress.random()
  const ADDRESS_E = EthereumAddress.random()

  it('returns addresses found in values', () => {
    const relatives = getRelatives([
      { field: 'a', value: ADDRESS_A.toString() },
      { field: 'b', value: [ADDRESS_B.toString(), ADDRESS_C.toString()] },
      {
        field: 'c',
        value: { d: ADDRESS_D.toString(), e: ADDRESS_E.toString() },
      },
    ])

    expect(relatives).toEqual([
      ADDRESS_A,
      ADDRESS_B,
      ADDRESS_C,
      ADDRESS_D,
      ADDRESS_E,
    ])
  })

  it('deduplicated addresses', () => {
    const relatives = getRelatives([
      { field: 'a', value: ADDRESS_A.toString() },
      { field: 'b', value: ADDRESS_A.toString() },
      { field: 'c', value: ADDRESS_B.toString() },
    ])

    expect(relatives).toEqual([ADDRESS_A, ADDRESS_B])
  })

  it('ignores fields with ignoreRelative', () => {
    const relatives = getRelatives([
      { field: 'a', value: ADDRESS_A.toString() },
      { field: 'b', value: ADDRESS_B.toString(), ignoreRelative: true },
      { field: 'c', value: ADDRESS_C.toString() },
    ])

    expect(relatives).toEqual([ADDRESS_A, ADDRESS_C])
  })

  it('ignores fields in the ignoreFields array', () => {
    const relatives = getRelatives(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: ADDRESS_B.toString() },
        { field: 'c', value: ADDRESS_C.toString() },
      ],
      ['b'],
    )

    expect(relatives).toEqual([ADDRESS_A, ADDRESS_C])
  })

  it('includes known relatives', () => {
    const relatives = getRelatives(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: ADDRESS_B.toString() },
      ],
      [],
      [ADDRESS_C],
    )

    expect(relatives).toEqual([ADDRESS_A, ADDRESS_B, ADDRESS_C])
  })

  it('ignores ignored addresses', () => {
    const relatives = getRelatives(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: ADDRESS_B.toString() },
        { field: 'c', value: ADDRESS_C.toString() },
      ],
      [],
      [],
      [ADDRESS_B],
    )

    expect(relatives).toEqual([ADDRESS_A, ADDRESS_C])
  })

  it('follows all rules at the same time', () => {
    const relatives = getRelatives(
      [
        { field: 'first', value: ADDRESS_A.toString() },
        { field: 'second', value: ADDRESS_B.toString() },
        { field: 'third', value: ADDRESS_A.toString() },
        { field: 'fourth', value: ADDRESS_C.toString() },
        { field: 'fifth', value: ADDRESS_C.toString() },
      ],
      ['second'],
      [ADDRESS_D],
      [ADDRESS_C],
    )

    expect(relatives).toEqual([ADDRESS_A, ADDRESS_D])
  })
})
