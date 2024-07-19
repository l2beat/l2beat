import { daLayers } from '@l2beat/config/build/src/projects/other/da-beat/index'
import { notFound } from 'next/navigation'
import { ProjectHeader } from '~/app/_components/projects/project-header'
import { DaBridgeSelect } from '../_components/da-bridge-select'
import { Suspense } from 'react'
import { DaProjectPage } from '../_components/da-project-page'
import DaProjectPageSkeleton from '../_components/da-project-page-skeleton'

interface Props {
  params: {
    layer: string
    bridge: string
  }
}

export default async function Page(props: Props) {
  const daLayer = daLayers.find((p) => p.display.slug === props.params.layer)
  if (!daLayer) return notFound()
  const bridge = daLayer.bridges.find((b) => b.id === props.params.bridge)
  if (!bridge) return notFound()

  const header = (
    <header className="pt-6 space-y-4 md:space-y-3 max-md:bg-gray-100 max-md:dark:bg-zinc-900 max-md:-mx-4 max-md:px-4 max-md:pb-4">
      <ProjectHeader
        title={daLayer.display.name}
        src={`/icons/${daLayer.display.slug}.png`}
      />
      <DaBridgeSelect bridges={daLayer.bridges} />
    </header>
  )

  return (
    <Suspense fallback={<DaProjectPageSkeleton header={header} />}>
      <DaProjectPage daLayer={daLayer} daBridge={bridge} header={header} />
    </Suspense>
  )
}
