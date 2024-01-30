import { parseManuallyVerifiedContracts } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import fs from 'fs'

export function getVerificationStatus(
  supportedChains: string[],
): VerificationStatus {
  const projects = getProjectVerificationStatus()
  const contracts = Object.fromEntries(
    supportedChains.map((chain) => [
      chain,
      getContractVerificationStatus(chain),
    ]),
  )

  const data = {
    projects,
    contracts,
  }
  return VerificationStatus.parse(data)
}

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

function getManuallyVerifiedContractsPath(chain: string) {
  return `../config/src/verification/${chain}/manuallyVerified.jsonc`
}
export function getManuallyVerifiedContracts(
  supportedChains: string[],
): ManuallyVerifiedContracts {
  const contracts: ManuallyVerifiedContracts = {}
  for (const chain of supportedChains) {
    const path = getManuallyVerifiedContractsPath(chain)
    if (!fs.existsSync(path)) {
      continue
    }
    const data = fs.readFileSync(path, 'utf8')
    contracts[chain] = parseManuallyVerifiedContracts(data)
  }

  return contracts
}
