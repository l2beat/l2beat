/** Brand colors for each chain used by particles and connection highlights. */
const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  arbitrum: '#28A0F0',
  base: '#0052FF',
  optimism: '#FF0420',
  apechain: '#0054FA',
  polygonpos: '#8247E5',
  zksync2: '#4E529A',
  abstract: '#00FF94',
  katana: '#E11D48',
  bsc: '#F0B90B',
  solana: '#9945FF',
  starknet: '#EC796B',
  ink: '#B87FFF',
  megaeth: '#FF6B00',
  worldchain: '#1DC99E',
  celo: '#FCFF52',
  unichain: '#FF007A',
  forknet: '#8B5CF6',
  linea: '#61DFFF',
  avalanche: '#E84142',
  hyperevm: '#3CFF72',
}

const CHAIN_COLORS_BRIGHT: Record<string, string> = {
  ethereum: '#8CA2F0',
  arbitrum: '#5BB8F5',
  base: '#4D88FF',
  optimism: '#FF4D63',
  apechain: '#4D88FF',
  polygonpos: '#A87BEE',
  zksync2: '#7B7FC2',
  abstract: '#4DFFB3',
  katana: '#F04D73',
  bsc: '#F5CC4D',
  solana: '#B87AFF',
  starknet: '#F2A498',
  ink: '#CFA4FF',
  megaeth: '#FF944D',
  worldchain: '#5BE0B8',
  celo: '#FDFF8A',
  unichain: '#FF4DA0',
  forknet: '#A88CFA',
  linea: '#8DE8FF',
  avalanche: '#EF7A7B',
  hyperevm: '#72FF9E',
}

/** Fallback: evenly spaced hue for unknown chain IDs. */
function fallbackColor(index: number, total: number, bright: boolean): string {
  const hue = (index * 360) / Math.max(total, 1)
  return bright ? `hsl(${hue}, 80%, 70%)` : `hsl(${hue}, 70%, 60%)`
}

/**
 * Returns the brand color for a chain. The `bright` variant is used
 * for particles (needs to pop against the background).
 */
export function getChainColor(
  chainId: string,
  index: number,
  total: number,
  bright?: boolean,
): string {
  const map = bright ? CHAIN_COLORS_BRIGHT : CHAIN_COLORS
  return map[chainId] ?? fallbackColor(index, total, !!bright)
}
