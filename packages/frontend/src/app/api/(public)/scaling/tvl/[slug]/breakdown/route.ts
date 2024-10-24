import { resolvedLayer2s, resolvedLayer3s } from '@l2beat/config/projects'
import { NextResponse } from 'next/server'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'

const projects = [...resolvedLayer2s, ...resolvedLayer3s]

export async function GET(
  _: Request,
  { params }: { params: { slug: string } },
) {
  const project = projects.find((p) => p.display.slug === params.slug)

  if (!project) {
    return NextResponse.json({
      success: false,
      error: 'Project not found.',
    })
  }

  return NextResponse.json({
    success: true,
    data: await getTvlBreakdownForProject(project),
  })
}
