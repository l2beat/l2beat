import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyFlowExtractResult, PrivacyRpcLog } from '../types'

const tacitPayInterface = new utils.Interface([
  'event Transact(bytes32 indexed nf0, bytes32 indexed nf1, bytes32 outLeaf0, bytes32 outLeaf1, uint256 firstIndex, bytes32 newRoot, address recipient, int256 extAmount, address relayer, uint256 fee, bytes memo0, bytes memo1)',
])

export const TACIT_PAY_TRANSACT_TOPIC =
  tacitPayInterface.getEventTopic('Transact')

type TacitPayAction = 'deposit' | 'transfer' | 'withdrawal'

interface TacitPayTransact {
  action: TacitPayAction
  /** The value that crossed the pool boundary, zero for a transfer. */
  amount: bigint
  recipient: EthereumAddress
  relayer: EthereumAddress
  fee: bigint
}

// One event serves every Tacit Pay action, told apart by the sign of
// extAmount: a deposit is positive, a withdrawal pays -extAmount to the
// recipient, and a private transfer is zero. The relayer's fee is paid out of
// the pool on top of any of them.
export function extractTacitPayTransact(log: PrivacyRpcLog): TacitPayTransact {
  const { args } = tacitPayInterface.parseLog(log)
  const extAmount = BigInt(args.extAmount.toString())
  return {
    action:
      extAmount > 0n ? 'deposit' : extAmount < 0n ? 'withdrawal' : 'transfer',
    amount: extAmount < 0n ? -extAmount : extAmount,
    recipient: EthereumAddress(args.recipient),
    relayer: EthereumAddress(args.relayer),
    fee: BigInt(args.fee.toString()),
  }
}

export function extractTacitPayFlow(
  log: PrivacyRpcLog,
  action: Exclude<TacitPayAction, 'transfer'>,
): PrivacyFlowExtractResult | undefined {
  const transact = extractTacitPayTransact(log)
  return transact.action === action
    ? { count: 1, amount: transact.amount }
    : undefined
}
