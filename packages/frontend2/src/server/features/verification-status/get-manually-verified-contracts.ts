import { existsSync, readFileSync } from 'fs'
import path from 'path'
import {
  bridges,
  getChainNames,
  layer2s,
  layer3s,
  parseManuallyVerifiedContracts,
} from '@l2beat/config'
import { type ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'

export function getManuallyVerifiedContracts() {
  noStore()
  return getCachedManuallyVerifiedContracts()
}

export const getCachedManuallyVerifiedContracts = cache(
  async () => {
    const chainNames = getChainNames([...layer2s, ...layer3s, ...bridges])
    const contracts: ManuallyVerifiedContracts = {}
    for (const chain of chainNames) {
      const filePath = path.join(
        process.cwd(),
        `../config/src/verification/${chain}/manuallyVerified.jsonc`,
      )
      if (!existsSync(filePath)) {
        continue
      }
      const data = readFileSync(filePath, 'utf8')
      contracts[chain] = parseManuallyVerifiedContracts(data)
    }

    return contracts
  },
  ['manuallyVerifiedContracts', env.VERCEL_GIT_COMMIT_SHA],
  // This is calculated from project files, so we can cache indefinitely for the same GIT_COMMIT_SHA.
  { revalidate: false },
)
