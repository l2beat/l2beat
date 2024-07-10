import { readFileSync } from 'fs'
import path from 'path'
import { bridges, getChainNames, layer2s, layer3s } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'

export function getVerificationStatus() {
  noStore()
  return getCachedVerificationStatus()
}

const getCachedVerificationStatus = cache(
  async () => {
    const chainNames = getChainNames([...layer2s, ...layer3s, ...bridges])
    const projects = await getProjectVerificationStatus()
    const contracts = Object.fromEntries(
      chainNames.map((chain) => [chain, getContractVerificationStatus(chain)]),
    )

    const data = {
      projects,
      contracts,
    }
    return VerificationStatus.parse(data)
  },
  ['verificationStatus', env.VERCEL_GIT_COMMIT_SHA],
  { revalidate: 60 * 60 },
)

function getProjectVerificationStatus(): unknown {
  const projects = readFileSync(
    path.join(process.cwd(), '../config/src/verification/projects.json'),
    'utf8',
  )
  return JSON.parse(projects) as unknown
}

function getContractVerificationStatus(chain: string): unknown {
  const filePath = path.join(
    process.cwd(),
    `../config/src/verification/${chain}/verified.json`,
  )
  const contracts = readFileSync(filePath, 'utf8')
  return JSON.parse(contracts) as unknown
}
