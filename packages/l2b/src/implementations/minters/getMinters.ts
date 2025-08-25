import type { IProvider } from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export async function getMintTransactions(
  provider: IProvider,
  address: EthereumAddress,
) {
  const abi = [
    'event Transfer(address indexed from, address indexed to, uint256 value)',
  ]

  const iface = new utils.Interface(abi)
  const topics = iface.encodeFilterTopics('Transfer', [EthereumAddress.ZERO])

  const chainSpecificAddress = ChainSpecificAddress.fromLong(
    provider.chain,
    address,
  )

  const logs = await provider.getLogs(chainSpecificAddress, topics)

  return [...new Set(logs.map((log) => log.transactionHash))]
}
