import { ContractParameters, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { diffContracts } from './diffContracts'

describe(diffContracts.name, () => {
  const OLD_ADDRESS = EthereumAddress.random()
  const NEW_ADDRESS = EthereumAddress.random()

  const OLD_ADMIN = EthereumAddress.random()
  const NEW_ADMIN = EthereumAddress.random()

  const IMPLEMENTATION = EthereumAddress.random()

  it('returns difference between two objects', () => {
    const committed: ContractParameters = {
      name: 'A',
      address: OLD_ADDRESS,
      upgradeability: {
        type: 'EIP1967 proxy',
        admin: OLD_ADMIN,
        implementation: IMPLEMENTATION,
      },
      values: {
        A: true,
        B: true,
        C: 1,
        D: [1, 2, 3],
        E: 'ignoreMe',
      },
    }
    const discovered: ContractParameters = {
      name: 'A',
      address: NEW_ADDRESS,
      upgradeability: {
        type: 'EIP1967 proxy',
        admin: NEW_ADMIN,
        implementation: IMPLEMENTATION,
      },
      values: {
        A: false,
        C: 1,
        D: [1, 2, 3, 4],
        E: 'ignoreMePlease',
        F: 'ignoreMePlease',
      },
    }
    const ignoreInWatchMode = ['E', 'F']
    const result = diffContracts(committed, discovered, ignoreInWatchMode)

    expect(result).toEqual([
      {
        key: 'address',
        before: JSON.stringify(OLD_ADDRESS),
        after: JSON.stringify(NEW_ADDRESS),
      },
      {
        key: 'upgradeability.admin',
        before: JSON.stringify(OLD_ADMIN),
        after: JSON.stringify(NEW_ADMIN),
      },
      { key: 'values.A', before: 'true', after: 'false' },
      { key: 'values.B', before: 'true' },
      { key: 'values.D[3]', after: '4' },
    ])
  })
})
