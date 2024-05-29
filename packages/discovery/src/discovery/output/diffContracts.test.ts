import { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
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
      ignoreInWatchMode: ['E', 'F'],
      values: {
        A: false,
        C: 1,
        D: [1, 2, 3, 4],
        E: 'ignoreMePlease',
        'E.2': 'ignoreMeToo',
        F: 'ignoreMePlease',
        'A.F': 'dontIgnoreMe',
      },
    }
    const ignoreInWatchMode =
      discovered.ignoreInWatchMode?.map((i) => `values.${i}`) ?? []
    const ignore = ['ignoreInWatchMode', ...ignoreInWatchMode]
    const result = diffContracts(committed, discovered, ignore)

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
      { key: 'values.D.3', after: '4' },
      { key: 'values.A.F', after: '"dontIgnoreMe"' },
    ])
  })
})
