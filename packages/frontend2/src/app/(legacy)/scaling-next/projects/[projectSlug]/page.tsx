import { layer2s } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { HighlightableLinkContextProvider } from '~/app/_components/link/highlightable/highlightable-link-context'
import { ProjectDetails } from '~/app/_components/projects/project-details'
import { DesktopProjectNavigation } from '~/app/_components/projects/sections/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/app/_components/projects/sections/navigation/mobile-project-navigation'
import { getScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { ScalingProjectSummary } from './_components/scaling-project-summary'

const scalingProjects = [...layer2s]

export async function generateStaticParams() {
  return scalingProjects.map((layer) => ({
    projectSlug: layer.display.slug,
  }))
}

interface Props {
  params: {
    projectSlug: string
  }
}

export default async function Page({ params }: Props) {
  const project = scalingProjects.find(
    (layer) => layer.display.slug === params.projectSlug,
  )

  if (!project) {
    notFound()
  }

  const projectEntry = await getScalingProjectEntry(project)
  const isNavigationEmpty = projectEntry.projectDetails.length === 0

  return (
    <>
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 -mx-4 md:hidden">
          <MobileProjectNavigation sections={projectEntry.projectDetails} />
        </div>
      )}
      <ScalingProjectSummary project={projectEntry} />
      {isNavigationEmpty ? (
        <ProjectDetails items={projectEntry.projectDetails} />
      ) : (
        <div className="gap-x-12 md:flex">
          <div className="mt-10 hidden w-[242px] shrink-0 md:block">
            <DesktopProjectNavigation
              project={{
                title: projectEntry.name,
                slug: projectEntry.slug,
                showProjectUnderReview: projectEntry.isUnderReview,
              }}
              sections={projectEntry.projectDetails}
            />
          </div>
          <div className="w-full">
            <HighlightableLinkContextProvider>
              <ProjectDetails items={projectEntry.projectDetails} />
            </HighlightableLinkContextProvider>
          </div>
        </div>
      )}
    </>
  )
}
