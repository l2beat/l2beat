import { ethereumDaLayer } from '@l2beat/config'
import { daLayers } from '@l2beat/config'
import { notFound, redirect } from 'next/navigation'
import { getDaBridges } from '~/server/features/data-availability/utils/get-da-bridges'

interface Props {
  params: Promise<{
    layer: string
    bridge: string
  }>
}

export default async function RedirectPage(props: Props) {
  const { layer } = await props.params
  const project = [...daLayers, ethereumDaLayer].find(
    (p) => p.display.slug === layer,
  )
  const firstBridge = project && getDaBridges(project)[0]
  if (!project || !firstBridge) {
    return notFound()
  }
  redirect(
    `/data-availability/projects/${project.display.slug}/${firstBridge.display.slug}`,
  )
}
