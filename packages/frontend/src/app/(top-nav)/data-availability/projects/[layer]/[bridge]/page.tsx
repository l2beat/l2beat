import { ProjectService } from '@l2beat/config'
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
import { getDaBridges } from '~/server/features/data-availability/utils/get-da-bridges'
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

  const projects = await ProjectService.STATIC.getProjects({
    select: ['daLayer', 'daBridges'],
  })
  return projects.flatMap((project) =>
    getDaBridges(project).map((bridge) => ({
      layer: project.slug,
      bridge: bridge.display.slug,
    })),
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const project = await ProjectService.STATIC.getProject({
    slug: params.layer,
    select: ['daLayer', 'daBridges', 'display'],
  })

  if (!project || !params.bridge) {
    notFound()
  }
  const bridge = getDaBridges(project).find(
    (bridge) => bridge.display?.slug === params.bridge,
  )
  if (!bridge) {
    notFound()
  }
  return getProjectMetadata({
    project: {
      name: project.name,
      description: project.display.description,
    },
    metadata: {
      openGraph: {
        url: `/data-availability/projects/${project.slug}/${bridge.display?.slug}`,
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
        <div className="sticky top-0 z-100 md:hidden">
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
  const project = await ProjectService.STATIC.getProject({
    slug: params.layer,
    select: ['daLayer', 'display', 'daBridges', 'statuses'],
    optional: ['isUpcoming', 'milestones'],
  })
  if (!project) {
    return
  }
  const daBridge = getDaBridges(project).find(
    (b) => b.display.slug === params.bridge,
  )
  if (!daBridge) {
    return
  }
  if (params.layer === 'ethereum') {
    const entry = await getEthereumDaProjectEntry(project, daBridge)

    return {
      entry,
      summaryComponent: <EthereumDaProjectSummary project={entry} />,
    }
  }

  const entry = await getDaProjectEntry(project, daBridge)

  return {
    entry,
    summaryComponent: <RegularDaProjectSummary project={entry} />,
  }
}
