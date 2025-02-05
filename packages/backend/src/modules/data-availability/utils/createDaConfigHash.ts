import { createHash } from 'crypto'
import type { ProjectDaTrackingConfig } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

export function getDaLayerConfigHash(minHeight: number, layer: string) {
  return createHash('sha1')
    .update(`${minHeight}-${layer}`)
    .digest('hex')
    .slice(0, 12)
}

export function getDaProjectsConfigHash(
  minHeight: number,
  projectConfigs: ProjectDaTrackingConfig[],
) {
  const ids: string[] = []

  ids.push(minHeight.toString())

  for (const config of projectConfigs) {
    ids.push(createProjectId(config))
  }

  const sortedInput = ids.sort((a, b) => a.localeCompare(b))

  const hash = createHash('sha1').update(sortedInput.join('')).digest('hex')
  return hash.slice(0, 12)
}

function createProjectId(config: ProjectDaTrackingConfig): string {
  if (config.type === 'ethereum') {
    let base = `${config.type}-${config.inbox}`

    if (config.sequencers) {
      base += `-${config.sequencers.join(',')}`
    }

    return base
  }

  if (config.type === 'celestia') {
    let base = `${config.type}-${config.namespace}`

    if (config.signers) {
      base += `-${config.signers.join(',')}`
    }

    return base
  }

  if (config.type === 'avail') {
    return `${config.type}-${config.appId}`
  }

  assertUnreachable(config)
}
