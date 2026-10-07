import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { DataPostedSectionProps } from '~/components/projects/sections/data-posted/DataPostedSection'
import { checkIfDataPostedExists } from '~/server/features/data-availability/throughput/utils/checkIfDataPostedExists'
import { ps } from '~/server/projects'
import { optionToRange } from '~/utils/range/range'
import { getDaLayersInfo } from './getDaLayersInfo'

export async function getDataPostedSection(
  project: Project<never | 'scalingInfo', 'archivedAt' | 'daTrackingConfig'>,
): Promise<
  | Pick<
      DataPostedSectionProps,
      'defaultRange' | 'currentDaLayers' | 'pastDaLayers' | 'daTrackingConfig'
    >
  | undefined
> {
  if (!project.daTrackingConfig) return undefined

  const range = project.archivedAt ? optionToRange('max') : optionToRange('1y')
  const [hasData, daLayers] = await Promise.all([
    checkIfDataPostedExists(project.id, range[0] ?? undefined),
    ps.getProjects({
      select: ['daLayer'],
    }),
  ])
  if (!hasData) return undefined

  const { currentDaLayers, pastDaLayers } = getDaLayersInfo(
    project.daTrackingConfig,
    daLayers,
  )

  const daTrackingConfig = project.daTrackingConfig.map((config) => {
    const daLayer = daLayers.find((d) => d.id === config.daLayer)
    assert(daLayer, 'Da layer not found')
    return {
      ...config,
      daLayerName: daLayer.name,
    }
  })

  return {
    defaultRange: range,
    currentDaLayers,
    pastDaLayers,
    daTrackingConfig,
  }
}
