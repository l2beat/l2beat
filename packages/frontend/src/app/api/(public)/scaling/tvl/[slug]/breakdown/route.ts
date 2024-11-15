import { resolvedLayer2s, resolvedLayer3s } from '@l2beat/config/projects'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getTvlBreakdownForProject } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'

const projects = [...resolvedLayer2s, ...resolvedLayer3s]

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  return getCachedResponse(params.slug)
}

const getCachedResponse = cache(
  async (slug: string) => {
    const project = projects.find((p) => p.display.slug === slug)

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
  },
  ['scaling-tvl-project-breakdown-route'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)
