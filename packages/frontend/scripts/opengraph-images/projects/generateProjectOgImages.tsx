import type { Project } from '@l2beat/config'
import type { OpengraphKit } from '~/components/opengraph-image/heartbeat/render'
import { renderOpengraphPng } from '~/components/opengraph-image/heartbeat/render'
import { ProjectOpengraphImage } from '~/components/opengraph-image/Project'
import { ps } from '~/server/projects'
import { writeIfMissing } from './writeIfMissing'

type ProjectPageType = ReturnType<typeof getOpengraphProjectTypes>[number]

export async function generateProjectOgImages(kit: OpengraphKit) {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'zkCatalogInfo',
      'interopConfig',
      'privacyInfo',
      'defiInfo',
    ],
  })

  for (const project of projects) {
    for (const type of getOpengraphProjectTypes(project)) {
      await writeIfMissing(
        'PROJECT DETAILS',
        `${type}/projects/${project.slug}`,
        project.name,
        () =>
          renderOpengraphPng(
            <ProjectOpengraphImage
              measure={kit.measure}
              label={getLabel(project, type)}
              name={
                type === 'interop'
                  ? (project.interopConfig?.name ?? project.name)
                  : project.name
              }
              shortName={project.shortName}
            />,
            kit,
          ),
      )
    }
  }

  await writeIfMissing('PROJECT DETAILS', 'projects/ethereum', 'Ethereum', () =>
    renderOpengraphPng(
      <ProjectOpengraphImage
        measure={kit.measure}
        label="Layer 1"
        name="Ethereum"
      />,
      kit,
    ),
  )
}

/** The project's type only: a stage or a category would leave a stale image behind when it changes. */
function getLabel(
  project: Project<never, 'scalingInfo'>,
  type: ProjectPageType,
) {
  switch (type) {
    case 'layer2s':
      return project.scalingInfo?.layer === 'layer3' ? 'Layer 3' : 'Layer 2'
    case 'zk-catalog':
      return 'ZK catalog'
    case 'interop':
      return 'Interop'
    case 'privacy':
      return 'Privacy'
    case 'defi':
      return 'DeFi'
  }
}

export function getOpengraphProjectTypes(
  project: Project<
    never,
    | 'scalingInfo'
    | 'zkCatalogInfo'
    | 'interopConfig'
    | 'privacyInfo'
    | 'defiInfo'
  >,
) {
  const types: ('layer2s' | 'zk-catalog' | 'interop' | 'privacy' | 'defi')[] =
    []
  if (project.scalingInfo) {
    types.push('layer2s')
  }
  if (project.zkCatalogInfo) {
    types.push('zk-catalog')
  }
  if (project.interopConfig) {
    types.push('interop')
  }
  if (project.privacyInfo) {
    types.push('privacy')
  }
  if (project.defiInfo) {
    types.push('defi')
  }
  return types
}
