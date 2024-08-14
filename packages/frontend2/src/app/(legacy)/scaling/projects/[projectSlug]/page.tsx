import { layer2s, layer3s } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { ProjectHeader } from '~/app/_components/projects/project-header'
import { getScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { ScalingProjectSummary } from './_components/scaling-project-summary'
import { MobileProjectNavigation } from '~/app/_components/projects/sections/navigation/mobile-project-navigation'

const scalingProjects = [...layer2s, ...layer3s]

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

export default function Page({ params }: Props) {
  const project = scalingProjects.find(
    (layer) => layer.display.slug === params.projectSlug,
  )

  if (!project) {
    notFound()
  }

  const projectEntry = getScalingProjectEntry(project)
  const isNavigationEmpty = false
  return (
    <>
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-100 -mx-4 md:hidden">
          <MobileProjectNavigation sections={projectEntry.projectDetails} />
        </div>
      )}
      <header className="pt-6 max-md:-mx-4 max-md:bg-gray-100 max-md:px-4 max-md:pb-4 max-md:dark:bg-zinc-900">
        <ProjectHeader
          title={projectEntry.name}
          src={`/icons/${projectEntry.slug}.png`}
        />
      </header>
      <ScalingProjectSummary project={projectEntry} />
    </>
  )
}
