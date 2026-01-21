import { EthereumAddress } from '@l2beat/shared-pure'

// Mayan Swift contract address (same on all chains)
export const MAYAN_SWIFT = EthereumAddress(
  '0xC38e4e6A15593f908255214653d3D947CA1c2338',
)

// Extract the destination chain ID from Mayan Swift settlement payload
// Payload format: 0x02 + orderKey(32 bytes) + destChainId(2 bytes) + ...
export function extractMayanSwiftSettlementDestChain(
  payload: string,
): number | undefined {
  try {
    // Skip 0x prefix (2 chars) + message type (2 chars) + order key (64 chars) = 68 chars
    // Then read 2 bytes (4 chars) for chain ID
    if (payload.length < 72) return undefined
    const chainIdHex = payload.slice(68, 72)
    return Number.parseInt(chainIdHex, 16)
  } catch {
    return undefined
  }
}

// Extract the order key from Mayan Swift settlement payload
// Payload format: 0x02 + orderKey(32 bytes) + ...
export function extractMayanSwiftSettlementOrderKey(
  payload: string,
): string | undefined {
  try {
    // Skip 0x prefix (2 chars) + message type (2 chars) = 4 chars
    // Then read 32 bytes (64 chars) for order key
    if (payload.length < 68) return undefined
    return '0x' + payload.slice(4, 68)
  } catch {
    return undefined
  }
}

// Message type constants for Mayan Swift settlement payloads
export const MAYAN_SWIFT_MSG_TYPE_UNLOCK = 0x02
export const MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK = 0x04

// Get the message type from Mayan Swift settlement payload
export function getMayanSwiftSettlementMsgType(
  payload: string,
): number | undefined {
  try {
    if (payload.length < 4) return undefined
    // Skip 0x prefix (2 chars), read message type (2 chars = 1 byte)
    return Number.parseInt(payload.slice(2, 4), 16)
  } catch {
    return undefined
  }
}

// Extract the Wormhole emitter chain ID from transaction input data
// The transaction calls unlockOrder(bytes encodedVm) or unlockBatch(bytes encodedVm)
// VAA structure: version(1) + guardianSetIndex(4) + numSigs(1) + sigs(66*n) + timestamp(4) + nonce(4) + emitterChain(2) + ...
export function extractWormholeEmitterChainFromTxData(
  txData: string | undefined,
): number | undefined {
  try {
    if (!txData || txData.length < 2) return undefined

    // Remove 0x prefix
    const data = txData.startsWith('0x') ? txData.slice(2) : txData

    // ABI: selector(4) + offset(32) + length(32) + vaaData
    // In hex chars: selector(8) + offset(64) + length(64) + vaaData
    // VAA starts at char position 136 (68 bytes * 2)
    if (data.length < 136) return undefined

    const vaaStart = 136

    // VAA header: version(1) + guardianSetIndex(4) + numSignatures(1) = 6 bytes = 12 chars
    if (data.length < vaaStart + 12) return undefined

    // Read numSignatures at byte 5 (char 10-11 relative to VAA start)
    const numSignatures = Number.parseInt(
      data.slice(vaaStart + 10, vaaStart + 12),
      16,
    )

    // Skip signatures: 66 bytes each = 132 chars each
    const signaturesSize = numSignatures * 132

    // After signatures: timestamp(4) + nonce(4) = 8 bytes = 16 chars
    // Then emitterChain(2 bytes = 4 chars)
    const emitterChainOffset = vaaStart + 12 + signaturesSize + 16

    if (data.length < emitterChainOffset + 4) return undefined

    const emitterChainHex = data.slice(
      emitterChainOffset,
      emitterChainOffset + 4,
    )
    return Number.parseInt(emitterChainHex, 16)
  } catch {
    return undefined
  }
}

// Extract all order keys from Mayan Swift BATCH_UNLOCK payload
// Payload format: 0x04 + count(2 bytes) + [orderKey(32) + destChainId(2) + tokenAddr(32) + recipient(32)] * count
// Each entry is 98 bytes (32 + 2 + 32 + 32)
export function extractMayanSwiftBatchOrderKeys(
  payload: string,
): Array<{ key: string; dstChainId: number }> | undefined {
  try {
    const msgType = getMayanSwiftSettlementMsgType(payload)
    if (msgType !== MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK) return undefined

    // Skip 0x prefix (2 chars) + message type (2 chars) = 4 chars, then count (4 chars = 2 bytes)
    if (payload.length < 8) return undefined
    const count = Number.parseInt(payload.slice(4, 8), 16)

    const results: Array<{ key: string; dstChainId: number }> = []
    let offset = 8 // Start after 0x + msgType + count

    // Each entry: orderKey (64 chars) + destChainId (4 chars) + tokenAddr (64 chars) + recipient (64 chars) = 196 chars
    const ENTRY_SIZE = 196

    for (let i = 0; i < count; i++) {
      const entryEnd = offset + ENTRY_SIZE
      if (payload.length < entryEnd) break

      const key = '0x' + payload.slice(offset, offset + 64)
      const dstChainId = Number.parseInt(
        payload.slice(offset + 64, offset + 68),
        16,
      )
      results.push({ key, dstChainId })
      offset = entryEnd
    }

    return results.length > 0 ? results : undefined
  } catch {
    return undefined
  }
}
