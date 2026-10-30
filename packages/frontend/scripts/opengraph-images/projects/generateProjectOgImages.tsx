import type { Project } from '@l2beat/config'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { OpengraphKit } from '~/components/opengraph-image/heartbeat/render'
import { renderOpengraphPng } from '~/components/opengraph-image/heartbeat/render'
import { ProjectOpengraphImage } from '~/components/opengraph-image/Project'
import { ps } from '~/server/projects'

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
        `${type}/projects/${project.slug}`,
        project.name,
        () =>
          renderOpengraphPng(
            <ProjectOpengraphImage
              measure={kit.measure}
              label={getLabel(project, type)}
              logoSrc={getLogoSrc(project.slug)}
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

  await writeIfMissing('projects/ethereum', 'Ethereum', () =>
    renderOpengraphPng(
      <ProjectOpengraphImage
        measure={kit.measure}
        label="Layer 1"
        logoSrc={getLogoSrc('ethereum')}
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

function getLogoSrc(slug: string) {
  const file = path.join(process.cwd(), 'static/icons', `${slug}.png`)
  return `data:image/png;base64,${readFileSync(file).toString('base64')}`
}

async function writeIfMissing(
  pagePath: string,
  name: string,
  render: () => Promise<Buffer>,
) {
  const outputDir = path.join(process.cwd(), 'static/meta-images', pagePath)
  const outputFile = path.join(outputDir, 'opengraph-image.png')
  if (existsSync(outputFile)) {
    return
  }
  console.time(`[PROJECT DETAILS] ${name}`)
  const pngBuffer = await render()
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputFile, pngBuffer)
  console.timeEnd(`[PROJECT DETAILS] ${name}`)
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
