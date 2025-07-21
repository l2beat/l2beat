import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { gatherReachableAddresses } from './gatherReachableAddresses'

describe(gatherReachableAddresses.name, () => {
  it('returns reachable addresses', () => {
    // scenario:
    // from = 1 & 3 & 10
    // graph:
    // 1 -> 2
    // 3 -> 4
    // 5 -> 6 -> 7
    //      + -> 8 -> 9
    // 10 -> 11 -> 12
    const address1 = ChainSpecificAddress.random()
    const address2 = ChainSpecificAddress.random()
    const address3 = ChainSpecificAddress.random()
    const address4 = ChainSpecificAddress.random()
    const address5 = ChainSpecificAddress.random()
    const address6 = ChainSpecificAddress.random()
    const address7 = ChainSpecificAddress.random()
    const address8 = ChainSpecificAddress.random()
    const address9 = ChainSpecificAddress.random()
    const address10 = ChainSpecificAddress.random()
    const address11 = ChainSpecificAddress.random()
    const address12 = ChainSpecificAddress.random()
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
