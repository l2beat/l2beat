import { VerificationStatus } from '@l2beat/shared-pure'
import fs from 'fs'

const PATH = '../config/src/verified.json'

export function getVerificationStatus(): VerificationStatus {
  if (!fs.existsSync(PATH)) {
    return {
      projects: {},
      contracts: {},
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = JSON.parse(fs.readFileSync(PATH, 'utf8'))
  return VerificationStatus.parse(data)
}
