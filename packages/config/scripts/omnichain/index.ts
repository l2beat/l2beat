import { config as dotenv } from 'dotenv'
import { providers } from 'ethers'
import { writeFileSync } from 'fs'

import { getEnv } from '../checkVerifiedContracts/utils'
import { getInboundLibraries } from './getInboundLibraries'
import { getLZ } from './getLZ'

async function main() {
  const provider = new providers.AlchemyProvider(
    'homestead',
    getEnv('CONFIG_ALCHEMY_API_KEY'),
  )
  const blockNumber = await provider.getBlockNumber()

  const libs = await getInboundLibraries(provider)

  writeFileSync(
    './scripts/omnichain/libraries.csv',
    JSON.stringify(libs, null, 2),
  )

  const data = await getLZ(blockNumber)

  writeFileSync(
    './scripts/omnichain/data.csv',
    data.map((d) => Object.values(d).join(';')).join('\n'),
  )
}

dotenv()
main().catch((e) => {
  console.error(e)
})
