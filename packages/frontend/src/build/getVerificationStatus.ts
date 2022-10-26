import { VerificationStatus } from '@l2beat/types'
import fs from 'fs'

const PATH = '../config/build/verified.json'

export function getVerificationStatus(isEnabled: boolean): VerificationStatus {
  if (!isEnabled || !fs.existsSync(PATH)) {
    return {
      projects: {},
      contracts: {},
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = JSON.parse(fs.readFileSync(PATH, 'utf8'))
  return VerificationStatus.parse(data)
}
