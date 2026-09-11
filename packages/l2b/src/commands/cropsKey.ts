import type { Hex } from 'viem'

/**
 * The attester key comes from the environment, never a flag, so it cannot
 * land in shell history. Absent, a command is a dry run. On a testnet it
 * must be a throwaway EOA with no link to L2BEAT.
 */
export function readAttesterKey(): Hex | undefined {
  const key = process.env.L2B_CROPS_PRIVATE_KEY
  return key ? `0x${key.replace(/^0x/, '')}` : undefined
}
