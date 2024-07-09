import { daLayers } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { getDaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { DaHeader } from '../_components/da-header'
import { DesktopProjectNavigation } from '~/app/_components/projects/sections/navigation/desktop-project-navigation'
import { getProjectDetails } from '../_utils/get-project-details'
import { ProjectDetails } from '~/app/_components/projects/sections/project-details'

interface Props {
  params: {
    layer: string
    bridge: string
  }
}

const projects = [...daLayers]

export async function generateStaticParams() {
  return projects.map((layer) =>
    layer.bridges.map((bridge) => ({
      layer: layer.id,
      bridge: bridge.id,
    })),
  )
}

export default async function Page(props: Props) {
  const project = projects.find((p) => p.display.slug === props.params.layer)
  if (!project) return notFound()
  const bridge = project.bridges.find((b) => b.id === props.params.bridge)
  if (!bridge) return notFound()
  const daProjectEntry = await getDaProjectEntry(project, bridge)

  const projectDetails = getProjectDetails(daProjectEntry)
  return (
    <>
      <DaHeader project={daProjectEntry} />
      <div className="gap-x-12 md:flex">
        <div className="mt-10 hidden w-[242px] shrink-0 md:block">
          <DesktopProjectNavigation
            project={{
              title: daProjectEntry.name,
              icon: daProjectEntry.iconSrc,
              // showProjectUnderReview: daProjectEntry.isUnderReview,
            }}
            sections={projectDetails}
          />
        </div>
        <div className="w-full">
          <ProjectDetails items={projectDetails} />
        </div>
      </div>
    </>
  )
}
