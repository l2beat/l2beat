import fs from 'fs'
import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import {
  type Database,
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

    const startDate = UnixTime(1575590400) // 6.12.2019
    const endDate = UnixTime.toStartOf(UnixTime.now(), 'day')
    const timestamps = generateDailyTimestamps(startDate, endDate)

    const projectService = new ProjectService()
    const scalingProjects = await projectService.getProjects({
      select: ['tvsConfig', 'isScaling'],
      whereNot: ['isArchived'],
    })
    const projectIds = new Set(scalingProjects.map((p) => p.id.toString()))
    const projectIdArray = Array.from(projectIds.values()).map((p) =>
      ProjectId(p),
    )

    const db = createDatabase({
      connectionString: env.string('TVS_DB_URL'),
      application_name: 'DIFF-SCRIPT',
      ssl: { rejectUnauthorized: false },
      min: 2,
      max: 10,
      keepAlive: false,
    })

    // Create a CSV file to store results
    const csvStream = fs.createWriteStream('tvs_tvl_comparison.csv')
    csvStream.write('Date,TVS,TVL,Diff,Correlation(%)\n')

    // Create a CSV file for project-specific data
    const projectCsvStream = fs.createWriteStream('project_comparison.csv')
    projectCsvStream.write('Date,ProjectId,TVS,TVL,Diff,Correlation(%)\n')

    console.log(`Processing ${timestamps.length} timestamps...`)

    // Process each timestamp
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i]
      const dateStr = UnixTime.toDate(timestamp).toISOString().split('T')[0]

      console.log(`Processing ${dateStr} (${i + 1}/${timestamps.length})`)

      try {
        // Get TVS records for this timestamp
        const tvsRecords = await db.tvsProjectValue.getByTimestampAndType(
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

        // Get TVL records for this timestamp
        const tvlRecords = await db.value.getValuesByProjectIdsAndTimeRange(
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

        // Calculate differences
        const diff = totalTvs - totalTvl
        const percentageRatio = totalTvl > 0 ? (totalTvs / totalTvl) * 100 : 0
        console.log(
          UnixTime.toDate(timestamp).toISOString(),
          diff,
          percentageRatio,
        )

        if (percentageRatio >= 100.5 || percentageRatio <= 99.5) {
          if (totalTvs !== 0 && totalTvl !== 0)
            console.log(
              `\x1b[41m Mismatch detected: ${formatPercent(percentageRatio)} $${formatLargeNumber(diff)} \x1b[0m`,
            )
        }

        // Write to CSV
        csvStream.write(
          `${dateStr},${totalTvs},${totalTvl},${diff},${percentageRatio.toFixed(2)}\n`,
        )

        // Process project-specific differences
        await processProjectDiffs(
          db,
          timestamp,
          projectIds,
          tvlRecords,
          projectCsvStream,
          dateStr,
        )
      } catch (error) {
        console.error(`Error processing timestamp ${dateStr}:`, error)
        // Continue with the next timestamp
      }
    }

    csvStream.end()
    projectCsvStream.end()

    console.log('\nProcessing complete!')
    console.log(
      'Results saved to tvs_tvl_comparison.csv and project_comparison.csv',
    )
  } catch (error) {
    console.error('Error in main function:', error)
    process.exit(1)
  }
}

function generateDailyTimestamps(start: UnixTime, end: UnixTime): UnixTime[] {
  const timestamps: UnixTime[] = []
  let current = start

  while (current <= end) {
    timestamps.push(current)
    current = current + UnixTime.DAY
  }

  return timestamps
}

async function processProjectDiffs(
  db: Database,
  timestamp: UnixTime,
  projectIds: Set<string>,
  tvlRecords: ValueRecord[],
  csvStream: fs.WriteStream,
  dateStr: string,
) {
  const projectTvlMap = new Map<string, number>()

  for (const record of tvlRecords) {
    const projectId = record.projectId.toString()
    const value = asNumber(
      record.native + record.external + record.canonical,
      2,
    )

    if (!projectTvlMap.has(projectId)) {
      projectTvlMap.set(projectId, 0)
    }

    const previous = projectTvlMap.get(projectId)
    assert(previous !== undefined)
    projectTvlMap.set(projectId, previous + value)
  }

  const tvsRecords = (
    await db.tvsProjectValue.getByTimestampAndType(timestamp, 'PROJECT')
  ).filter((r) => projectIds.has(r.project))

  const projectTvsMap = new Map<string, number>()
  for (const record of tvsRecords) {
    projectTvsMap.set(record.project, record.value)
  }

  const allProjectIds = new Set([
    ...projectTvlMap.keys(),
    ...projectTvsMap.keys(),
  ])

  for (const projectId of allProjectIds) {
    const tvsValue = projectTvsMap.get(projectId) || 0
    const tvlValue = projectTvlMap.get(projectId) || 0

    const diff = tvsValue - tvlValue
    const percentageDiff = tvlValue > 0 ? (tvsValue / tvlValue) * 100 : 0

    if (percentageDiff >= 100.5 || percentageDiff <= 99.5) {
      if (tvlValue !== 0 && tvsValue !== 0)
        console.log(
          `\x1b[31m ${projectId}: ${formatPercent(percentageDiff)} ($${formatLargeNumber(diff)}) \x1b[0m`,
        )
    }

    // Write to CSV: Date,ProjectId,TVS,TVL,Diff,Correlation(%)
    csvStream.write(
      `${dateStr},${projectId},${tvsValue},${tvlValue},${diff},${percentageDiff.toFixed(2)}\n`,
    )
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})

function formatPercent(value: number): string {
  const formattedValue = value.toFixed(2)
  return `${formattedValue}%`
}
