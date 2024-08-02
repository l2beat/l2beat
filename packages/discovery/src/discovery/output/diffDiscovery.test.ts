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
        description: undefined,
        diff: [
          {
            key: 'values.A',
            before: 'true',
            after: 'false',
            description: undefined,
            severity: undefined,
          },
        ],
      },
      {
        name: 'B',
        address: ADDRESS_B,
        description: undefined,
        type: 'deleted',
      },
      {
        name: 'C',
        address: ADDRESS_C,
        description: undefined,
        type: 'created',
      },
    ])
  })

  it('uses previous contract for description when deleted', () => {
    const committed: ContractParameters[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        descriptions: ['hello', 'world'],
        values: {},
      },
    ]
    const discovered: ContractParameters[] = []

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        description: 'hello world',
        type: 'deleted',
      },
    ])
  })

  it('uses current contract for description when created', () => {
    const committed: ContractParameters[] = []
    const discovered: ContractParameters[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        descriptions: ['hello', 'world'],
        values: {},
      },
    ]

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        description: 'hello world',
        type: 'created',
      },
    ])
  })

  it('uses current contract for description when modified', () => {
    const committed: ContractParameters[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        descriptions: ['hello', 'world'],
        values: { v: 1 },
      },
    ]
    const discovered: ContractParameters[] = [
      {
        name: 'A',
        address: ADDRESS_A,
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        descriptions: ['hello', 'sailor'],
        values: { v: 2 },
      },
    ]

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        diff: [
          {
            after: '"sailor"',
            before: '"world"',
            description: undefined,
            key: 'descriptions.1',
            severity: undefined,
          },
          {
            after: '2',
            before: '1',
            description: undefined,
            key: 'values.v',
            severity: undefined,
          },
        ],
        description: 'hello sailor',
      },
    ])
  })
})
