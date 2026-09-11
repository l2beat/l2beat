import type {
  AttestationNetwork,
  CropAttestation,
  CropAttestationLedger,
  CropAttestationLedgers,
  HexString,
  RevokedCropAttestation,
} from '@l2beat/config'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'

/** The source file behind CROP_ATTESTATIONS, found through the package rather than a directory depth. */
export function getLedgerPath(): string {
  const configRoot = dirname(require.resolve('@l2beat/config/package.json'))
  return join(configRoot, 'src', 'crops', 'attestationData.json')
}

export function emptyLedger(
  network: AttestationNetwork,
  attester: HexString,
): CropAttestationLedger {
  return { network, attester, live: [], revoked: [] }
}

export function withRevoked(
  ledger: CropAttestationLedger,
  revoked: RevokedCropAttestation[],
): CropAttestationLedger {
  const uids = new Set(revoked.map((x) => x.uid))
  return {
    ...ledger,
    live: ledger.live.filter((x) => !uids.has(x.uid)),
    revoked: [...ledger.revoked, ...revoked],
  }
}

export function withAttested(
  ledger: CropAttestationLedger,
  attested: CropAttestation,
): CropAttestationLedger {
  return { ...ledger, live: [...ledger.live, attested] }
}

export function writeLedger(
  ledgers: CropAttestationLedgers,
  path = getLedgerPath(),
): void {
  writeFileSync(path, `${JSON.stringify(sorted(ledgers), null, 2)}\n`)
}

/** Deterministic order, so a run that changes nothing produces no diff. */
export function sorted(
  ledgers: CropAttestationLedgers,
): CropAttestationLedgers {
  const names = Object.keys(ledgers).sort() as AttestationNetwork[]
  const result: CropAttestationLedgers = {}
  for (const name of names) {
    const ledger = ledgers[name]
    if (ledger) {
      result[name] = {
        ...ledger,
        live: byRevision(ledger.live),
        revoked: byRevision(ledger.revoked),
      }
    }
  }
  return result
}

function byRevision<T extends { revision: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.revision - b.revision)
}
