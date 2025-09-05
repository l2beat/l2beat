import { ProjectService } from '@l2beat/config'
import { getTvsChart } from './queries/getTvsChart'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const rollups = await getRollups()
  try {
    await getTvsChart(rollups)
  } catch (error) {
    console.error('Error occurred while fetching TVS chart:', error)
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
