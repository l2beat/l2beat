import { daLayers } from '@l2beat/config'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { env } from '~/env'

export const runtime = 'nodejs'

const size = {
  width: 1200,
  height: 630,
}

export async function generateStaticParams() {
  return daLayers.map((project) => ({
    layer: project.display.slug,
  }))
}

export async function generateImageMetadata({ params }: Props) {
  return [
    {
      id: params.layer,
      size,
      alt: `Project page for ${params.layer}`,
      contentType: 'image/png',
    },
  ]
}

interface Props {
  params: {
    layer: string
  }
}

export default async function Image({ params }: Props) {
  const project = daLayers.find((p) => p.display.slug === params.layer)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  const baseUrl = env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : 'http://localhost:3000'
  const [robotoMedium, robotoBold] = [
    fetch(`${baseUrl}/fonts/roboto/roboto-latin-500.ttf`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`${baseUrl}/fonts/roboto/roboto-latin-700.ttf`).then((res) =>
      res.arrayBuffer(),
    ),
  ]
  return new ImageResponse(
    <ProjectOpengraphImage
      background="da-beat"
      baseUrl={baseUrl}
      slug={project.display.slug}
      name={project.display.name}
      size={size}
    />,
    {
      ...size,
      fonts: [
        {
          name: 'roboto',
          data: await robotoMedium,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'roboto',
          data: await robotoBold,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
}
