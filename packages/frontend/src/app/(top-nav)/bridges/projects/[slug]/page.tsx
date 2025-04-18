import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/components/content-wrapper'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { env } from '~/env'
import { getBridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'
import { ps } from '~/server/projects'
import { HydrateClient } from '~/trpc/server'
import { getProjectMetadata } from '~/utils/metadata'
import { BridgesProjectSummary } from './_components/bridges-project-summary'

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []
  const projects = await ps.getProjects({ where: ['isBridge'] })
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const project = await ps.getProject({
    slug: params.slug,
    select: ['display'],
    where: ['isBridge'],
  })
  if (!project) {
    notFound()
  }
  return getProjectMetadata({
    project: {
      name: project.name,
      description: project.display.description,
    },
    metadata: {
      openGraph: {
        url: `/bridges/projects/${project.slug}`,
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
  const project = await ps.getProject({
    slug: params.slug,
    select: [
      'display',
      'statuses',
      'tvlInfo',
      'tvsConfig',
      'bridgeInfo',
      'bridgeRisks',
      'bridgeTechnology',
      'display',
    ],
    where: ['isBridge'],
    optional: [
      'chainConfig',
      'archivedAt',
      'isUpcoming',
      'milestones',
      'contracts',
      'permissions',
    ],
  })

  if (!project) {
    notFound()
  }

  const projectEntry = await getBridgesProjectEntry(project)
  const navigationSections = projectDetailsToNavigationSections(
    projectEntry.sections,
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
    </HydrateClient>
  )
}
