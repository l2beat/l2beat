import { ProjectId } from '@l2beat/shared-pure'
import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/components/content-wrapper'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { env } from '~/env'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'
import { ps } from '~/server/projects'
import { HydrateClient } from '~/trpc/server'
import { getProjectMetadata } from '~/utils/metadata'
import { EthereumDaProjectSummary } from '../_components/ethereum-da-project-summary'
import { RegularDaProjectSummary } from '../_components/regular-da-project-summary'

interface Props {
  params: Promise<{
    layer: string
    bridge: string
  }>
}

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []

  const [layers, bridges] = await Promise.all([
    ps.getProjects({ select: ['daLayer'] }),
    ps.getProjects({ select: ['daBridge'] }),
  ])

  return layers.flatMap((layer) => {
    const pairs: { layer: string; bridge: string }[] = []
    if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
      pairs.push({ layer: layer.slug, bridge: 'no-bridge' })
    }
    const daBridges = bridges.filter((x) => x.daBridge.daLayer === layer.id)
    for (const bridge of daBridges) {
      pairs.push({ layer: layer.slug, bridge: bridge.slug })
    }
    return pairs
  })
}

export async function generateMetadata(props: Props) {
  const params = await props.params

  const [layer, bridge] = await Promise.all([
    ps.getProject({ slug: params.layer, select: ['display'] }),
    params.bridge !== 'no-bridge'
      ? ps.getProject({ slug: params.bridge, select: ['daBridge'] })
      : undefined,
  ])

  if (
    !layer ||
    (params.bridge !== 'no-bridge' &&
      (!bridge || bridge.daBridge.daLayer !== layer.id))
  ) {
    notFound()
  }
  return getProjectMetadata({
    project: {
      name: layer.name,
      description: layer.display.description,
    },
    metadata: {
      openGraph: {
        url: `/data-availability/projects/${layer.slug}/${bridge?.slug ?? 'no-bridge'}`,
      },
    },
  })
}

export default async function Page(props: Props) {
  const params = await props.params

  const pageData = await getPageData(params)

  if (!pageData) {
    return notFound()
  }

  const { entry, summaryComponent } = pageData

  const navigationSections = projectDetailsToNavigationSections(entry.sections)
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <HydrateClient>
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 md:hidden">
          <MobileProjectNavigation sections={navigationSections} />
        </div>
      )}
      {summaryComponent}
      <ContentWrapper mobileFull>
        {isNavigationEmpty ? (
          <ProjectDetails items={entry.sections} />
        ) : (
          <div className="gap-x-12 md:flex">
            <div className="mt-10 hidden w-[242px] shrink-0 md:block">
              <DesktopProjectNavigation
                project={{
                  title: entry.name,
                  slug: entry.slug,
                  isUnderReview: entry.isUnderReview,
                }}
                sections={navigationSections}
                projectVariants={entry.projectVariants}
              />
            </div>
            <div className="w-full">
              <HighlightableLinkContextProvider>
                <ProjectDetails items={entry.sections} />
              </HighlightableLinkContextProvider>
            </div>
          </div>
        )}
      </ContentWrapper>
    </HydrateClient>
  )
}

async function getPageData(params: { layer: string; bridge: string }) {
  const layer = await ps.getProject({
    slug: params.layer,
    select: ['daLayer', 'display', 'statuses'],
    optional: ['isUpcoming', 'milestones'],
  })

  if (!layer) {
    notFound()
  }
  if (layer.id === ProjectId.ETHEREUM) {
    const bridge = await ps.getProject({
      slug: params.bridge,
      select: ['daBridge', 'display'],
      optional: ['contracts'],
    })
    if (!bridge || bridge.id !== layer.id) {
      notFound()
    }

    const entry = await getEthereumDaProjectEntry(layer, bridge)
    return {
      entry,
      summaryComponent: <EthereumDaProjectSummary project={entry} />,
    }
  }

  const entry = await getDaProjectEntry(layer, params.bridge)
  if (!entry) {
    notFound()
  }

  return {
    entry,
    summaryComponent: <RegularDaProjectSummary project={entry} />,
  }
}
