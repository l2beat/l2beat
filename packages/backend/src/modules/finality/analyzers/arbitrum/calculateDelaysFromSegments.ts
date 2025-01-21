import { assert, assertUnreachable } from '@l2beat/shared-pure'

import type { RlpSerializable } from '../../utils/rlpDecode'
import type { L2Block } from '../types/BaseAnalyzer'
import { byteArrToNumber } from './utils'

// NOTE(radomski): Unless we're going to be computing the state update delay
// for Arbitrum this is not required. Even in the case in which we start work
// on state update delays for Orbit chains the approach might not require
// having correct block numbers.
//
// https://docs.arbitrum.io/how-arbitrum-works/inside-arbitrum-nitro#sequencing-followed-by-deterministic-execution
// The problem with block numbers on arbitrum is that state and L2 blocks are
// processed after the tx is submitted to L1. Because the submitted
// transactions does not yet have a clearly assigned block we only know the
// timestamp of it for sure.
//
// For now, we only use it for liveness which only requires computing a delay
// between L1 and L2 when it comes to inclusion of data. L2 block numbers are
// not used there.
const WE_DONT_KNOW_IT_BUT_ITS_NOT_REQUIRED = 0xdead

export function calculateDelaysFromSegments(
  segments: RlpSerializable[],
): L2Block[] {
  let timestamp = 0
  const blocks: L2Block[] = []

  for (const segment of segments) {
    assert(segment instanceof Uint8Array, 'Expected segment to be Uint8Array')
    const action = decodeSegment(segment)
    if (!action) continue
    switch (action.type) {
      case 'AdvanceTimestamp':
        timestamp += action.timestamp
        break
      case 'AddTransactions': {
        assert(timestamp >= 0, 'Timestamp should be positive')
        blocks.push({
          timestamp: timestamp,
          blockNumber: WE_DONT_KNOW_IT_BUT_ITS_NOT_REQUIRED,
        })
        break
      }
      default:
        assertUnreachable(action)
    }
  }

  return blocks
}

// Arbitrum segment kinds:
const L2MessageKind = 0
const L2MessageBrotliKind = 1
const DelayedMessagesKind = 2
const AdvanceTimestampKind = 3
const AdvanceL1BlockNumberKind = 4

// L2Message kinds:
// https://github.com/OffchainLabs/nitro/blob/f93d2c38ae438066fd46c529694582c57bec4848/arbos/parse_l2.go#L92-L93
const BatchMsgKind = 3

interface AdvanceTimestampAction {
  type: 'AdvanceTimestamp'
  timestamp: number
}

interface AddTransactionsAction {
  type: 'AddTransactions'
  txCount: number
}

type Action = AdvanceTimestampAction | AddTransactionsAction

function decodeSegment(segment: Uint8Array): Action | undefined {
  const segmentKind = segment[0]
  const segmentData = segment.slice(1)
  switch (segmentKind) {
    case L2MessageKind: {
      const msgKind = segmentData[0]
      if (msgKind === BatchMsgKind) {
        const txCount = countTxsInL2MessageBatch(segmentData.slice(1))
        return { type: 'AddTransactions', txCount }
      } else {
        return { type: 'AddTransactions', txCount: 1 }
      }
    }
    case L2MessageBrotliKind:
      // same as L2Message, but with brotli compression
      // not implemented yet as I do not have an example to test
      throw new Error('Not implemented')
    case AdvanceTimestampKind:
      return {
        type: 'AdvanceTimestamp',
        timestamp: byteArrToNumber(segmentData),
      }
    case AdvanceL1BlockNumberKind:
    case DelayedMessagesKind:
      break
    default:
      throw new Error(`Unknown segment kind: ${segmentKind}`)
  }
}

function countTxsInL2MessageBatch(l2Message: Uint8Array) {
  let totalRead = 0
  for (let i = 0; ; i++) {
    const lengthBytes = l2Message.subarray(totalRead, totalRead + 8)
    const length = byteArrToNumber(lengthBytes)
    totalRead += length + 8
    if (totalRead >= l2Message.length) return i + 1
  }
}
