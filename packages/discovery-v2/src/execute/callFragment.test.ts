import type { IProvider } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber, utils } from 'ethers'
import { callFragment } from './callFragment'

/**
 * Mocks the provider and checks the three outcomes a call can have. The
 * baseline builder will call this for every 0-arg getter, so its error
 * wording must be V1's ("Execution reverted") for benchmark diffs to read.
 */
describe(callFragment.name, () => {
  const target = ChainSpecificAddress.fromLong(
    'ethereum',
    '0x1111111111111111111111111111111111111111',
  )
  const fragment = utils.Fragment.from(
    'function owner() view returns (address)',
  ) as utils.FunctionFragment

  it('formats a decoded result with the fragment outputs and V1 formatting', async () => {
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: async () =>
        '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' as never,
    })
    expect(await callFragment(provider, target, fragment, [])).toEqual({
      value: 'eth:0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
    })
    expect(provider.callMethod).toHaveBeenOnlyCalledWith(target, fragment, [])
  })

  it('reports undefined as V1 does: Execution reverted', async () => {
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: async () => undefined,
    })
    expect(await callFragment(provider, target, fragment, [])).toEqual({
      error: 'Execution reverted',
    })
  })

  it('reports thrown errors and asStructured shape mismatches by message', async () => {
    const throwing = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: async () => {
        throw new Error('rate limited')
      },
    })
    expect(await callFragment(throwing, target, fragment, [])).toEqual({
      error: 'rate limited',
    })

    const tuple = utils.Fragment.from(
      'function getConfig() view returns (tuple(address admin, uint256 delay) config)',
    ) as utils.FunctionFragment
    const wrongShape = mockObject<IProvider>({
      chain: 'ethereum',
      callMethod: async () => BigNumber.from(1) as never,
    })
    expect(await callFragment(wrongShape, target, tuple, [])).toEqual({
      error:
        "Assertion Error: The data shape of the value doesn't match the type",
    })
  })
})
