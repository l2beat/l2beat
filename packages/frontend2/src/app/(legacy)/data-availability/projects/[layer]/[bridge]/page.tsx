import { daLayers } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { getDaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { DaHeader } from '../_components/da-header'

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

  return (
    <>
      <DaHeader project={daProjectEntry} />
    </>
  )
}
