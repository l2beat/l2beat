import { type Layer2, type Layer3, daLayers } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { mapRisksToRosetteValues } from '~/app/(new)/data-availability/_utils/map-risks-to-rosette-values'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { ProjectHeader } from '~/app/_components/projects/project-header'
import { BigRosette } from '~/app/_components/rosette/big-rosette/big-rosette'
import { getDaRisks } from '~/server/features/data-availability/utils/get-da-risks'
import { DaBridgeSelect } from './_components/da-bridge-select'

interface Props {
  params: {
    slug: string
    x: Layer2 | Layer3
  }
}

const projects = [...daLayers]

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }))
}

export default function Page(props: Props) {
  const project = projects.find((p) => p.display.slug === props.params.slug)

  if (!project) return notFound()

  return (
    <header>
      <div>
        <ProjectHeader
          title={project.display.name}
          src={`/icons/${project.display.slug}.png`}
        />
        <DaBridgeSelect layer={project} />
        <HorizontalSeparator className="my-6" />
      </div>
      <div>
        <BigRosette
          values={mapRisksToRosetteValues(
            getDaRisks(project, project.bridges[0]!),
          )}
        />
      </div>
    </header>
  )
}
