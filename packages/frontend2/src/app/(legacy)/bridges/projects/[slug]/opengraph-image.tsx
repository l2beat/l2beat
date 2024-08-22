/* eslint-disable @next/next/no-img-element */
import { bridges } from '@l2beat/config'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { ProjectOpengraphImage } from '~/app/_components/opengraph-image/project'
import { env } from '~/env'

export const runtime = 'nodejs'

const size = {
  width: 1200,
  height: 630,
}

export async function generateStaticParams() {
  return bridges.map((project) => ({
    slug: project.display.slug,
  }))
}

export async function generateImageMetadata({ params }: Props) {
  return [
    {
      id: params.slug,
      size,
      alt: `Project page for ${params.slug}`,
      contentType: 'image/png',
    },
  ]
}

interface Props {
  params: {
    slug: string
  }
}

export default async function Image({ params }: Props) {
  const project = bridges.find((p) => p.display.slug === params.slug)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
  const base = env.VERCEL_URL ?? 'http://localhost:3000'
  const [robotoMedium, robotoBold] = [
    fetch(`${base}/fonts/roboto/Roboto-Medium.ttf`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`${base}/fonts/roboto/Roboto-Bold.ttf`).then((res) =>
      res.arrayBuffer(),
    ),
  ]
  return new ImageResponse(
    <ProjectOpengraphImage
      baseUrl={base}
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
