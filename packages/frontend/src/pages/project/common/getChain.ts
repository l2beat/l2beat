import { type Bridge, type Layer2, type Layer3 } from '@l2beat/config'

export function getChain(
  project: Layer2 | Bridge | Layer3,
  permissionOrContract: { chain?: string },
) {
  if (permissionOrContract.chain) {
    return permissionOrContract.chain
  }

  if (project.type === 'layer3') {
    return project.hostChain
  }

  return 'ethereum'
}
