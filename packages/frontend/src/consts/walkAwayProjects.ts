export const WALK_AWAY_PASSED_PROJECTS = [
  'arbitrum',
  'base',
  'optimism',
  'ink',
  'unichain',
  'facet',
  'ethscriptions',
  'aztecnetwork',
  'aztecnetworkv6',
  'dydx',
  'fuelv1',
]

export const WALK_AWAY_NOT_PASSED_PROJECTS = [
  'starknet',
  'aztec',
  'aztecconnect',
  'cartesi-prt-honeypot',
  'degate',
  'degate2',
  'degate3',
  'kinto',
  'apex-pro',
  'astarzkevm',
  'canvasconnect',
  'deversifi',
  'edgex',
  'form',
  'forknet',
  'gluon',
  'gmnetwork',
  'gpt',
  'hermez',
  'immutablex',
  'jovay',
  'layer2finance',
  'layer2financezk',
  'omgnetwork',
  'reddioex',
  'ternoa',
  'wirex',
  'witness',
  'zkswap',
  'zkswap2',
]

/** An archived project that was not cleared above does not pass. */
export function getWalkAwayVerdict(id: string, isArchived: boolean) {
  if (WALK_AWAY_PASSED_PROJECTS.includes(id)) return 'passed'
  if (WALK_AWAY_NOT_PASSED_PROJECTS.includes(id) || isArchived) {
    return 'not-passed'
  }
  return undefined
}
