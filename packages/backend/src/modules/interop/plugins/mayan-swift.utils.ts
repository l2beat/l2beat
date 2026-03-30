import { decodeFunctionData, parseAbi } from 'viem'
import { BinaryReader } from '../../../tools/BinaryReader'

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

const mayanSwiftFulfillAbi = parseAbi([
  'function fulfillOrder(uint256 fulfillAmount, bytes encodedVm, bytes32 recepient, bool batch)',
  'function fulfillSimple(uint256 fulfillAmount, bytes32 orderHash, uint16 srcChainId, bytes32 tokenIn, uint8 protocolBps, (bytes32, bytes32, uint64, uint64, uint64, uint64, uint64, bytes32, uint16, bytes32, uint8, uint8, bytes32), bytes32 recepient, bool batch)',
])

const mayanSwiftFulfillWrapperAbi = parseAbi([
  'function fulfillWithERC20(address tokenIn, uint256 amountIn, address router, address allowanceTarget, bytes swapCalldata, address mayan, bytes mayanCalldata, (uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s))',
  'function directFulfill(address tokenIn, uint256 amountIn, address mayan, bytes mayanCalldata, (uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s))',
])

// Message format:
// - UNLOCK: 0x02 + orderKey(32) + dstChainId(2) + tokenAddr(32) + recipient(32)
// - BATCH_UNLOCK: 0x04 + count(2) + [orderKey(32) + dstChainId(2) + tokenAddr(32) + recipient(32)] * count
// Entry size is 98 bytes.
const MAYAN_SWIFT_UNLOCK_MIN_BYTES = 34
const MAYAN_SWIFT_BATCH_ENTRY_BYTES = 98

function decodeMayanSwiftSettlementPayload(
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

export function extractMayanSwiftFulfillSourceChainFromTxData(
  txData: string | undefined,
): number | undefined {
  try {
    if (!txData) return undefined
    return extractMayanSwiftFulfillSourceChainFromCallData(
      txData as `0x${string}`,
    )
  } catch {
    return undefined
  }
}

function extractMayanSwiftFulfillSourceChainFromCallData(
  txData: `0x${string}`,
): number | undefined {
  try {
    const decoded = decodeFunctionData({
      abi: mayanSwiftFulfillAbi,
      data: txData,
    })

    if (decoded.functionName === 'fulfillOrder') {
      const encodedVm = decoded.args[1]
      if (typeof encodedVm !== 'string') return undefined
      return extractMayanSwiftFulfillSourceChainFromVaa(encodedVm)
    }

    if (decoded.functionName === 'fulfillSimple') {
      return decoded.args[2]
    }
  } catch {}

  try {
    const decoded = decodeFunctionData({
      abi: mayanSwiftFulfillWrapperAbi,
      data: txData,
    })
    if (
      decoded.functionName !== 'fulfillWithERC20' &&
      decoded.functionName !== 'directFulfill'
    ) {
      return undefined
    }

    const mayanCalldata =
      decoded.functionName === 'fulfillWithERC20'
        ? decoded.args[6]
        : decoded.args[3]
    if (typeof mayanCalldata !== 'string') return undefined
    return extractMayanSwiftFulfillSourceChainFromCallData(mayanCalldata)
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

function extractMayanSwiftFulfillSourceChainFromVaa(
  encodedVm: `0x${string}`,
): number | undefined {
  try {
    const payload = extractWormholePayloadFromVaa(encodedVm)
    if (!payload) return undefined

    const reader = new BinaryReader(payload)
    if (reader.length < 35) return undefined
    const action = reader.readUint8()
    if (action !== 1) return undefined
    reader.skipBytes(32)
    return reader.readUint16()
  } catch {
    return undefined
  }
}

function extractWormholePayloadFromVaa(
  encodedVm: `0x${string}`,
): `0x${string}` | undefined {
  try {
    const reader = new BinaryReader(encodedVm)
    reader.skipBytes(1 + 4)
    const signatures = reader.readUint8()
    reader.skipBytes(signatures * 66)
    reader.skipBytes(4 + 4 + 2 + 32 + 8 + 1)
    return reader.readRemainingBytes() as `0x${string}`
  } catch {
    return undefined
  }
}
