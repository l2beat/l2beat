import { existsSync, readFileSync } from 'fs'
import path from 'path'
import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  getChainNames,
  getChainNamesForDA,
  parseManuallyVerifiedContracts,
} from '@l2beat/config'
import { type ManuallyVerifiedContracts } from '@l2beat/shared-pure'

type Project = Layer2 | Layer3 | Bridge | DaLayer

export async function getManuallyVerifiedContracts(project: Project) {
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

  return contracts
}
