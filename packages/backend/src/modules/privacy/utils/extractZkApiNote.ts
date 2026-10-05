import type { PrivacyAnonymitySetEventRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyRpcLog } from '../types'

const abi = new utils.Interface([
  'event NoteDeposited(uint32 indexed noteId, bytes32 indexed commitment, uint128 amount, uint64 expiryTs, uint256 newRoot)',
  'event MutualClose(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
  'event EscapeWithdrawalInitiated(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination, uint64 challengeDeadline, uint256 newRoot)',
  'event EscapeWithdrawalChallenged(uint32 indexed noteId, uint256 nullifier, uint256 restoredRoot)',
  'event EscapeWithdrawalFinalized(uint32 indexed noteId, uint256 nullifier, uint128 finalBalance, address destination)',
  'event ExpiredClaimed(uint32 indexed noteId, uint128 depositAmount, uint256 newRoot)',
])

export const ZK_API_NOTE_EVENTS = Object.values(abi.events).map((event) =>
  abi.getEventTopic(event),
)

export function extractZkApiNote(
  log: PrivacyRpcLog,
  weiPerUnit: string,
): {
  amount: bigint
  note: NonNullable<PrivacyAnonymitySetEventRecord['note']>
} {
  const parsed = abi.parseLog(log)
  const deposit = parsed.name === 'NoteDeposited'
  return {
    amount: deposit
      ? BigInt(parsed.args.amount.toString()) * BigInt(weiPerUnit)
      : 0n,
    note: {
      id: parsed.args.noteId,
      active: deposit || parsed.name === 'EscapeWithdrawalChallenged',
      expiresAt: deposit ? UnixTime(Number(parsed.args.expiryTs)) : null,
    },
  }
}
