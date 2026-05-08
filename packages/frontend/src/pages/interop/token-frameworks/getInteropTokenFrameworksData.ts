import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getInteropChains } from '~/server/features/scaling/interop/utils/getInteropChains'
import { TOKEN_FRAMEWORKS } from '~/server/features/scaling/interop/utils/tokenFrameworksList'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import type { InteropChainWithIcon } from '../components/chain-selector/types'

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

  const interopChains = getInteropChains()
  const interopChainsWithIcons: InteropChainWithIcon[] = interopChains
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => ({
      ...chain,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    }))

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
        interopChains: interopChainsWithIcons,
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
      id: framework.id,
      label: framework.label,
      slug: project.slug,
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    }
  })
}
