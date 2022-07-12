import dotenv from 'dotenv'
import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import { getZkSpaceParameters } from './zkSpace'
import { getZkSwap1Parameters } from './zkSwap1'
import { getZkSwap2Parameters } from './zkSwap2'
import { getZkSyncParameters } from './zkSync'

export async function run() {
  dotenv.config()
  const alchemyApiKey = process.env.ALCHEMY_API_KEY
  if (!alchemyApiKey) {
    throw new Error('Missing env variable ALCHEMY_API_KEY')
  }
  const provider = new providers.AlchemyProvider('mainnet', alchemyApiKey)

  const args = process.argv.slice(2)
  function includeProject(name: string) {
    if (args.length === 0) {
      return true
    }
    return args.includes(name)
  }

  const projects = await Promise.all([
    includeProject('zkSync') && getZkSyncParameters(provider),
    includeProject('zkSwap1') && getZkSwap1Parameters(provider),
    includeProject('zkSwap2') && getZkSwap2Parameters(provider),
    includeProject('zkSpace') && getZkSpaceParameters(provider),
  ])

  for (const project of projects) {
    if (project) {
      await writeFile(
        `dist/${project.name}.json`,
        JSON.stringify(project, null, 2),
      )
    }
  }
}
