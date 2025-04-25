import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'

export async function getEcosystemProjectData(
  manifest: Manifest,
  slug: string,
): Promise<RenderData | undefined> {
  const [appLayoutProps, ecosystem] = await Promise.all([
    getAppLayoutProps(),
    getEcosystemEntry(slug),
  ])

  if (!ecosystem) {
    return undefined
  }

  return {
    head: {
      manifest,
      title: `${ecosystem.name} - L2BEAT`,
      description: 'Some description',
    },
    ssr: {
      page: 'EcosystemProjectPage',
      props: {
        ...appLayoutProps,
        ecosystem,
      },
    },
  }
}
