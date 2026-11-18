import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { providers } from 'ethers'
import { findFirstBlockWithTotalSupply } from './findFirstBlock'

// Method: fake an archive RPC where FLUID's proxy exists from its creation
// block but reverts on totalSupply() until its implementation upgrade, using
// the real Base block numbers.
describe(findFirstBlockWithTotalSupply.name, () => {
  const ADDRESS = EthereumAddress('0x61E030A56D33e8260FdD81f03B162A79Fe3449Cd')
  const CREATION_BLOCK = 29158926
  const UPGRADE_BLOCK = 29650603
  const LATEST_BLOCK = 38000000

  const revert = Object.assign(new Error('execution reverted'), {
    code: 'CALL_EXCEPTION',
  })

  it('finds the first block where totalSupply() stops reverting', async () => {
    const provider = mockProvider(async (block) => {
      if (block < UPGRADE_BLOCK) throw revert
      return '0x01'
    })

    expect(
      await findFirstBlockWithTotalSupply(
        provider,
        ADDRESS,
        CREATION_BLOCK,
        LATEST_BLOCK,
      ),
    ).toEqual(UPGRADE_BLOCK)
  })

  it('returns undefined when totalSupply() still reverts', async () => {
    const provider = mockProvider(async () => {
      throw revert
    })

    expect(
      await findFirstBlockWithTotalSupply(
        provider,
        ADDRESS,
        CREATION_BLOCK,
        LATEST_BLOCK,
      ),
    ).toEqual(undefined)
  })

  it('rethrows RPC errors instead of treating them as reverts', async () => {
    const provider = mockProvider(async (block) => {
      if (block < UPGRADE_BLOCK) throw new Error('503 Service Unavailable')
      return '0x01'
    })

    await expect(
      findFirstBlockWithTotalSupply(
        provider,
        ADDRESS,
        CREATION_BLOCK,
        LATEST_BLOCK,
      ),
    ).toBeRejectedWith('503 Service Unavailable')
  })
})

function mockProvider(call: (block: number) => Promise<string>) {
  return mockObject<providers.JsonRpcProvider>({
    call: async (_tx, block) => await call(Number(block)),
  })
}
