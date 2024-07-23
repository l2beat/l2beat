import { readFileSync } from 'fs'
import path from 'path'
import { bridges, getChainNames, layer2s, layer3s } from '@l2beat/config'
import { ContractsVerificationStatuses } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'

export function getContractsVerificationStatuses() {
  noStore()
  return getCachedContractsVerificationStatuses()
}

const getCachedContractsVerificationStatuses = cache(
  async () => {
    const chainNames = getChainNames([...layer2s, ...layer3s, ...bridges])
    const contracts = Object.fromEntries(
      chainNames.map((chain) => [chain, readContractVerificationStatus(chain)]),
    )

    return ContractsVerificationStatuses.parse(contracts)
  },
  ['contractVerificationStatuses', env.VERCEL_GIT_COMMIT_SHA],
  // This is calculated from project files, so we can cache indefinitely for the same GIT_COMMIT_SHA.
  { revalidate: false },
)

function readContractVerificationStatus(chain: string): unknown {
  const filePath = path.join(
    process.cwd(),
    `../config/src/verification/${chain}/verified.json`,
  )
  const contracts = readFileSync(filePath, 'utf8')
  return JSON.parse(contracts) as unknown
}
