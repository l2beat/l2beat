import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

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

  const timestamp = UnixTime.fromDate(new Date('2025-04-04 07:00:00.000000'))

  const records = await db.tvsProjectValue.getByTimestampAndType(
    timestamp,
    'SUMMARY',
  )

  console.log(records.length)

  const ps = new ProjectService()

  const scalingProjects = ps.getProjects({
    select: ['tvsConfig', 'isScaling'],
    whereNot: ['isArchived'],
  })

  console.log((await scalingProjects).length)

  function newFunction(): number {
    return UnixTime.fromDate(new Date('2025-04-04 07:00:00.000000'))
  }

  // add logic here
}

main().catch((e: unknown) => {
  console.error(e)
})
