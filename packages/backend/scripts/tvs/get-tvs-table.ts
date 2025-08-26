import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { command, optional, positional, run, string } from 'cmd-ts'
import * as fs from 'fs'

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs will be executed',
  }),
}

const cmd = command({
  name: 'get-tvs',
  args,
  handler: async (args) => {
    const db = initDb()

    const ps = new ProjectService()

    const projects = await ps.getProjects({
      select: ['tvsConfig', 'scalingInfo'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'archivedAt'],
    })

    const projectIds = projects
      .filter(
        (project) =>
          project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup',
      )
      .map((project) => project.id)

    const depth = UnixTime.toStartOf(UnixTime.now(), 'day') - 7 * UnixTime.DAY

    try {
      const start = Date.now()
      const tvs = await db.tvsTokenValue.getTvsTableBySource(projectIds, depth)
      const end = Date.now()

      // biome-ignore lint/suspicious/noExplicitAny: I need it
      const breakdownMap = new Map<string, { [k: string]: any }>()
      for (const record of tvs) {
        let mapItem = breakdownMap.get(record.projectId)
        if (!mapItem) {
          mapItem = { projectId: record.projectId }
        }
        mapItem[record.source] = record.value
        mapItem['total'] = (mapItem['total'] ?? 0) + Number(record.value)
        breakdownMap.set(record.projectId, mapItem)
      }

      fs.writeFileSync(
        'tvs-table.json',
        JSON.stringify(Array.from(breakdownMap.values()), null, 2),
      )

      console.log(`Executed in ${end - start}ms`)
      const size = Buffer.byteLength(JSON.stringify(tvs), 'utf8')
      console.log(`Rows count: ${tvs.length}`)
      console.log(`Response size: ${size / 1024} KB`)
    } catch (error) {
      console.error('Error occurred while fetching TVS data:', error)
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function initDb() {
  const env = getEnv()
  const tvsDbUrl = env.string('TVS_DB_URL')

  return createDatabase({
    connectionString: tvsDbUrl,
    application_name: 'GET-TVS-POC',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 10,
    keepAlive: false,
  })
}
