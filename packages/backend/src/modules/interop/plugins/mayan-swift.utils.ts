import { decodeFunctionData, parseAbi } from 'viem'
import { BinaryReader } from '../../../tools/BinaryReader'
import { MAYAN_SWIFT, MAYAN_SWIFT_CHAINS } from './mayan-shared'

export { MAYAN_SWIFT, MAYAN_SWIFT_CHAINS }

export const MAYAN_SWIFT_MSG_TYPE_UNLOCK = 0x02
export const MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK = 0x04

interface MayanSwiftUnlockPayload {
  msgType: typeof MAYAN_SWIFT_MSG_TYPE_UNLOCK
  key: string
  dstChainId: number
}

interface MayanSwiftBatchUnlockPayload {
  msgType: typeof MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK
  entries: Array<{ key: string; dstChainId: number }>
}

type MayanSwiftSettlementPayload =
  | MayanSwiftUnlockPayload
  | MayanSwiftBatchUnlockPayload

const mayanSwiftUnlockAbi = parseAbi([
  'function unlockOrder(bytes encodedVm)',
  'function unlockBatch(bytes encodedVm)',
])

// Message format:
// - UNLOCK: 0x02 + orderKey(32) + dstChainId(2) + tokenAddr(32) + recipient(32)
// - BATCH_UNLOCK: 0x04 + count(2) + [orderKey(32) + dstChainId(2) + tokenAddr(32) + recipient(32)] * count
// Entry size is 98 bytes.
const MAYAN_SWIFT_UNLOCK_MIN_BYTES = 34
const MAYAN_SWIFT_BATCH_ENTRY_BYTES = 98

export function decodeMayanSwiftSettlementPayload(
  payload: string,
): MayanSwiftSettlementPayload | undefined {
  try {
    const reader = new BinaryReader(payload)
    if (reader.length < 1) return undefined

    const msgType = reader.readUint8()

    if (msgType === MAYAN_SWIFT_MSG_TYPE_UNLOCK) {
      if (reader.length < MAYAN_SWIFT_UNLOCK_MIN_BYTES) return undefined
      return {
        msgType,
        key: reader.readBytes(32),
        dstChainId: reader.readUint16(),
      }
    }

    if (msgType === MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK) {
      if (reader.length < 2) return undefined
      const count = reader.readUint16()
      const entries: Array<{ key: string; dstChainId: number }> = []

      for (let i = 0; i < count; i++) {
        if (reader.length < MAYAN_SWIFT_BATCH_ENTRY_BYTES) break
        const key = reader.readBytes(32)
        const dstChainId = reader.readUint16()
        reader.skipBytes(64) // tokenAddr(32) + recipient(32)
        entries.push({ key, dstChainId })
      }

      if (entries.length === 0) return undefined
      return { msgType, entries }
    }
  } catch {
    return undefined
  }
}

export function getMayanSwiftSettlementMsgType(
  payload: string,
): number | undefined {
  return decodeMayanSwiftSettlementPayload(payload)?.msgType
}

export function extractMayanSwiftSettlementOrderKey(
  payload: string,
): string | undefined {
  const decoded = decodeMayanSwiftSettlementPayload(payload)
  if (!decoded || decoded.msgType !== MAYAN_SWIFT_MSG_TYPE_UNLOCK) return
  return decoded.key
}

export function extractMayanSwiftSettlementDestChain(
  payload: string,
): number | undefined {
  const decoded = decodeMayanSwiftSettlementPayload(payload)
  if (!decoded || decoded.msgType !== MAYAN_SWIFT_MSG_TYPE_UNLOCK) return
  return decoded.dstChainId
}

export function extractMayanSwiftBatchOrderKeys(
  payload: string,
): Array<{ key: string; dstChainId: number }> | undefined {
  const decoded = decodeMayanSwiftSettlementPayload(payload)
  if (!decoded || decoded.msgType !== MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK) return
  return decoded.entries
}

// The unlock methods carry Wormhole VAA bytes.
// VAA format starts with:
// version(1) + guardianSetIndex(4) + numSigs(1) + sigs(66*n) + timestamp(4) + nonce(4) + emitterChain(2) + ...
export function extractWormholeEmitterChainFromTxData(
  txData: string | undefined,
): number | undefined {
  try {
    if (!txData) return undefined

    const decoded = decodeFunctionData({
      abi: mayanSwiftUnlockAbi,
      data: txData as `0x${string}`,
    })
    if (
      decoded.functionName !== 'unlockOrder' &&
      decoded.functionName !== 'unlockBatch'
    ) {
      return undefined
    }

    const encodedVm = decoded.args[0]
    if (typeof encodedVm !== 'string') return undefined
    return extractWormholeEmitterChainFromVaa(encodedVm)
  } catch {
    return undefined
  }
}

function extractWormholeEmitterChainFromVaa(
  encodedVm: `0x${string}`,
): number | undefined {
  try {
    const reader = new BinaryReader(encodedVm)
    reader.skipBytes(1 + 4) // version + guardianSetIndex
    const signatures = reader.readUint8()
    reader.skipBytes(signatures * 66)
    reader.skipBytes(4 + 4) // timestamp + nonce
    return reader.readUint16()
  } catch {
    return undefined
  }
}
