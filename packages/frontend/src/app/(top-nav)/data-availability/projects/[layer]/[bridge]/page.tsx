import { ProjectId } from '@l2beat/shared-pure'
import { notFound } from 'next/navigation'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from 'rewrite/src/server/features/data-availability/project/get-da-project-entry'
import { ps } from 'rewrite/src/server/projects'
import { env } from '~/env'
import { HydrateClient, api } from '~/trpc/server'
import { getProjectMetadata } from '~/utils/metadata'
import { DataAvailabilityProjectPage } from './_page'

interface Props {
  params: Promise<{
    layer: string
    bridge: string
  }>
}

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []

  const [layers, bridges] = await Promise.all([
    ps.getProjects({ select: ['daLayer'] }),
    ps.getProjects({ select: ['daBridge'] }),
  ])

  return layers.flatMap((layer) => {
    const pairs: { layer: string; bridge: string }[] = []
    if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
      pairs.push({ layer: layer.slug, bridge: 'no-bridge' })
    }
    const daBridges = bridges.filter((x) => x.daBridge.daLayer === layer.id)
    for (const bridge of daBridges) {
      pairs.push({ layer: layer.slug, bridge: bridge.slug })
    }
    return pairs
  })
}

export async function generateMetadata(props: Props) {
  const params = await props.params

  const [layer, bridge] = await Promise.all([
    ps.getProject({ slug: params.layer, select: ['display'] }),
    params.bridge !== 'no-bridge'
      ? ps.getProject({ slug: params.bridge, select: ['daBridge'] })
      : undefined,
  ])

  if (
    !layer ||
    (params.bridge !== 'no-bridge' &&
      (!bridge || bridge.daBridge.daLayer !== layer.id))
  ) {
    notFound()
  }
  return getProjectMetadata({
    project: {
      name: layer.name,
      description: layer.display.description,
    },
    metadata: {
      openGraph: {
        url: `/data-availability/projects/${layer.slug}/${bridge?.slug ?? 'no-bridge'}`,
      },
    },
  })
}

export default async function Page(props: Props) {
  const params = await props.params

  const entry = await getEntry(params)

  if (!entry) {
    return notFound()
  }

  return (
    <HydrateClient>
      <DataAvailabilityProjectPage projectEntry={entry} />
    </HydrateClient>
  )
}

async function getEntry(params: { layer: string; bridge: string }) {
  const layer = await ps.getProject({
    slug: params.layer,
    select: ['daLayer', 'display', 'statuses'],
    optional: ['isUpcoming', 'milestones'],
  })

  if (!layer) {
    notFound()
  }
  const prefetch = api.da.projectChart.prefetch({
    range: '1y',
    projectId: layer.id,
  })
  if (layer.id === ProjectId.ETHEREUM) {
    const bridge = await ps.getProject({
      slug: params.bridge,
      select: ['daBridge', 'display'],
      optional: ['contracts', 'permissions'],
    })
    if (!bridge || bridge.id !== layer.id) {
      notFound()
    }

    const [entry] = await Promise.all([
      getEthereumDaProjectEntry(layer, bridge),
      prefetch,
    ])

    return entry
  }

  const [entry] = await Promise.all([
    getDaProjectEntry(layer, params.bridge),
    prefetch,
  ])
  if (!entry) {
    notFound()
  }

  return entry
}
