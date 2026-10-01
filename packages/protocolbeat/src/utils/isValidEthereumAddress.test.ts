import { expect } from 'earl'
import { isValidEthereumAddress } from './isValidEthereumAddress'

const ADDRESS = '0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d'

describe(isValidEthereumAddress.name, () => {
  it('accepts a 20 byte hex address', () => {
    expect(isValidEthereumAddress(ADDRESS)).toEqual(true)
  })

  it('rejects wrong length, missing prefix and non hex characters', () => {
    expect(isValidEthereumAddress(ADDRESS.slice(0, -1))).toEqual(false)
    expect(isValidEthereumAddress(`00${ADDRESS.slice(2)}`)).toEqual(false)
    expect(isValidEthereumAddress(`${ADDRESS.slice(0, -1)}g`)).toEqual(false)
  })
})
