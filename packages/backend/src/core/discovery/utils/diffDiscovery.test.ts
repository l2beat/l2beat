import { EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { DiscoveryContract } from '../DiscoveryConfig'
import { ContractParameters } from '../types'
import { diffDiscovery, diffObjects } from './diffDiscovery'

describe(diffDiscovery.name, () => {
  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const ADDRESS_D = EthereumAddress.random()

  const ADMIN = EthereumAddress.random()
  const IMPLEMENTATION = EthereumAddress.random()
  it('works', () => {
    const committed: unknown[] = [
      //finds changes
      {
        name: 'A',
        address: ADDRESS_A.toString(),
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN.toString(),
          implementation: IMPLEMENTATION,
        },
        values: {
          A: true,
          //ignores fields included in ignore in watch mode
          B: 'thisWillChange',
        },
      },
      //finds deleted contracts
      {
        name: 'B',
        address: ADDRESS_B.toString(),
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN.toString(),
          implementation: IMPLEMENTATION,
        },
        values: {},
      },
      //skips unchanged contracts
      {
        name: 'D',
        address: ADDRESS_D.toString(),
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN.toString(),
          implementation: IMPLEMENTATION,
        },
        values: {},
      },
    ]
    const discovered: ContractParameters[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN,
          implementation: IMPLEMENTATION,
        },
        values: {
          A: false,
          B: 'itChanged',
        },
      },
      //finds new contracts
      {
        name: 'C',
        address: ADDRESS_C,
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN,
          implementation: IMPLEMENTATION,
        },
        values: {},
      },
      {
        name: 'D',
        address: ADDRESS_D,
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN,
          implementation: IMPLEMENTATION,
        },
        values: {},
      },
    ]
    const ignoreInWatchMode: Record<string, DiscoveryContract> = {
      [ADDRESS_A.toString()]: {
        ignoreInWatchMode: ['B'],
      },
    }

    const result = diffDiscovery(committed, discovered, ignoreInWatchMode)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        diff: [{ key: 'values.A', before: 'true', after: 'false' }],
      },
      {
        name: 'B',
        address: ADDRESS_B,
        type: 'deleted',
      },
      {
        name: 'C',
        address: ADDRESS_C,
        type: 'created',
      },
    ])
  })
})

describe(diffObjects.name, () => {
  const OLD_ADDRESS = EthereumAddress.random()
  const NEW_ADDRESS = EthereumAddress.random()

  const OLD_ADMIN = EthereumAddress.random()
  const NEW_ADMIN = EthereumAddress.random()

  const IMPLEMENTATION = EthereumAddress.random()

  it('returns keys of changed fields', () => {
    const committed = {
      name: 'A',
      address: OLD_ADDRESS.toString(),
      upgradeability: {
        type: 'EIP1967 proxy',
        admin: OLD_ADMIN.toString(),
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
      },
    }
    const ignoreInWatchMode = ['E']
    const result = diffObjects(committed, discovered, ignoreInWatchMode)

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
