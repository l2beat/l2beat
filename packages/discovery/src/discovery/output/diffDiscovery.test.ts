import { ContractParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { diffDiscovery } from './diffDiscovery'

describe(diffDiscovery.name, () => {
  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const ADDRESS_D = EthereumAddress.random()
  const ADDRESS_E = EthereumAddress.random()

  const ADMIN = EthereumAddress.random()
  const IMPLEMENTATION = EthereumAddress.random()
  it('finds changes, deleted and created contracts', () => {
    const committed: ContractParameters[] = [
      //finds changes
      {
        name: 'A',
        address: ADDRESS_A,
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
          A: true,
          //ignores fields included in ignore in watch mode
          B: 'thisWillChange',
        },
      },
      //finds deleted contracts
      {
        name: 'B',
        address: ADDRESS_B,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
        },
      },
      //skips unchanged contracts
      {
        name: 'D',
        address: ADDRESS_D,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
        },
      },
      {
        name: 'E',
        address: ADDRESS_E,
        unverified: true,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
        },
      },
    ]
    const discovered: ContractParameters[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
          A: false,
          B: 'itChanged',
        },
      },
      //finds new contracts
      {
        name: 'C',
        address: ADDRESS_C,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
        },
      },
      {
        name: 'D',
        address: ADDRESS_D,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
        },
      },
      {
        name: 'E',
        address: ADDRESS_E,
        unverified: true,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN,
          $implementation: IMPLEMENTATION,
        },
      },
    ]

    const result = diffDiscovery(committed, discovered)

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
