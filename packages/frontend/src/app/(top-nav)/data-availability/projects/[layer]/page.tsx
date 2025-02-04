import { notFound, redirect } from 'next/navigation'
import { getDaBridges } from '~/server/features/data-availability/utils/get-da-bridges'
import { ps } from '~/server/projects'

interface Props {
  params: Promise<{
    layer: string
    bridge: string
  }>
}

export default async function RedirectPage(props: Props) {
  const { layer } = await props.params
  const project = await ps.getProject({
    slug: layer,
    select: ['daLayer', 'daBridges'],
  })

  const firstBridge = project && getDaBridges(project)[0]
  if (!project || !firstBridge) {
    return notFound()
  }
  redirect(
    `/data-availability/projects/${project.slug}/${firstBridge.display.slug}`,
  )
}
