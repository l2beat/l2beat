import { ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import { command, optional, positional, run, string } from 'cmd-ts'

const args = {
  project: positional({
    type: optional(string),
    displayName: 'projectId',
    description: 'Project for which tvs will be executed',
  }),
}

import * as fs from 'fs'

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
    const tokens = projects
      .filter(
        (project) =>
          project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup',
      )
      .flatMap((project) => project.tvsConfig)

    const breakdown = [
      {
        label: 'canonical',
        ids: tokens
          .filter((token) => token.source === 'canonical')
          .map((token) => token.id as string),
      },
      {
        label: 'native',
        ids: tokens
          .filter((token) => token.source === 'native')
          .map((token) => token.id as string),
      },
      {
        label: 'external',
        ids: tokens
          .filter((token) => token.source === 'external')
          .map((token) => token.id as string),
      },
    ]

    try {
      const start = Date.now()
      const tvs = await db.tvsTokenValue.getTvs(breakdown)
      const end = Date.now()

      // biome-ignore lint/suspicious/noExplicitAny: I need it
      const breakdownMap = new Map<string, { [k: string]: any }>()
      for (const record of tvs) {
        let mapItem = breakdownMap.get(record.timestamp)
        if (!mapItem) {
          mapItem = { timestamp: record.timestamp }
        }
        mapItem[record.label] = record.value
        mapItem['total'] = (mapItem['total'] ?? 0) + Number(record.value)
        breakdownMap.set(record.timestamp, mapItem)
      }

      fs.writeFileSync(
        'tvs.json',
        JSON.stringify(Array.from(breakdownMap.values()), null, 2),
      )

      console.log(`Executed in ${end - start}ms`)
      const size = Buffer.byteLength(JSON.stringify(tvs), 'utf8')
      console.log(`Response size: ${tvs.length} rows`)
      console.log(`Response size: ${size / 1024} KB`)
    } catch (error) {
      console.error('Error occurred while fetching TVS data:', error)
    }

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function initDb() {
  const tvsDbUrl = process.env.TVS_DB_URL

  return createDatabase({
    connectionString: tvsDbUrl,
    application_name: 'GET-TVS-POC',
    ssl: { rejectUnauthorized: false },
    min: 2,
    max: 10,
    keepAlive: false,
  })
}
