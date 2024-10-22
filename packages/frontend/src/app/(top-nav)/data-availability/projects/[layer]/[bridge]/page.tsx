import { daLayers } from '@l2beat/config/build/src/projects/other/da-beat/index'
import { notFound } from 'next/navigation'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { getDaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { DaProjectSummary } from '../_components/da-project-summary'

interface Props {
  params: {
    layer: string
    bridge: string
  }
}

export default async function Page(props: Props) {
  const daLayer = daLayers.find((p) => p.display.slug === props.params.layer)
  if (!daLayer) return notFound()
  const daBridge = daLayer.bridges.find(
    (b) => b.display.slug === props.params.bridge,
  )
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
