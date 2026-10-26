import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { DiffoveryController } from './DiffoveryController'
import type { FlatSourceClient } from './FlatSourceClient'

describe(DiffoveryController.name, () => {
  it('keeps every overload of a free function', async () => {
    const flat = [
      'function f(uint a) pure returns (uint) { return a; }',
      'function f(uint a, uint b) pure returns (uint) { return a + b; }',
      'function f(bool a) pure returns (bool) { return a; }',
    ].join('\n')
    const client = mockObject<FlatSourceClient>({
      getFlat: async () => ({
        kind: 'flat',
        name: 'Overloads',
        flat,
        constructorArguments: '',
      }),
    })

    const result = await new DiffoveryController(client).handle(
      ChainSpecificAddress('eth:0x0000000000000000000000000000000000000001'),
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
})
