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
    select: ['proofVerification'],
    whereNot: ['isArchived'],
  })
  return projects.map((project) => ({
    slug: project.slug,
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
  const project = await ps.getProject({
    slug: params.slug,
  })
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
      {/* 
        Because of the way vercel/satori code is implemented, we need to use &nbsp; to not let the text
        be splitted by whitespaces because if it is then the text is not rendered correctly.
        Probably only in this specific case where "T" and "A" are next to each because vercel/satori,
        does not take into account the font kerning.
      */}
      ZK&nbsp;CATALOG&nbsp;•&nbsp;PROJECT&nbsp;PAGE
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
      debug: true,
    },
  )
}
