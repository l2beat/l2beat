import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { RpcClientPOC } from './RpcClientPOC'

export const erc20Interface = new utils.Interface([
  'function totalSupply() view returns (uint256)',
])

export class TotalSupplyProvider {
  constructor(private rpcClients: Map<string, RpcClientPOC>) {}

  async getTotalSupply(
    chain: string,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<bigint> {
    const rpc = this.rpcClients.get(chain)
    assert(rpc, `${chain}: No RPC configured`)

    const calldata = erc20Interface.encodeFunctionData('totalSupply', [])

    const response = await rpc.call(
      { to: address, data: Bytes.fromHex(calldata) },
      blockNumber,
    )

    if (response.toString() === '0x') return 0n

    return BigInt(response.toString())
  }
}
