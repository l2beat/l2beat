import { bridges } from '@l2beat/config'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { getBaseUrl } from '~/utils/get-base-url'

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
  const baseUrl = getBaseUrl()
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
      baseUrl={baseUrl}
      slug={project.display.slug}
      name={project.display.name}
      size={size}
    >
      {/* See comment in zk-catalog/[slug]/opengraph-image.tsx for explanation why we use &nbsp; */}
      BRIDGES&nbsp;•&nbsp;PROJECT&nbsp;PAGE
    </ProjectOpengraphImage>,
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
