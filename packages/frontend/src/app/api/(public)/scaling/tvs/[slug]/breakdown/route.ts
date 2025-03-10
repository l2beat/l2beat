import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { getTvsBreakdownForProject } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'
import { ps } from '~/server/projects'

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
    const project = await ps.getProject({
      slug,
      select: ['tvlConfig'],
      optional: ['chainConfig'],
    })

    if (!project) {
      return { success: false, error: 'Project not found.' }
    }

    const data = await getTvsBreakdownForProject(project)
    return { success: true, data }
  },
  ['scaling-tvs-project-breakdown-route'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)
