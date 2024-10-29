import { layer2s, layer3s } from '@l2beat/config'
import { NextResponse } from 'next/server'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'

const projects = [...layer2s, ...layer3s]

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
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
