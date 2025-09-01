import { ProjectService } from '@l2beat/config'
import * as fs from 'fs'

getChains().catch((e) => {
  console.error('Error occurred while fetching chains', e)
  process.exit(1)
})

async function getChains() {
  const ps = new ProjectService()

  const projects = await ps.getProjects({
    select: ['activityConfig', 'chainConfig'],
    whereNot: ['archivedAt'],
  })

  const chains = []

  for (const project of projects) {
    const blockchainApi = project.chainConfig.apis.find(
      (a) => a.type === 'rpc' || a.type === 'starknet',
    )

    const etherscanApi = project.chainConfig.apis.find(
      (a) => a.type === 'etherscan',
    )

    if (!blockchainApi) {
      continue
    }

    chains.push({
      id: project.id,
      name: project.name,
      blockchainApi,
      explorerUrl: project.chainConfig.explorerUrl,
      etherscanChainId: etherscanApi?.chainId,
    })
  }

  fs.writeFileSync('src/chains.json', JSON.stringify(chains, null, 2))
}
