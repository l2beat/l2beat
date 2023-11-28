import { parseManuallyVerifiedContracts } from '@l2beat/config'
import { ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import fs from 'fs'

const PATH = '../config/src/manuallyVerified.jsonc'

export function getManuallyVerifiedContracts(): ManuallyVerifiedContracts {
  if (!fs.existsSync(PATH)) {
    return {}
  }
  return parseManuallyVerifiedContracts(fs.readFileSync(PATH, 'utf8'))
}
