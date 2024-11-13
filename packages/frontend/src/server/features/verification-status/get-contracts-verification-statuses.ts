import { readFileSync } from 'fs'
import path from 'path'
import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  getChainNames,
  getChainNamesForDA,
} from '@l2beat/config'
import { ContractsVerificationStatuses } from '@l2beat/shared-pure'

type Project = Layer2 | Layer3 | Bridge | DaLayer

export function getContractsVerificationStatuses(project: Project) {
  const chainNames =
    project.type === 'DaLayer'
      ? getChainNamesForDA(project)
      : getChainNames(project)
  const contracts = Object.fromEntries(
    chainNames.map((chain) => [chain, readContractVerificationStatus(chain)]),
  )

  return ContractsVerificationStatuses.parse(contracts)
}

function readContractVerificationStatus(chain: string): unknown {
  const filePath = path.join(
    process.cwd(),
    `../config/src/verification/${chain}/verified.json`,
  )
  const contracts = readFileSync(filePath, 'utf8')
  return JSON.parse(contracts) as unknown
}
