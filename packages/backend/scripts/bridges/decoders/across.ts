import type { EVMLog } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import type { BridgeTransfer } from '../cli'

export function decodeAcross(
  chain: string,
  log: EVMLog,
): BridgeTransfer | undefined {
  if (
    EthereumAddress(log.address) !==
    EthereumAddress('0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5')
  )
    return undefined

  if (
    log.topics[0] ===
    '0x32ed1a409ef04c7b0227189c3a103dc5ac10e775a15b785dcc510201f7c25ad3'
  )
    return {
      chain,
      protocol: 'across',
      txHash: log.transactionHash,
      direction: 'deposit',
    }

  if (
    log.topics[0] ===
    '0x44b559f101f8fbcc8a0ea43fa91a05a729a5ea6e14a7c75aa750374690137208'
  )
    return {
      chain,
      protocol: 'across',
      txHash: log.transactionHash,
      direction: 'withdraw',
    }

  return undefined
}
