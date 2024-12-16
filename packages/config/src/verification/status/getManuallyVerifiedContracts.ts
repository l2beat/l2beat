import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import { type ManuallyVerifiedContracts } from '@l2beat/shared-pure'
import { parseManuallyVerifiedContracts } from '../manuallyVerifiedContracts'

let cache: ManuallyVerifiedContracts | undefined
export function getManuallyVerifiedContracts(): ManuallyVerifiedContracts {
  if (cache) {
    return cache
  }

  const contracts: ManuallyVerifiedContracts = {}
  const verificationPath = path.join(
    process.cwd(),
    '../config/src/verification/',
  )
  const entries = readdirSync(verificationPath)
  for (const entry of entries) {
    const chainPath = path.join(verificationPath, entry)
    if (!statSync(chainPath).isDirectory) {
      continue
    }

    const filePath = path.join(chainPath, `manuallyVerified.jsonc`)
    if (!existsSync(filePath)) {
      continue
    }
    const data = readFileSync(filePath, 'utf8')
    contracts[entry] = parseManuallyVerifiedContracts(data)
  }

  cache = contracts
  return contracts
}
