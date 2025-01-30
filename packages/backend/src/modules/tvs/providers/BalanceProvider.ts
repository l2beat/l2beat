import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { bigIntToNumber } from '../bigIntToNumber'
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
    decimals: number,
    blockNumber: number,
  ): Promise<number> {
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
      return 0
    }

    // we want to to have 2 decimals precision
    return bigIntToNumber(response.toString(), decimals)
  }

  async getNativeAssetBalance(
    chain: string,
    holderAddress: EthereumAddress,
    decimals: number,
    blockNumber: number,
  ): Promise<number> {
    const rpc = this.rpcClients.get(chain)
    assert(rpc, `${chain}: No RPC configured`)

    const response = await rpc.getBalance(holderAddress, blockNumber)

    if (response.toString() === '0x') {
      return 0
    }

    return bigIntToNumber(response.toString(), decimals)
  }
}
