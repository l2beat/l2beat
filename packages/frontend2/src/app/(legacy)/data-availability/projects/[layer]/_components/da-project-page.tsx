import {
  type DaBridge,
  type DaLayer,
} from '@l2beat/config/build/src/projects/other/da-beat'
import { DesktopProjectNavigation } from '~/app/_components/projects/sections/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/app/_components/projects/sections/navigation/mobile-project-navigation'
import { ProjectDetails } from '~/app/_components/projects/sections/project-details'
import { getDaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { DaProjectSummary } from '../_components/da-project-summary'
import { HighlightableLinkContextProvider } from '~/app/_components/link/highlightable/highlightable-link-context'

interface Props {
  header: React.ReactNode
  daLayer: DaLayer
  daBridge: DaBridge
}

export async function DaProjectPage({ header, daLayer, daBridge }: Props) {
  const daProjectEntry = await getDaProjectEntry(daLayer, daBridge)

  const isNavigationEmpty = daProjectEntry.projectDetails.length === 0

  return (
    <>
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 md:hidden -mx-4">
          <MobileProjectNavigation sections={daProjectEntry.projectDetails} />
        </div>
      )}
      {header}
      <DaProjectSummary project={daProjectEntry} />
      {isNavigationEmpty ? (
        <ProjectDetails items={daProjectEntry.projectDetails} />
      ) : (
        <div className="gap-x-12 md:flex">
          <div className="mt-10 hidden w-[242px] shrink-0 md:block">
            <DesktopProjectNavigation
              project={{
                title: daProjectEntry.name,
                icon: daProjectEntry.iconSrc,
                showProjectUnderReview: daProjectEntry.isUnderReview,
              }}
              sections={daProjectEntry.projectDetails}
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
