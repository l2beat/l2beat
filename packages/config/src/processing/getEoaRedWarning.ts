import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import type { ProjectRedWarning } from '../types'

const EOA_RED_WARNING: ProjectRedWarning = {
  text: 'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
  detailAnchor: 'permissions',
}

const paths = getDiscoveryPaths()
const configReader = new ConfigReader(paths.discovery)

export function hasEoaWithUpgradePermissions(projectName: string): boolean {
  try {
    const discovery = configReader.readDiscovery(projectName)
    return discovery.entries.some(
      (entry) => entry.eoaWithUpgradePermissions === true,
    )
  } catch {
    return false
  }
}

export function getEoaUpgradeRedWarning(
  projectName: string,
  manualRedWarning: ProjectRedWarning | undefined,
): ProjectRedWarning | undefined {
  if (manualRedWarning !== undefined) {
    return manualRedWarning
  }
  if (hasEoaWithUpgradePermissions(projectName)) {
    return EOA_RED_WARNING
  }
  return undefined
}
