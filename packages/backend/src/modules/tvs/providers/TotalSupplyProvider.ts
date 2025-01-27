import type { RpcClient } from '@l2beat/shared'
import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

export class TotalSupplyProvider {
  constructor(private rpcClients: Map<string, RpcClient>) {}

  async getTotalSupply(
    chain: string,
    address: EthereumAddress,
    decimals: number,
    blockNumber: number,
  ): Promise<number> {
    const rpc = this.rpcClients.get(chain)
    assert(rpc, `${chain}: No RPC configured`)

    const calldata = erc20Interface.encodeFunctionData('totalSupply', [])

    const response = await rpc.call(
      { to: address, data: Bytes.fromHex(calldata) },
      blockNumber,
    )

    return Number(BigInt(response.toString()) / 10n ** BigInt(decimals))
  }
}
