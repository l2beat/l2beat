import { assert, assertUnreachable } from '@l2beat/shared-pure'

import { byteArrToNumber } from './utils'

export function calculateDelaysFromSegments(
  segments: unknown[],
  submissionTimestamp: number,
) {
  let timestamp = 0
  let txCount = 0
  let maxDelay = 0
  let accDelay = 0n
  for (const segment of segments) {
    assert(segment instanceof Uint8Array, 'Expected segment to be Uint8Array')
    const action = decodeSegment(segment)
    if (!action) continue
    switch (action.type) {
      case 'AdvanceTimestamp':
        timestamp += action.timestamp
        break
      case 'AddTransactions': {
        txCount += action.txCount
        const delay = submissionTimestamp - timestamp
        assert(delay >= 0, 'Delay should be positive')
        if (maxDelay === 0) {
          maxDelay = delay
        }
        accDelay += BigInt(action.txCount) * BigInt(delay)
        break
      }
      default:
        assertUnreachable(action)
    }
  }
  const minDelay = submissionTimestamp - timestamp
  assert(maxDelay >= 0, 'Max delay should be positive')
  assert(maxDelay >= minDelay, 'Max delay should be greater than min delay')
  const avgDelayBigInt = accDelay / BigInt(txCount)
  assert(
    avgDelayBigInt <= Number.MAX_SAFE_INTEGER,
    'Average delay is too large',
  )
  const avgDelay = Number(avgDelayBigInt)
  return { avgDelay, minDelay, maxDelay }
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
