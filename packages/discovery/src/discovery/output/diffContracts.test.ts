import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { diffContracts } from './diffContracts'
import type { EntryParameters } from './types'

describe(diffContracts.name, () => {
  const OLD_ADDRESS = ChainSpecificAddress.from('eth', EthereumAddress.random())
  const NEW_ADDRESS = ChainSpecificAddress.from('eth', EthereumAddress.random())

  const OLD_ADMIN = ChainSpecificAddress.from('eth', EthereumAddress.random())
  const NEW_ADMIN = ChainSpecificAddress.from('eth', EthereumAddress.random())

  const IMPLEMENTATION = EthereumAddress.random()

  it('returns difference between two objects', () => {
    const committed: EntryParameters = {
      type: 'Contract',
      name: 'A',
      address: OLD_ADDRESS,
      proxyType: 'EIP1967 proxy',
      values: {
        $implementation: IMPLEMENTATION.toString(),
        $admin: OLD_ADMIN.toString(),
        A: true,
        B: true,
        C: 1,
        D: [1, 2, 3],
        E: 'ignoreMe',
      },
    }
    const discovered: EntryParameters = {
      type: 'Contract',
      name: 'A',
      address: NEW_ADDRESS,
      proxyType: 'EIP1967 proxy',
      ignoreInWatchMode: ['E', 'F'],
      values: {
        $admin: NEW_ADMIN.toString(),
        $implementation: IMPLEMENTATION.toString(),
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
        description: undefined,
        severity: undefined,
        type: undefined,
      },
      {
        key: 'values.$admin',
        before: JSON.stringify(OLD_ADMIN),
        after: JSON.stringify(NEW_ADMIN),
        description: undefined,
        severity: undefined,
        type: undefined,
      },
      {
        key: 'values.A',
        before: 'true',
        after: 'false',
        description: undefined,
        severity: undefined,
        type: undefined,
      },
      {
        key: 'values.B',
        before: 'true',
        description: undefined,
        severity: undefined,
        type: undefined,
      },
      {
        key: 'values.D.3',
        after: '4',
        description: undefined,
        severity: undefined,
        type: undefined,
      },
      {
        key: 'values.A.F',
        after: '"dontIgnoreMe"',
        description: undefined,
        severity: undefined,
        type: undefined,
      },
    ])
  })
})
