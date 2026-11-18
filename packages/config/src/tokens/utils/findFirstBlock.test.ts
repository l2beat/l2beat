import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { providers } from 'ethers'
import { findFirstBlockWithTotalSupply } from './findFirstBlock'

// Method: fake an archive RPC where FLUID's proxy exists from its creation
// block but reverts on totalSupply() until its implementation upgrade, using
// the real Base block numbers. Errors copy the shapes ethers 5 gives send()
// for a revert and for an HTTP 503 from mainnet.base.org and a local server.
describe(findFirstBlockWithTotalSupply.name, () => {
  const ADDRESS = EthereumAddress('0x61E030A56D33e8260FdD81f03B162A79Fe3449Cd')
  const CREATION_BLOCK = 29131108
  const UPGRADE_BLOCK = 29650603
  const LATEST_BLOCK = 38000000

  const SUPPLY = `0x${'00'.repeat(31)}2a`
  const revert = Object.assign(new Error('processing response error'), {
    code: 'SERVER_ERROR',
    error: { code: 3, message: 'execution reverted' },
  })
  const outage = Object.assign(new Error('bad response (status=503)'), {
    code: 'SERVER_ERROR',
    status: 503,
  })

  const find = (provider: providers.JsonRpcProvider) =>
    findFirstBlockWithTotalSupply(
      provider,
      ADDRESS,
      CREATION_BLOCK,
      LATEST_BLOCK,
    )

  it('finds the first block where totalSupply() stops reverting', async () => {
    const provider = mockProvider(async (block) => {
      if (block < UPGRADE_BLOCK) throw revert
      return SUPPLY
    })

    expect(await find(provider)).toEqual(UPGRADE_BLOCK)
  })

  it('treats a result that is not a uint256 as unreadable', async () => {
    const errorPayload = '0x08c379a0'
    const provider = mockProvider(async (block) =>
      block < UPGRADE_BLOCK ? errorPayload : SUPPLY,
    )

    expect(await find(provider)).toEqual(UPGRADE_BLOCK)
  })

  it('returns undefined when totalSupply() still reverts', async () => {
    const provider = mockProvider(async () => {
      throw revert
    })

    expect(await find(provider)).toEqual(undefined)
  })

  it('rethrows RPC outages instead of treating them as reverts', async () => {
    const provider = mockProvider(async (block) => {
      if (block < UPGRADE_BLOCK) throw outage
      return SUPPLY
    })

    await expect(find(provider)).toBeRejectedWith('bad response')
  })
})

function mockProvider(call: (block: number) => Promise<string>) {
  return mockObject<providers.JsonRpcProvider>({
    send: async (_method, [_tx, block]) => await call(Number(block)),
  })
}
