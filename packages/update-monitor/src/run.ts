import dotenv from 'dotenv'
import { providers } from 'ethers'
import { writeFile } from 'fs/promises'

import { getZkSyncParameters } from './zkSync'

export async function run() {
  dotenv.config()
  const alchemyApiKey = process.env.ALCHEMY_API_KEY
  const provider = new providers.AlchemyProvider('mainnet', alchemyApiKey)

  const projects = await Promise.all([getZkSyncParameters(provider)])

  await writeFile('dist/projects.json', JSON.stringify(projects, null, 2))
}
