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
    const committed: ContractParameters = {
      name: 'A',
      address: EthereumAddress.random(),
      upgradeability: {},
      values: {
        A: true,
        B: 'true',
        C: 1,
        D: [1, 2, 3],
      },
    }
    const discovered: ContractParameters = {
      name: 'A',
      address: EthereumAddress.random(),
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
      'address',
      'upgradeability.admin',
      'values.A',
      'values.B',
    ])
  })
})
