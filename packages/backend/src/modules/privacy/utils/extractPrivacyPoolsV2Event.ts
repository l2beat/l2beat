import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyRpcContext, PrivacyRpcLog } from '../types'

// The PoolVault holds every asset, so each event indexes the asset and the
// value that crossed the pool boundary.
const poolVaultInterface = new utils.Interface([
  'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
  'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
  'event Ragequit(address indexed ragequitter, address indexed asset, uint256 value, uint256 commitment, uint256 nullifierHash, uint256 label)',
  'function transact((uint256[2] pA, uint256[2][2] pB, uint256[2] pC, uint256[][] pubSignals) _proof, (address processor, bytes data) _transactParams, (bytes32 hint, bytes data)[] _noteData)',
])

const TRANSACTED_TOPIC = poolVaultInterface.getEventTopic('Transacted')

const PAYOUT_ROUTING =
  'tuple(address recipient, address feeRecipient, uint256 feeAmount, uint256 nativeGas)'

interface PrivacyPoolsV2Event {
  asset: EthereumAddress
  amount: bigint
}

export function extractPrivacyPoolsV2Event(
  log: PrivacyRpcLog,
): PrivacyPoolsV2Event {
  const parsedLog = poolVaultInterface.parseLog(log)
  const asset = EthereumAddress(parsedLog.args.asset)
  switch (parsedLog.name) {
    case 'Deposited':
      return { asset, amount: BigInt(parsedLog.args.depositedValue.toString()) }
    case 'Transacted':
      return { asset, amount: BigInt(parsedLog.args.withdrawnValue.toString()) }
    case 'Ragequit':
      return { asset, amount: BigInt(parsedLog.args.value.toString()) }
    default:
      throw new Error('Unexpected Privacy Pools v2 event', {
        cause: { name: parsedLog.name },
      })
  }
}

/**
 * A relayed private transfer pays the relayer's fee out of the vault, so its
 * Transacted looks like a withdrawal. Its relayer calls the vault directly and
 * binds PayoutRouting{recipient: feeRecipient, feeAmount: 0}; a withdrawal
 * goes through a processor (self-relays included) or binds other data.
 */
export async function isPrivacyPoolsV2RelayedTransfer(
  log: Log,
  context: PrivacyRpcContext,
): Promise<boolean> {
  if (log.topics[0] !== TRANSACTED_TOPIC) {
    return false
  }

  const transaction = await context.receipts.getTransaction(log.transactionHash)
  if (
    transaction.to === undefined ||
    transaction.data === undefined ||
    EthereumAddress(transaction.to) !== EthereumAddress(log.address)
  ) {
    return false
  }

  let routing: utils.Result
  try {
    const call = poolVaultInterface.decodeFunctionData(
      'transact',
      transaction.data,
    )
    routing = utils.defaultAbiCoder.decode(
      [PAYOUT_ROUTING],
      call._transactParams.data,
    )[0]
  } catch {
    return false
  }

  return (
    EthereumAddress(routing.recipient) ===
      EthereumAddress(routing.feeRecipient) && routing.feeAmount.isZero()
  )
}
