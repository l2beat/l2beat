import { ProjectService } from '@l2beat/config'
import { execute } from './queries'
import { getLogger } from './utils'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const logger = getLogger()
  const rollups = await getRollups()
  try {
    const result = await execute({
      name: 'getTvsChartQuery',
      args: [rollups],
    })

    const size = Buffer.byteLength(JSON.stringify(result), 'utf8')
    logger.info(`Data size: ${size / 1024} KB`)
  } catch (error) {
    logger.error('Error occurred while fetching TVS chart:', error)
  }

  process.exit(0)
}

async function getRollups() {
  const ps = new ProjectService()

  const projects = await ps.getProjects({
    select: ['tvsConfig', 'scalingInfo'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  return projects
    .filter(
      (project) =>
        project.scalingInfo.type === 'Optimistic Rollup' ||
        project.scalingInfo.type === 'ZK Rollup',
    )
    .map((project) => project.id)
}
