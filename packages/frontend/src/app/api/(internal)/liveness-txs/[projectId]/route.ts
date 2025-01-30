import type { IndexerConfigurationRecord } from '@l2beat/database'
import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getDb } from '~/server/database'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params
  const searchParams = request.nextUrl.searchParams
  const subtype = TrackedTxsConfigSubtype.catch('batchSubmissions').parse(
    searchParams.get('subtype'),
  )
  const to = UnixTime.now().toStartOf('hour')
  const from = to.add(-30, 'days')

  const response = await getCachedResponse(params.projectId, subtype, from, to)
  return NextResponse.json(response)
}

const getCachedResponse = cache(
  async (
    projectId: string,
    subtype: TrackedTxsConfigSubtype,
    from: UnixTime,
    to: UnixTime,
  ) => {
    const db = getDb()

    const configurationIds = await db.indexerConfiguration.getByIndexerId(
      'tracked_txs_indexer',
    )
    const relevantConfigs = getRelevantConfigs(
      configurationIds,
      projectId,
      subtype,
      from,
      to,
    )

    const records = await db.liveness.getByConfigurationIdWithinTimeRange(
      relevantConfigs.map((c) => c.id),
      from,
      to,
    )

    if (records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing data.',
      } as const)
    }

    return {
      success: true,
      data: {
        projectId,
        subtype,
        timestamps: records.map((r) => r.timestamp),
      },
    } as const
  },
  ['liveness-txs-project-route'],
  {
    tags: ['liveness'],
    revalidate: UnixTime.HOUR,
  },
)

function getRelevantConfigs(
  configurationIds: IndexerConfigurationRecord[],
  projectId: string,
  subtype: TrackedTxsConfigSubtype,
  from: UnixTime,
  to: UnixTime,
) {
  const parsed = configurationIds.map((c) => ({
    ...c,
    properties: JSON.parse(c.properties) as {
      subtype: TrackedTxsConfigSubtype
      projectId: string
    },
  }))

  return parsed.filter(
    (c) =>
      c.properties.projectId === projectId &&
      c.properties.subtype === subtype &&
      c.minHeight <= to.toNumber() &&
      (!c.maxHeight || c.maxHeight >= from.toNumber()),
  )
}
