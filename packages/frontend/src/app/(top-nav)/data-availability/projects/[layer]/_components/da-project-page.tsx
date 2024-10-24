import { type DaBridge, type DaLayer } from '@l2beat/config'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { getDaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { DaProjectSummary } from './da-project-summary'

interface Props {
  header: React.ReactNode
  daLayer: DaLayer
  daBridge: DaBridge
}

export async function DaProjectPage({ header, daLayer, daBridge }: Props) {
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
      <DaProjectSummary project={daProjectEntry} header={header} />
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
