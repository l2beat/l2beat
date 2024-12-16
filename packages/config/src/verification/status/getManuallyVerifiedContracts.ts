import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { type ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import { parseManuallyVerifiedContracts } from '../manuallyVerifiedContracts'

let cache: ManuallyVerifiedContracts | undefined
export function getManuallyVerifiedContracts(): ManuallyVerifiedContracts {
  if (cache) {
    return cache
  }

  const chains = ['ethereum']
  const contracts: ManuallyVerifiedContracts = {}
  for (const chain of chains) {
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

  cache = contracts
  return contracts
}
