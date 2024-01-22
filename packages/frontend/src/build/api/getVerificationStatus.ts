import { VerificationStatus } from '@l2beat/shared-pure'
import fs from 'fs'

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
