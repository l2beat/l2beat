import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import {
  type ProjectValueRecord,
  type ValueRecord,
  createDatabase,
} from '@l2beat/database'
import {
  assert,
  ProjectId,
  UnixTime,
  asNumber,
  formatLargeNumber,
} from '@l2beat/shared-pure'

async function main() {
  try {
    const env = getEnv()
    const timestamp = UnixTime.toStartOf(
      UnixTime.now() - 2 * UnixTime.HOUR,
      'hour',
    )

    const projectService = new ProjectService()
    const scalingProjects = await projectService.getProjects({
      select: ['tvsConfig', 'isScaling'],
      whereNot: ['isArchived'],
    })
    const projectIds = new Set(scalingProjects.map((p) => p.id.toString()))
    const projectIdArray = Array.from(projectIds.values()).map((p) =>
      ProjectId(p),
    )

    const tvsDb = createDatabase({
      connectionString: env.string('TVS_STAGING_URL'),
      application_name: 'DIFF-SCRIPT',
      ssl: { rejectUnauthorized: false },
      min: 2,
      max: 10,
      keepAlive: false,
    })

    const tvsRecords = await tvsDb.tvsProjectValue.getByTimestampAndType(
      timestamp,
      'SUMMARY',
    )

    const filteredTvsRecords = tvsRecords.filter((r) =>
      projectIds.has(r.project),
    )
    const totalTvs = filteredTvsRecords.reduce(
      (acc, curr) => acc + curr.value,
      0,
    )

    const tvlDb = createDatabase({
      connectionString: env.string('TVL_STAGING_URL'),
      application_name: 'DIFF-SCRIPT',
      ssl: { rejectUnauthorized: false },
      min: 2,
      max: 10,
      keepAlive: false,
    })

    const tvlRecords = await tvlDb.value.getValuesByProjectIdsAndTimeRange(
      projectIdArray,
      [timestamp, timestamp],
    )

    const totalTvl = asNumber(
      tvlRecords.reduce(
        (acc, curr) =>
          acc +
          curr.nativeForTotal +
          curr.externalForTotal +
          curr.canonicalForTotal,
        0n,
      ),
      2,
    )

    printResults(totalTvs, totalTvl)
    printProjectDiffs(filteredTvsRecords, tvlRecords)
  } catch (error) {
    console.error('Error in main function:', error)
    process.exit(1)
  }
}

function printResults(totalTvs: number, totalTvl: number) {
  console.log(`\nTVS`)
  console.log(`raw: ${totalTvs}`)
  console.log(`formatted: $ ${formatLargeNumber(totalTvs)}`)

  console.log(`\nTVL`)
  console.log(`raw: ${totalTvl}`)
  console.log(`formatted: $ ${formatLargeNumber(totalTvl)}`)

  const diff = totalTvs - totalTvl
  const percentageRatio = ((totalTvs / totalTvl) * 100).toFixed(2)

  console.log(`\nDIFF`)
  console.log('Diff (TVS - TVL):', formatLargeNumber(diff))
  console.log(`Correlation (TVS/TVL): ${percentageRatio}%`)
}

function printProjectDiffs(
  tvsRecords: ProjectValueRecord[],
  tvlRecords: ValueRecord[],
) {
  console.log('\nPER PROJECT DIFFERENCES:')
  console.log('------------------------')

  const projectTvlMap = new Map<string, number>()

  for (const record of tvlRecords) {
    const projectId = record.projectId.toString()
    const value = asNumber(
      record.nativeForTotal +
        record.externalForTotal +
        record.canonicalForTotal,
      2,
    )

    if (!projectTvlMap.has(projectId)) {
      projectTvlMap.set(projectId, 0)
    }

    const previous = projectTvlMap.get(projectId)
    assert(previous !== undefined)
    projectTvlMap.set(projectId, previous + value)
  }

  const projectTvsMap = new Map<string, number>()
  for (const record of tvsRecords) {
    projectTvsMap.set(record.project, record.value)
  }

  const allProjectIds = new Set([
    ...projectTvlMap.keys(),
    ...projectTvsMap.keys(),
  ])

  const projectDiffs = []

  for (const projectId of allProjectIds) {
    const tvsValue = projectTvsMap.get(projectId) || 0
    const tvlValue = projectTvlMap.get(projectId) || 0

    const diff = tvsValue - tvlValue
    const percentageDiff =
      tvlValue > 0 ? ((tvsValue / tvlValue) * 100).toFixed(2) + '%' : 'N/A'

    projectDiffs.push({
      projectId,
      tvsValue,
      tvlValue,
      diff: diff,
      percentageDiff,
    })
  }

  projectDiffs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))

  for (const diff of projectDiffs) {
    console.log(`Project: ${diff.projectId}`)
    console.log(`  TVS: $${formatLargeNumber(diff.tvsValue)}`)
    console.log(`  TVL: $${formatLargeNumber(diff.tvlValue)}`)
    console.log(`  Diff: $${formatLargeNumber(diff.diff)}`)
    console.log(`  Correlation (TVS/TVL): ${diff.percentageDiff}`)
    console.log('------------------------')
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
