import type { EthRpcClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { findFirstBlockWithTotalSupply } from './findStartBlock'

// Method: fake an archive RPC where FLUID's proxy exists from its creation
// block but reverts on totalSupply() until its implementation upgrade, using
// the real Base block numbers. Telling a revert from an outage is
// EthRpcClient's job; here an outage is any error call() throws.
describe(findFirstBlockWithTotalSupply.name, () => {
  const ADDRESS = EthereumAddress('0x61E030A56D33e8260FdD81f03B162A79Fe3449Cd')
  const CREATION_BLOCK = 29131108
  const UPGRADE_BLOCK = 29650603
  const LATEST_BLOCK = 38000000

  const SUPPLY = `0x${'00'.repeat(31)}2a`
  const reverted = { reverted: true, reason: 'execution reverted' } as const
  const returns = (data: string) => ({ reverted: false, data }) as const

  const find = (rpc: EthRpcClient) =>
    findFirstBlockWithTotalSupply(rpc, ADDRESS, CREATION_BLOCK, LATEST_BLOCK)

  it('finds the first block where totalSupply() stops reverting', async () => {
    const rpc = mockRpc(async (block) =>
      block < UPGRADE_BLOCK ? reverted : returns(SUPPLY),
    )

    expect(await find(rpc)).toEqual(UPGRADE_BLOCK)
  })

  it('treats a result that is not a uint256 as unreadable', async () => {
    const errorPayload = '0x08c379a0'
    const rpc = mockRpc(async (block) =>
      returns(block < UPGRADE_BLOCK ? errorPayload : SUPPLY),
    )

    expect(await find(rpc)).toEqual(UPGRADE_BLOCK)
  })

  it('returns undefined when totalSupply() still reverts', async () => {
    const rpc = mockRpc(async () => reverted)

    expect(await find(rpc)).toEqual(undefined)
  })

  it('fails when a probe past the start was misread as a revert', async () => {
    let calls = 0
    const rpc = mockRpc(async (block) => {
      calls++
      const misread = calls === 2
      return block < UPGRADE_BLOCK || misread ? reverted : returns(SUPPLY)
    })

    await expect(find(rpc)).toBeRejectedWith('readable before the found start')
  })

  it('rethrows RPC outages instead of treating them as reverts', async () => {
    const rpc = mockRpc(async (block) => {
      if (block < UPGRADE_BLOCK) {
        throw new Error('RPC call failed. HTTP status: 503, body: ')
      }
      return returns(SUPPLY)
    })

    await expect(find(rpc)).toBeRejectedWith('HTTP status: 503')
  })
})

function mockRpc(
  call: (block: number) => ReturnType<EthRpcClient['call']>,
): EthRpcClient {
  return mockObject<EthRpcClient>({
    call: async (_tx, block) => await call(Number(block)),
  })
}
