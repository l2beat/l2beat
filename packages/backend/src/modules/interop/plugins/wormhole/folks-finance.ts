// Folks Finance uses its own chain ID system that differs from Wormhole chain IDs.
// This mapping converts Folks chain IDs to our internal chain names.
// Folks Finance might need a separate plugin in the future if more specific logic is needed.

export const FOLKS_CHAIN_ID_TO_CHAIN: Record<number, string> = {
  100: 'avalanche',
  101: 'ethereum',
  102: 'base',
  103: 'bsc',
  104: 'arbitrum',
  106: 'polygonpos',
  107: 'sei',
  108: 'monad',
}
