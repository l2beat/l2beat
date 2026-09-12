import type {
  AttestationNetwork,
  CropAttestationLedger,
  CropAttestationLedgers,
} from '@l2beat/config'
import { writeFileSync } from 'fs'
import { join } from 'path'

// Resolved from this file rather than cwd so the command works from anywhere.
export function getLedgerPath(): string {
  return join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'config',
    'src',
    'crops',
    'attestationData.json',
  )
}

export function writeLedger(
  ledgers: CropAttestationLedgers,
  path = getLedgerPath(),
): void {
  writeFileSync(path, `${JSON.stringify(sorted(ledgers), null, 2)}\n`)
}

// Deterministic order, so a run that changes nothing produces no diff.
function sorted(ledgers: CropAttestationLedgers): CropAttestationLedgers {
  const names = Object.keys(ledgers).sort() as AttestationNetwork[]
  const result: CropAttestationLedgers = {}
  for (const name of names) {
    const ledger = ledgers[name]
    if (ledger) {
      result[name] = sortedLedger(ledger)
    }
  }
  return result
}

function sortedLedger(ledger: CropAttestationLedger): CropAttestationLedger {
  return {
    ...ledger,
    live: byRevision(ledger.live),
    revoked: byRevision(ledger.revoked),
  }
}

function byRevision<T extends { revision: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.revision - b.revision)
}
