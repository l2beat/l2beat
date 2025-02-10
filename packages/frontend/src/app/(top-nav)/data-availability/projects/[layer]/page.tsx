import { notFound, redirect } from 'next/navigation'
import { ps } from '~/server/projects'

interface Props {
  params: Promise<{ layer: string }>
}

export default async function RedirectPage(props: Props) {
  const { layer } = await props.params
  const project = await ps.getProject({
    slug: layer,
    select: ['daLayer'],
  })

  if (!project) {
    return notFound()
  }
  if (project.daLayer.usedWithoutBridgeIn.length > 0) {
    redirect(`/data-availability/projects/${project.slug}/no-bridge`)
  }

  const bridges = await ps.getProjects({
    select: ['daBridge'],
  })
  const bridge = bridges.find((x) => x.daBridge.daLayer === project.id)
  if (!bridge) {
    return notFound()
  }
  redirect(`/data-availability/projects/${project.slug}/${bridge.slug}`)
}
