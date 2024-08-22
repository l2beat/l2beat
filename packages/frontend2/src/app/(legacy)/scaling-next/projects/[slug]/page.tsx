import { layer2s, layer3s } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { notFound } from 'next/navigation'
import { HighlightableLinkContextProvider } from '~/app/_components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/app/_components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/app/_components/projects/navigation/mobile-project-navigation'
import { ProjectDetails } from '~/app/_components/projects/project-details'
import { getScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { ScalingProjectSummary } from './_components/scaling-project-summary'

const scalingProjects = [...layer2s, ...layer3s]

export async function generateStaticParams() {
  return scalingProjects.map((layer) => ({
    slug: layer.display.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const project = scalingProjects.find(
    (layer) => layer.display.slug === params.slug,
  )
  assert(project, 'Project not found')
  return getDefaultMetadata({
    title: `${project.display.name} - L2BEAT`,
    description: project.display.description,
    openGraph: {
      url: `/scaling/projects/${project.display.slug}`,
    },
  })
}

interface Props {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const project = scalingProjects.find((p) => p.display.slug === params.slug)

  if (!project) {
    notFound()
  }

  const projectEntry = await getScalingProjectEntry(project)
  const isNavigationEmpty =
    projectEntry.projectDetails.filter((s) => !s.excludeFromNavigation)
      .length === 0
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
