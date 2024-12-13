import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { type ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import { Bridge, DaLayer, Layer2, Layer3 } from '../../projects'
import { getChainNames, getChainNamesForDA } from '../../utils/chains'
import { parseManuallyVerifiedContracts } from '../manuallyVerifiedContracts'

let cache: ManuallyVerifiedContracts | undefined
export function getManuallyVerifiedContracts(
  project: Layer2 | Layer3 | Bridge | DaLayer,
): ManuallyVerifiedContracts {
  if (cache) {
    return cache
  }

  const chainNames =
    project.type === 'DaLayer'
      ? getChainNamesForDA(project)
      : getChainNames(project)
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

  cache = contracts
  return contracts
}
