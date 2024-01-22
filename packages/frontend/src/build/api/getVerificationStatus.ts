import { parseManuallyVerifiedContracts } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import fs from 'fs'

// TODO(michalsj): This should be read from the config. Skipping now as it's urgent fix
const supportedDevIds = ['ethereum', 'arbitrum']

export function getVerificationStatus(): VerificationStatus {
  const projects = getProjectVerificationStatus()
  const contracts = Object.fromEntries(
    supportedDevIds.map((devId) => [
      devId,
      getContractVerificationStatus(devId),
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

function getContractVerificationPath(devId: string) {
  return `../config/src/verification/${devId}/verified.json`
}
function getContractVerificationStatus(devId: string): unknown {
  const path = getContractVerificationPath(devId)
  const contracts = fs.readFileSync(path, 'utf8')
  return JSON.parse(contracts) as unknown
}

function getManuallyVerifiedContractsPath(devId: string) {
  return `../config/src/verification/${devId}/manuallyVerified.jsonc`
}
export function getManuallyVerifiedContracts(): ManuallyVerifiedContracts {
  const contracts: ManuallyVerifiedContracts = {}
  for (const devId of supportedDevIds) {
    const path = getManuallyVerifiedContractsPath(devId)
    if (!fs.existsSync(path)) {
      continue
    }
    const data = fs.readFileSync(path, 'utf8')
    contracts[devId] = parseManuallyVerifiedContracts(data)
  }

  return contracts
}
