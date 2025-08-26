import { getEnv } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { createDatabase, type TokenMetadataRecord } from '@l2beat/database'
import { command, optional, positional, run, string } from 'cmd-ts'

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
      select: ['tvsConfig'],
    })

    const tokens: TokenMetadataRecord[] = projects.flatMap((project) =>
      project.tvsConfig.map((token) => {
        return {
          tokenId: token.id,
          projectId: project.id,
          source: token.source,
          category: token.category,
          isAssociated: token.isAssociated,
        }
      }),
    )

    try {
      const start = Date.now()
      await db.tvsTokenMetadata.insertMany(tokens)
      const end = Date.now()

      console.log(`Executed in ${end - start}ms`)
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
