import type { Hex } from 'viem'

/**
 * The attester key comes from the environment, never a flag, so it cannot
 * land in shell history. On a testnet it must be a throwaway EOA with no
 * link to L2BEAT.
 */
export function readAttesterKey(): Hex {
  const key = process.env.L2B_CROPS_PRIVATE_KEY
  if (!key) {
    throw new Error(
      'L2B_CROPS_PRIVATE_KEY is not set. Export the attester key in the shell you run this from - it is deliberately not a command line flag, so it never lands in shell history.',
    )
  }
  return `0x${key.replace(/^0x/, '')}`
}
