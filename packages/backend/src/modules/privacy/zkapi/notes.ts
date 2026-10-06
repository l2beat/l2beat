import { UnixTime } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import type { PrivacyNoteEvent, PrivacyRpcLog } from '../types'
import { zkApiInterface } from './abi'

type NoteEventDecoder = (
  parsedLog: utils.LogDescription,
  weiPerUnit: string,
) => PrivacyNoteEvent

const NOTE_EVENT_DECODERS: Partial<Record<string, NoteEventDecoder>> = {
  NoteDeposited: (parsedLog, weiPerUnit) => ({
    type: 'deposit',
    noteId: Number(parsedLog.args.noteId),
    amount: BigInt(parsedLog.args.amount.toString()) * BigInt(weiPerUnit),
    expiresAt: UnixTime(Number(parsedLog.args.expiryTs)),
  }),
  MutualClose: (parsedLog) => toStatusChange(parsedLog, false),
  EscapeWithdrawalInitiated: (parsedLog) => toStatusChange(parsedLog, false),
  // A successful challenge restores the note's root, so it can spend again.
  EscapeWithdrawalChallenged: (parsedLog) => toStatusChange(parsedLog, true),
  EscapeWithdrawalFinalized: (parsedLog) => toStatusChange(parsedLog, false),
  ExpiredClaimed: (parsedLog) => toStatusChange(parsedLog, false),
}

export const ZK_API_NOTE_TOPICS = Object.keys(NOTE_EVENT_DECODERS).map((name) =>
  zkApiInterface.getEventTopic(name),
)

export function extractZkApiNoteEvent(
  log: PrivacyRpcLog,
  weiPerUnit: string,
): PrivacyNoteEvent {
  const parsedLog = zkApiInterface.parseLog(log)
  const decode = NOTE_EVENT_DECODERS[parsedLog.name]
  if (decode === undefined) {
    throw new Error(`Unsupported zkAPI note event ${parsedLog.name}`)
  }
  return decode(parsedLog, weiPerUnit)
}

function toStatusChange(
  parsedLog: utils.LogDescription,
  active: boolean,
): PrivacyNoteEvent {
  return {
    type: 'statusChange',
    noteId: Number(parsedLog.args.noteId),
    active,
  }
}
