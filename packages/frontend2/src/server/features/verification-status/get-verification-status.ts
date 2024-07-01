import fs from 'fs'
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
    const projects = getProjectVerificationStatus()
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

const PROJECTS_VERIFICATION_PATH = '../config/src/verification/projects.json'
function getProjectVerificationStatus(): unknown {
  const projects = fs.readFileSync(PROJECTS_VERIFICATION_PATH, 'utf8')
  return JSON.parse(projects) as unknown
}

function getContractVerificationPath(chain: string) {
  return `../config/src/verification/${chain}/verified.json`
}
function getContractVerificationStatus(chain: string): unknown {
  const path = getContractVerificationPath(chain)
  const contracts = fs.readFileSync(path, 'utf8')
  return JSON.parse(contracts) as unknown
}
