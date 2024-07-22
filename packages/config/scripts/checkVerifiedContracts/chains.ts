import { DaLayer, OnChainDaBridge, getProjectDevIds } from '../../src'
import { Project } from './types'

export function getChainNames(projects: Project[]): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

export function getChainNamesForDA(daLayers: DaLayer[]): string[] {
  return daLayers
    .flatMap(getProjectDevIdsForDA)
    .filter((x, i, a) => a.indexOf(x) === i)
}

export function getProjectDevIdsForDA(daLayer: DaLayer): string[] {
  const addresses = daLayer.bridges
    .filter((b): b is OnChainDaBridge => b.type === 'OnChainBridge')
    .flatMap((b) => b.contracts.addresses)
  const devIds = addresses.map((c) => c.chain ?? 'ethereum')

  return devIds
}
