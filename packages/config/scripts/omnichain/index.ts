import { config as dotenv } from 'dotenv'
import { providers } from 'ethers'
import { writeFileSync } from 'fs'

import { getEnv } from '../checkVerifiedContracts/utils'
import { getLZ } from './getLZ'

async function main() {
  const provider = new providers.AlchemyProvider(
    'homestead',
    getEnv('CONFIG_ALCHEMY_API_KEY'),
  )

  const { data, chart } = await getLZ(provider)

  writeFileSync(
    './scripts/omnichain/data.csv',
    data.map((d) => Object.values(d).join(';')).join('\n'),
  )

  writeFileSync(
    './scripts/omnichain/chart.csv',
    chart.map((c) => Object.values(c).join(';')).join('\n'),
  )
}

dotenv()
main().catch((e) => {
  console.error(e)
})
