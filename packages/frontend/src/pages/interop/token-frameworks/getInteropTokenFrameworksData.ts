import { ProjectId } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

const TOKEN_FRAMEWORKS: { id: string; label: string; projectId: ProjectId }[] =
  [
    { id: 'oft', label: 'OFT', projectId: ProjectId('layerzero') },
    { id: 'cct', label: 'CCT', projectId: ProjectId('ccip') },
    { id: 'warp', label: 'Warp', projectId: ProjectId('hyperlane-hwr') },
    { id: 'ntt', label: 'NTT', projectId: ProjectId('wormhole-ntt') },
    { id: 'its', label: 'ITS', projectId: ProjectId('axelar-its') },
  ]

export type InteropTokenFramework = {
  id: string
  label: string
  slug: string
  name: string
  iconUrl: string
}

export async function getInteropTokenFrameworksData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const [appLayoutProps, tokenFrameworks] = await Promise.all([
    getAppLayoutProps(),
    getTokenFrameworks(manifest),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Token frameworks - L2BEAT',
        description:
          'Overview of token frameworks used across interop protocols.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/token-frameworks/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropTokenFrameworksPage',
      props: {
        ...appLayoutProps,
        tokenFrameworks,
      },
    },
  }
}

async function getTokenFrameworks(
  manifest: Manifest,
): Promise<InteropTokenFramework[]> {
  const projects = await ps.getProjects({ select: ['interopConfig'] })
  const projectsById = new Map(
    projects.map((project) => [project.id.toString(), project]),
  )

  return TOKEN_FRAMEWORKS.map((framework) => {
    const project = projectsById.get(framework.projectId)

    if (!project) {
      throw new Error(
        `Token framework project not found: ${framework.projectId}`,
      )
    }

    return {
      ...framework,
      slug: project.slug,
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    }
  })
}
