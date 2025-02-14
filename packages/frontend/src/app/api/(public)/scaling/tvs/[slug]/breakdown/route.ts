import { layer2s, layer3s } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getTvsBreakdownForProject } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'

const projects = [...layer2s, ...layer3s]

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params
  const response = await getCachedResponse(params.slug)

  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (slug: string) => {
    const project = projects.find((p) => p.display.slug === slug)

    if (!project) {
      return {
        success: false,
        error: 'Project not found.',
      } as const
    }

    return {
      success: true,
      data: await getTvsBreakdownForProject(project),
    } as const
  },
  ['scaling-tvs-project-breakdown-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
