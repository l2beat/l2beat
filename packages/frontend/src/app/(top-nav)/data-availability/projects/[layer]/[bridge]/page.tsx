import { resolvedDaLayers } from '@l2beat/config/projects'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProjectHeader } from '~/components/projects/project-header'
import { DaBridgeSelect } from '../_components/da-bridge-select'
import { DaProjectPage } from '../_components/da-project-page'
import DaProjectPageSkeleton from '../_components/da-project-page-skeleton'

interface Props {
  params: {
    layer: string
    bridge: string
  }
}

export default async function Page(props: Props) {
  const daLayer = resolvedDaLayers.find(
    (p) => p.display.slug === props.params.layer,
  )
  if (!daLayer) return notFound()
  const daBridge = daLayer.bridges.find(
    (b) => b.display.slug === props.params.bridge,
  )
  if (!daBridge) return notFound()

  const header = (
    <header className="space-y-4 pt-6 max-md:bg-gray-100 max-md:pb-4 max-md:dark:bg-zinc-900 md:space-y-3">
      <ProjectHeader title={daLayer.display.name} slug={daLayer.display.slug} />
      <DaBridgeSelect
        defaultValue={daBridge.display.slug}
        layerSlug={daLayer.display.slug}
        bridges={daLayer.bridges}
      />
    </header>
  )

  return (
    <Suspense fallback={<DaProjectPageSkeleton header={header} />}>
      <DaProjectPage header={header} daLayer={daLayer} daBridge={daBridge} />
    </Suspense>
  )
}
