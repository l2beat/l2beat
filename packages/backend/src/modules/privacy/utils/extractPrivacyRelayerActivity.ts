import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  PrivacyRelayerActivityExtractResult,
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRpcLog,
} from '../types'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

const tornadoCashInterface = new utils.Interface([
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

export function extractPrivacyRelayerActivity(
  source: PrivacyRelayerActivityIndexerConfig,
  log: PrivacyRpcLog,
): PrivacyRelayerActivityExtractResult | undefined {
  switch (source.extractor) {
    case 'privacyPoolsWithdrawalRelayed': {
      const parsedLog = privacyPoolsInterface.parseLog(log)
      return toRelayerActivity(
        String(parsedLog.args._relayer),
        String(parsedLog.args._recipient),
      )
    }
    case 'tornadoCashWithdrawal': {
      const parsedLog = tornadoCashInterface.parseLog(log)
      return toRelayerActivity(
        String(parsedLog.args.relayer),
        String(parsedLog.args.to),
      )
    }
  }
}

function toRelayerActivity(
  relayer: string,
  recipient: string,
): PrivacyRelayerActivityExtractResult | undefined {
  const relayerAddress = EthereumAddress(relayer)
  const recipientAddress = EthereumAddress(recipient)

  if (relayerAddress === recipientAddress) {
    return undefined
  }

  return { relayerAddress, recipientAddress }
}
