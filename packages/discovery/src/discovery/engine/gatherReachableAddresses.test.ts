import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { gatherReachableAddresses } from './gatherReachableAddresses'

describe.only(gatherReachableAddresses.name, () => {
  it('returns reachable addresses', () => {
    // scenario:
    // from = 1 & 3 & 10
    // graph:
    // 1 -> 2
    // 3 -> 4
    // 5 -> 6 -> 7
    //      + -> 8 -> 9
    // 10 -> 11 -> 12
    const address1 = EthereumAddress.from('0x1')
    const address2 = EthereumAddress.from('0x2')
    const address3 = EthereumAddress.from('0x3')
    const address4 = EthereumAddress.from('0x4')
    const address5 = EthereumAddress.from('0x5')
    const address6 = EthereumAddress.from('0x6')
    const address7 = EthereumAddress.from('0x7')
    const address8 = EthereumAddress.from('0x8')
    const address9 = EthereumAddress.from('0x9')
    const address10 = EthereumAddress.from('0xa')
    const address11 = EthereumAddress.from('0xb')
    const address12 = EthereumAddress.from('0xc')
    const addressRelatives = {
      [address1.toString()]: [address2],
      [address2.toString()]: [],
      [address3.toString()]: [address4],
      [address4.toString()]: [],
      [address5.toString()]: [address6],
      [address6.toString()]: [address7, address8],
      [address7.toString()]: [],
      [address8.toString()]: [address9],
      [address9.toString()]: [],
      [address10.toString()]: [address11],
      [address11.toString()]: [address12],
      [address12.toString()]: [],
    }

    const result = gatherReachableAddresses(
      [address1, address3, address10],
      addressRelatives,
    )

    expect(result).toEqual(
      new Set([
        address1,
        address2,
        address3,
        address4,
        address10,
        address11,
        address12,
      ]),
    )
  })
})
