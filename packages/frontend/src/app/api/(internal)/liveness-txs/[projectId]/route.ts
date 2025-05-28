import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getLivenessTxs } from '../../_fns/getLivenessTxs'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params
  const searchParams = request.nextUrl.searchParams
  const subtype = TrackedTxsConfigSubtype.catch('batchSubmissions').parse(
    searchParams.get('subtype'),
  )

  const response = await getCachedResponse(params.projectId, subtype)
  return NextResponse.json(response)
}

const getCachedResponse = cache(
  getLivenessTxs,
  ['liveness-txs-project-route'],
  {
    tags: ['liveness'],
    revalidate: UnixTime.HOUR,
  },
)
