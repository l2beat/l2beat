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
