import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { bytes32ToAddress } from './address'

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
