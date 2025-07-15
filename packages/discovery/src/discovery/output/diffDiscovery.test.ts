import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { diffDiscovery } from './diffDiscovery'
import type { EntryParameters } from './types'

describe(diffDiscovery.name, () => {
  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const ADDRESS_D = EthereumAddress.random()
  const ADDRESS_E = EthereumAddress.random()

  const ADMIN = EthereumAddress.random()
  const IMPLEMENTATION = EthereumAddress.random()
  it('finds changes, deleted and created contracts', () => {
    const committed: EntryParameters[] = [
      //finds changes
      {
        type: 'Contract',
        name: 'A',
        address: ChainSpecificAddress.from('eth', ADDRESS_A),
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
          A: true,
          //ignores fields included in ignore in watch mode
          B: 'thisWillChange',
        },
      },
      //finds deleted contracts
      {
        type: 'Contract',
        name: 'B',
        address: ChainSpecificAddress.from('eth', ADDRESS_B),
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
        },
      },
      //skips unchanged contracts
      {
        type: 'Contract',
        name: 'D',
        address: ChainSpecificAddress.from('eth', ADDRESS_D),
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
        },
      },
      {
        type: 'Contract',
        name: 'E',
        address: ChainSpecificAddress.from('eth', ADDRESS_E),
        unverified: true,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
        },
      },
    ]
    const discovered: EntryParameters[] = [
      {
        type: 'Contract',
        name: 'A',
        address: ChainSpecificAddress.from('eth', ADDRESS_A),
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
          A: false,
          B: 'itChanged',
        },
      },
      //finds new contracts
      {
        type: 'Contract',
        name: 'C',
        address: ChainSpecificAddress.from('eth', ADDRESS_C),
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
        },
      },
      {
        type: 'Contract',
        name: 'D',
        address: ChainSpecificAddress.from('eth', ADDRESS_D),
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
        },
      },
      {
        type: 'Contract',
        name: 'E',
        address: ChainSpecificAddress.from('eth', ADDRESS_E),
        unverified: true,
        proxyType: 'EIP1967 proxy',
        values: {
          $admin: ADMIN.toString(),
          $implementation: IMPLEMENTATION.toString(),
        },
      },
    ]

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        addressType: 'Contract',
        description: undefined,
        diff: [
          {
            key: 'values.A',
            before: 'true',
            after: 'false',
            description: undefined,
            severity: undefined,
            type: undefined,
          },
        ],
      },
      {
        name: 'B',
        address: ADDRESS_B,
        addressType: 'Contract',
        description: undefined,
        type: 'deleted',
      },
      {
        name: 'C',
        address: ADDRESS_C,
        addressType: 'Contract',
        description: undefined,
        type: 'created',
      },
    ])
  })

  it('uses previous contract for description when deleted', () => {
    const committed: EntryParameters[] = [
      {
        type: 'Contract',
        name: 'A',
        address: ChainSpecificAddress.from('eth', ADDRESS_A),
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        description: 'hello world',
        values: {},
      },
    ]
    const discovered: EntryParameters[] = []

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        addressType: 'Contract',
        description: 'hello world',
        type: 'deleted',
      },
    ])
  })

  it('uses current contract for description when created', () => {
    const committed: EntryParameters[] = []
    const discovered: EntryParameters[] = [
      {
        type: 'Contract',
        name: 'A',
        address: ChainSpecificAddress.from('eth', ADDRESS_A),
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        description: 'hello world',
        values: {},
      },
    ]

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        addressType: 'Contract',
        description: 'hello world',
        type: 'created',
      },
    ])
  })

  it('uses current contract for description when modified', () => {
    const committed: EntryParameters[] = [
      {
        type: 'Contract',
        name: 'A',
        address: ChainSpecificAddress.from('eth', ADDRESS_A),
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        description: 'hello world',
        values: { v: 1 },
      },
    ]
    const discovered: EntryParameters[] = [
      {
        type: 'Contract',
        name: 'A',
        address: ChainSpecificAddress.from('eth', ADDRESS_A),
        proxyType: 'EIP1967 proxy',
        ignoreInWatchMode: ['B'],
        description: 'hello sailor',
        values: { v: 2 },
      },
    ]

    const result = diffDiscovery(committed, discovered)

    expect(result).toEqual([
      {
        name: 'A',
        address: ADDRESS_A,
        addressType: 'Contract',
        diff: [
          {
            after: '"hello sailor"',
            before: '"hello world"',
            description: undefined,
            key: 'description',
            severity: undefined,
            type: undefined,
          },
          {
            after: '2',
            before: '1',
            description: undefined,
            key: 'values.v',
            severity: undefined,
            type: undefined,
          },
        ],
        description: 'hello sailor',
      },
    ])
  })
})
