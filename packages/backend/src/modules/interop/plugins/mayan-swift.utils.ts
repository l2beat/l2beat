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
