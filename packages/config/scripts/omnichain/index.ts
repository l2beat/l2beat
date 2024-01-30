import { getEnv } from '@l2beat/backend-tools'
import { providers } from 'ethers'
import { writeFileSync } from 'fs'

import { getInboundLibraries } from './getInboundLibraries'
import { getLZ } from './getLZ'

async function main() {
  const env = getEnv()
  const etherscanApiKey = env.string('ETHERSCAN_API_KEY')
  const provider = new providers.AlchemyProvider(
    'homestead',
    env.string('CONFIG_ALCHEMY_API_KEY'),
  )
  const blockNumber = await provider.getBlockNumber()

  const libs = await getInboundLibraries(provider)

  writeFileSync(
    './scripts/omnichain/libraries.csv',
    JSON.stringify(libs, null, 2),
  )

  const data = await getLZ(blockNumber, etherscanApiKey)

  writeFileSync(
    './scripts/omnichain/data.csv',
    data.map((d) => Object.values(d).join(';')).join('\n'),
  )
}

main().catch((e) => {
  console.error(e)
})
