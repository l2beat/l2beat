import { layer2s, layer3s } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { OtherMigrationNotice } from '~/components/countdowns/other-migration/other-migration-notice'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { env } from '~/env'
import { getScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { isInPast } from '~/server/features/utils/is-in-past'
import { HydrateClient } from '~/trpc/server'
import { getProjectMetadata } from '~/utils/metadata'
import { ScalingProjectSummary } from './_components/scaling-project-summary'

const scalingProjects = [...layer2s, ...layer3s]

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []
  return scalingProjects.map((layer) => ({
    slug: layer.display.slug,
  }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const project = scalingProjects.find(
    (layer) => layer.display.slug === params.slug,
  )
  if (!project) {
    notFound()
  }
  return getProjectMetadata({
    project: {
      name: project.display.name,
      description: project.display.description,
    },
    metadata: {
      openGraph: {
        url: `/scaling/projects/${project.display.slug}`,
      },
    },
  })
}

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const project = scalingProjects.find((p) => p.display.slug === params.slug)

  if (!project) {
    notFound()
  }

  const projectEntry = await getScalingProjectEntry(project)
  const navigationSections = projectDetailsToNavigationSections(
    projectEntry.projectDetails,
  )
  const isNavigationEmpty = navigationSections.length === 0

  // HydrateClient is used to hydrate the client with chart data that is fetched inside get-bridges-project-details.tsx
  return (
    <HydrateClient>
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 md:hidden">
          <MobileProjectNavigation sections={navigationSections} />
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
                isUnderReview: !!projectEntry.underReviewStatus,
              }}
              sections={navigationSections}
            />
          </div>
          <div className="w-full">
            {env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS &&
              projectEntry.countdowns.otherMigration &&
              !isInPast(projectEntry.countdowns.otherMigration.expiresAt) && (
                <OtherMigrationNotice
                  {...projectEntry.countdowns.otherMigration}
                />
              )}
            <HighlightableLinkContextProvider>
              <ProjectDetails items={projectEntry.projectDetails} />
            </HighlightableLinkContextProvider>
          </div>
        </div>
      )}
    </HydrateClient>
  )
}
