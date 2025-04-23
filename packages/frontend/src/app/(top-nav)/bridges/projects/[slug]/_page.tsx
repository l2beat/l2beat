import { ContentWrapper } from '~/components/content-wrapper'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'
import { BridgesMvpWarning } from './_components/bridges-mvp-warning'
import { BridgesProjectSummary } from './_components/bridges-project-summary'

export function BridgesProjectPage({
  projectEntry,
}: { projectEntry: BridgesProjectEntry }) {
  const navigationSections = projectDetailsToNavigationSections(
    projectEntry.sections,
  )
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <div className="smooth-scroll">
      <BridgesMvpWarning className="w-full" />
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 md:hidden">
          <MobileProjectNavigation sections={navigationSections} />
        </div>
      )}
      <BridgesProjectSummary project={projectEntry} />
      <ContentWrapper mobileFull>
        {isNavigationEmpty ? (
          <ProjectDetails items={projectEntry.sections} />
        ) : (
          <div className="gap-x-12 md:flex">
            <div className="mt-10 hidden w-[242px] shrink-0 md:block">
              <DesktopProjectNavigation
                project={{
                  title: projectEntry.name,
                  slug: projectEntry.slug,
                  isUnderReview: !!projectEntry.underReviewStatus,
                }}
                sections={navigationSections}
              />
            </div>
            <div className="w-full">
              <HighlightableLinkContextProvider>
                <ProjectDetails items={projectEntry.sections} />
              </HighlightableLinkContextProvider>
            </div>
          </div>
        )}
      </ContentWrapper>
      <ScrollToTopButton />
    </div>
  )
}
