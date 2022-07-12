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

  const projects = await Promise.all([
    getZkSyncParameters(provider),
    getZkSwap1Parameters(provider),
    getZkSwap2Parameters(provider),
    getZkSpaceParameters(provider),
  ])

  await writeFile('dist/projects.json', JSON.stringify(projects, null, 2))
}
