import { daLayers, ethereumDaLayer } from '@l2beat/config'
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
  return [...daLayers, ethereumDaLayer].flatMap((layer) =>
    layer.bridges.map((bridge) => ({
      layer: layer.display.slug,
      bridge: bridge.display.slug,
    })),
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const layer = [...daLayers, ethereumDaLayer].find(
    (layer) => layer.display.slug === params.layer,
  )
  if (!layer) {
    notFound()
  }
  const bridge = layer.bridges.find(
    (bridge) => bridge.display.slug === params.bridge,
  )
  if (!bridge) {
    notFound()
  }
  return getProjectMetadata({
    project: {
      name: layer.display.name,
      description: layer.display.description,
    },
    metadata: {
      openGraph: {
        url: `/data-availability/projects/${layer.display.slug}/${bridge.display.slug}`,
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
    <>
      {!isNavigationEmpty && (
        <div className="z-100 sticky top-0 md:hidden">
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
    </>
  )
}

async function getPageData(params: { layer: string; bridge: string }) {
  if (
    params.layer === ethereumDaLayer.display.slug &&
    params.bridge === ethereumDaLayer.bridges[0].display.slug
  ) {
    const entry = await getEthereumDaProjectEntry(ethereumDaLayer)

    return {
      entry,
      summaryComponent: <EthereumDaProjectSummary project={entry} />,
    }
  }

  const daLayer = daLayers.find((p) => p.display.slug === params.layer)
  if (!daLayer) {
    return
  }
  const daBridge = daLayer.bridges.find((b) => b.display.slug === params.bridge)

  if (!daBridge) {
    return
  }

  const entry = await getDaProjectEntry(daLayer, daBridge)

  return {
    entry,
    summaryComponent: <RegularDaProjectSummary project={entry} />,
  }
}
