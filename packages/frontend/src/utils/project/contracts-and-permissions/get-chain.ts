import type { Bridge, DaBridge, DaLayer, Layer2, Layer3 } from '@l2beat/config'

type BaseProjectParams =
  | {
      type: (Layer2 | Bridge | DaLayer | DaBridge)['type']
    }
  | {
      type: Layer3['type']
      hostChain: string
    }

export function getChain(
  projectParams: BaseProjectParams,
  permissionOrContract: { chain?: string },
) {
  if (permissionOrContract.chain) {
    return permissionOrContract.chain
  }

  if (projectParams.type === 'layer3') {
    return projectParams.hostChain
  }

  return 'ethereum'
}
