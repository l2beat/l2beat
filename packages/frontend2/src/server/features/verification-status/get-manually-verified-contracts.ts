import {
  bridges,
  getChainNames,
  layer2s,
  layer3s,
  parseManuallyVerifiedContracts,
} from '@l2beat/config'
import { type ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

export function getManuallyVerifiedContracts(): ManuallyVerifiedContracts {
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
}
