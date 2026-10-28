import { toFunctionSelector } from 'viem'

// Getters the decoder reads to show what a call changes. Calls without
// arguments can only reach a contract's own getters, and getters with
// arguments are listed, which keeps /api/read-state from becoming a general
// RPC proxy.
const STATE_READ_ABIS = [
  'function gameImpls(uint32) view returns (address)',
  'function gameArgs(uint32) view returns (bytes)',
  'function initBonds(uint32) view returns (uint256)',
]

const STATE_READ_SELECTORS = new Set(STATE_READ_ABIS.map(toFunctionSelector))

export function isAllowedStateRead(data: `0x${string}`): boolean {
  if (data.length === 10) return true
  return STATE_READ_SELECTORS.has(data.slice(0, 10) as `0x${string}`)
}
