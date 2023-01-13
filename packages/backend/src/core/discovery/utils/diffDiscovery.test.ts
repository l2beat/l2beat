import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { ContractParameters } from '../types'
import { diffContract, diffDiscovery } from './diffDiscovery'

describe(diffDiscovery.name, () => {
  it('works', () => {
    const addressA = EthereumAddress.random()
    const addressB = EthereumAddress.random()
    const addressC = EthereumAddress.random()

    const committed: ContractParameters[] = [
      {
        name: 'A',
        address: addressA,
        upgradeability: {},
        values: {
          A: true,
        },
      },
      {
        name: 'B',
        address: addressB,
        upgradeability: {},
        values: {},
      },
    ]
    const discovered: ContractParameters[] = [
      {
        name: 'A',
        address: addressA,
        upgradeability: {},
        values: {
          A: false,
        },
      },
      {
        name: 'C',
        address: addressC,
        upgradeability: {},
        values: {},
      },
    ]
    const ignoreInWatchMode = {}

    const result = diffDiscovery(committed, discovered, ignoreInWatchMode)

    expect(result).toEqual([
        {address: addressA, diff: ['values.A']},
        {address: addressB, diff: 'deleted'},
        {address: addressC, diff: 'created'}
    ])
  })
})

describe(diffContract.name, () => {
  it('returns keys of changed fields', () => {
    const OLD_ADDRESS = EthereumAddress.random()
    const NEW_ADDRESS = EthereumAddress.random()

    const OLD_ADMIN = EthereumAddress.random()
    const NEW_ADMIN = EthereumAddress.random()

    const committed: ContractParameters = {
      name: 'A',
      address: OLD_ADDRESS,
      upgradeability: {
        type: 'proxy',
        admin: OLD_ADMIN.toString()
      },
      values: {
        A: true,
        B: true,
        C: 1,
        D: [1, 2, 3],
      },
    }
    const discovered: ContractParameters = {
      name: 'A',
      address: NEW_ADMIN,
      upgradeability: {},
      values: {
        A: false,
        C: 1,
        D: [1, 2, 3, 4],
      },
    }

    const ignoreInWatchMode = ['D']

    const result = diffContract(committed, discovered, ignoreInWatchMode)

    expect(result).toEqual([
      {
        key: 'address',
        before: OLD_ADDRESS.toString(),
        after: NEW_ADDRESS.toString()
      },
      {key: 'upgradeability.admin', before: OLD_ADMIN.toString(), after: NEW_ADMIN.toString()},
      {key: 'values.A', before: 'true', after: 'false'},
      {key: 'values.B', before: 'true'},
    ])
  })
})
