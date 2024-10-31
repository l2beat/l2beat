import { daLayers } from '@l2beat/config/build/src/projects/other/da-beat/index'
import { notFound } from 'next/navigation'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { getDaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { DaProjectSummary } from '../_components/da-project-summary'
import { getProjectMetadata } from '~/utils/metadata'

interface Props {
  params: Promise<{
    layer: string
    bridge: string
  }>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const layer = daLayers.find((layer) => layer.display.slug === params.layer)
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
      name: `${layer.display.name} with ${bridge.display.name}`,
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
  const daLayer = daLayers.find((p) => p.display.slug === params.layer)
  if (!daLayer) return notFound()
  const daBridge = daLayer.bridges.find((b) => b.display.slug === params.bridge)
  if (!daBridge) return notFound()

  const daProjectEntry = await getDaProjectEntry(daLayer, daBridge)

  const navigationSections = projectDetailsToNavigationSections(
    daProjectEntry.projectDetails,
  )
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <>
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 md:hidden">
          <MobileProjectNavigation sections={navigationSections} />
        </div>
      )}
      <DaProjectSummary project={daProjectEntry} />
      {isNavigationEmpty ? (
        <ProjectDetails items={daProjectEntry.projectDetails} />
      ) : (
        <div className="gap-x-12 md:flex">
          <div className="mt-10 hidden w-[242px] shrink-0 md:block">
            <DesktopProjectNavigation
              project={{
                title: daProjectEntry.name,
                slug: daLayer.display.slug,
                showProjectUnderReview: daProjectEntry.isUnderReview,
              }}
              sections={navigationSections}
              projectVariants={daLayer.bridges.map((bridge) => ({
                title: bridge.display.name,
                href: `/data-availability/projects/${daLayer.display.slug}/${bridge.display.slug}`,
              }))}
            />
          </div>
          <div className="w-full">
            <HighlightableLinkContextProvider>
              <ProjectDetails items={daProjectEntry.projectDetails} />
            </HighlightableLinkContextProvider>
          </div>
        </div>
      )}
    </>
  )
}
