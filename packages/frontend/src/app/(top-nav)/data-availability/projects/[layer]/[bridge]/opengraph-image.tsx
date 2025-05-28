import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { ps } from '~/server/projects'
import { getBaseUrl } from '~/utils/get-base-url'

export const runtime = 'nodejs'

const size = {
  width: 1200,
  height: 630,
}

export async function generateStaticParams() {
  const projects = await ps.getProjects({
    select: ['daLayer'],
  })
  return projects.flatMap((project) => ({
    layer: project.slug,
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
  const projects = await ps.getProjects({
    select: ['daLayer'],
  })
  const project = projects.find((p) => p.slug === params.layer)
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
      slug={project.slug}
      name={project.name}
      size={size}
    >
      {/* See comment in zk-catalog/[slug]/opengraph-image.tsx for explanation why we use &nbsp; */}
      DATA&nbsp;AVAILABILITY&nbsp;•&nbsp;PROJECT&nbsp;PAGE
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
