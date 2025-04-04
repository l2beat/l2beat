import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { UnixTime, formatLargeNumber } from '@l2beat/shared-pure'

async function main() {
  const env = getEnv()

  const db = createDatabase({
    connectionString: env.string('TVS_STAGING_URL'),
    application_name: 'DIFF-SCRIPT',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 10,
    keepAlive: false,
  })

  const timestamp = UnixTime.fromDate(new Date('2025-04-04T07:00:00Z'))

  const records = await db.tvsProjectValue.getByTimestampAndType(
    timestamp,
    'SUMMARY',
  )

  const ps = new ProjectService()

  const scalingProjects = await ps.getProjects({
    select: ['tvsConfig', 'isScaling'],
    whereNot: ['isArchived'],
  })

  const ids = new Set(scalingProjects.map((p) => p.id.toString()))

  const summaryTvs = records
    .filter((r) => ids.has(r.project))
    .reduce((acc, curr) => (acc += curr.value), 0)

  console.log(`TVS RAW: ${summaryTvs}`)
  console.log(`TVS FORMATTED: $ ${formatLargeNumber(summaryTvs)}`)
}

main().catch((e: unknown) => {
  console.error(e)
})
