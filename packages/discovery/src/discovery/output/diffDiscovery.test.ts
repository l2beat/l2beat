import { ContractParameters, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { diffDiscovery } from './diffDiscovery'

describe(diffDiscovery.name, () => {
  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const ADDRESS_D = EthereumAddress.random()

  const ADMIN = EthereumAddress.random()
  const IMPLEMENTATION = EthereumAddress.random()
  it('finds changes, deleted and created contracts', () => {
    const committed: ContractParameters[] = [
      //finds changes
      {
        name: 'A',
        address: ADDRESS_A,
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN,
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
        address: ADDRESS_B,
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: ADMIN,
          implementation: IMPLEMENTATION,
        },
        values: {},
      },
      //skips unchanged contracts
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
    const config = new DiscoveryConfig({
      name: '',
      initialAddresses: [],
      overrides: {
        [ADDRESS_A.toString()]: {
          ignoreInWatchMode: ['B'],
        },
      },
    })

    const result = diffDiscovery(committed, discovered, config)

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
