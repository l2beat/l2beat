import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { addressToBytes32, bytes32ToAddress } from './address.js'

describe(addressToBytes32.name, () => {
  it('encodes addresses correctly', () => {
    const ADDRESS1 = EthereumAddress.random()
    const ADDRESS2 = EthereumAddress.random()
    const ADDRESS3 = EthereumAddress.random()
    const ADDRESS4 = EthereumAddress.random()
    const ADDRESS5 = EthereumAddress.random()

    expect(addressToBytes32(ADDRESS1).length).toEqual(32)
    expect(addressToBytes32(ADDRESS2).length).toEqual(32)
    expect(addressToBytes32(ADDRESS3).length).toEqual(32)
    expect(addressToBytes32(ADDRESS4).length).toEqual(32)
    expect(addressToBytes32(ADDRESS5).length).toEqual(32)
    expect(bytes32ToAddress(addressToBytes32(ADDRESS1))).toEqual(ADDRESS1)
    expect(bytes32ToAddress(addressToBytes32(ADDRESS2))).toEqual(ADDRESS2)
    expect(bytes32ToAddress(addressToBytes32(ADDRESS3))).toEqual(ADDRESS3)
    expect(bytes32ToAddress(addressToBytes32(ADDRESS4))).toEqual(ADDRESS4)
    expect(bytes32ToAddress(addressToBytes32(ADDRESS5))).toEqual(ADDRESS5)
  })
})

describe(bytes32ToAddress.name, () => {
  it('decodes addresses correctly', () => {
    expect(bytes32ToAddress(Bytes.fromHex(''.padStart(64, '0')))).toEqual(
      EthereumAddress.ZERO,
    )
    const addressStrings = [
      '1234567890123456789012345678901234567890',
      '9084091324820939570123794542039572730520',
      '39845734985478ab98ab7a98cb987987987aafff',
      '95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
      '3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    ]

    for (const addressString of addressStrings) {
      expect(
        bytes32ToAddress(Bytes.fromHex(addressString.padStart(64, '0'))),
      ).toEqual(EthereumAddress(addressString))
    }
  })
})
