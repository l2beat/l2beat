import type { IRpcClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'

export type EthUsdRpc = Pick<IRpcClient, 'call'>

const ETH_USD_FEED = EthereumAddress(
  '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
)
const LATEST_ANSWER = Bytes.fromHex('0x50d25bcd')
const FEED_DECIMALS = 8

/** Chainlink's ETH/USD as of a block */
export async function readEthUsd(
  rpc: EthUsdRpc,
  blockNumber: number,
): Promise<number> {
  const answer = await rpc.call(
    { to: ETH_USD_FEED, input: LATEST_ANSWER },
    blockNumber,
  )
  return Number(BigInt(answer.toString())) / 10 ** FEED_DECIMALS
}
