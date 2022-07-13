import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import { getEnv } from './getEnv'
import { getZkSpaceParameters } from './zkSpace'
import { getZkSwap1Parameters } from './zkSwap1'
import { getZkSwap2Parameters } from './zkSwap2'
import { getZkSyncParameters } from './zkSync'

export async function analyze(projects: string[]) {
  const provider = new providers.AlchemyProvider(
    'mainnet',
    getEnv('ALCHEMY_API_KEY'),
  )

  function includeProject(name: string) {
    if (projects.length === 0) {
      return true
    }
    return projects.includes(name)
  }

  const results = await Promise.all([
    includeProject('zkSync') && getZkSyncParameters(provider),
    includeProject('zkSwap1') && getZkSwap1Parameters(provider),
    includeProject('zkSwap2') && getZkSwap2Parameters(provider),
    includeProject('zkSpace') && getZkSpaceParameters(provider),
  ])

  for (const project of results) {
    if (project) {
      await writeFile(
        `dist/${project.name}.json`,
        JSON.stringify(project, null, 2),
      )
    }
  }
}
