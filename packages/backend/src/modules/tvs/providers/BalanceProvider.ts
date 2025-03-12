import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { RpcClientPOC } from './RpcClientPOC'

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
])

export class BalanceProvider {
  constructor(private rpcClients: Map<string, RpcClientPOC>) {}

  async getTokenBalance(
    chain: string,
    tokenAddress: EthereumAddress,
    holderAddress: EthereumAddress,
    blockNumber: number,
  ): Promise<bigint> {
    const rpc = this.rpcClients.get(chain)
    assert(rpc, `${chain}: No RPC configured`)

    const calldata = erc20Interface.encodeFunctionData('balanceOf', [
      holderAddress,
    ])

    const response = await rpc.call(
      { to: tokenAddress, data: Bytes.fromHex(calldata) },
      blockNumber,
    )

    if (response.toString() === '0x') {
      return 0n
    }

    return BigInt(response.toString())
  }

  async getNativeAssetBalance(
    chain: string,
    holderAddress: EthereumAddress,
    blockNumber: number,
  ): Promise<bigint> {
    const rpc = this.rpcClients.get(chain)
    assert(rpc, `${chain}: No RPC configured`)

    const response = await rpc.getBalance(holderAddress, blockNumber)

    if (response.toString() === '0x') {
      return 0n
    }

    return BigInt(response.toString())
  }
}
