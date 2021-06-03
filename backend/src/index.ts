import { projects } from './projects'
import { setup } from './services'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const { blockInfo, valueLockedChecker } = setup()

  const promised = projects.map(async (project) => {
    return {
      name: project.name,
      bridges: await valueLockedChecker.getProjectTVL(project),
    }
  })
  const results = await Promise.all(promised)
  console.log(results)

  const earliestBlock = projects
    .flatMap((x) => x.bridges)
    .reduce((min, bridge) => Math.min(min, bridge.sinceBlock), Infinity)
  const earliestDate = await blockInfo.getBlockDate(earliestBlock)
  console.log(earliestDate)
}
