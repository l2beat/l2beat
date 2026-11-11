import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { DiffoveryController } from './DiffoveryController'
import type { FlatSourceClient } from './FlatSourceClient'

describe(DiffoveryController.name, () => {
  it('keeps every overload of a free function', async () => {
    const result = await handle(
      [
        'function f(uint a) pure returns (uint) { return a; }',
        'function f(uint a, uint b) pure returns (uint) { return a + b; }',
        'function f(bool a) pure returns (bool) { return a; }',
      ].join('\n'),
    )

    expect(Object.keys(result.sources)).toEqual([
      '#ConstructorArguments',
      'f',
      'f (2)',
      'f (3)',
    ])
    expect(result.sources['f (2)']).toEqual(
      'function f(uint a, uint b) pure returns (uint) { return a + b; }',
    )
  })

  it('keeps text between and after declarations with the directives', async () => {
    const result = await handle(
      [
        '// SPDX-License-Identifier: MIT',
        'pragma solidity ^0.8.0;',
        '',
        '/// @notice A',
        'contract A {} // after A',
        '',
        'contract B {}',
        '// trailing',
        '',
      ].join('\n'),
    )

    expect(result.sources).toEqual({
      '#ConstructorArguments': '',
      '#Directives': [
        '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;',
        '// after A',
        '// trailing',
      ].join('\n\n'),
      A: '/// @notice A\ncontract A {}',
      B: 'contract B {}',
    })
  })
})

async function handle(flat: string) {
  const client = mockObject<FlatSourceClient>({
    getFlat: async () => ({
      kind: 'flat',
      name: 'Test',
      flat,
      constructorArguments: '',
    }),
  })
  return await new DiffoveryController(client).handle(
    ChainSpecificAddress('eth:0x0000000000000000000000000000000000000001'),
  )
}
