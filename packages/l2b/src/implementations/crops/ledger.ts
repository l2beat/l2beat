import type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from '@l2beat/config'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import type { Address } from 'viem'
import {
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
  type AttestationNetworkConfig,
} from './easConfig'

/** The source file behind CROP_ATTESTATIONS, found through the package rather than a directory depth. */
export function getLedgerPath(): string {
  const configRoot = dirname(require.resolve('@l2beat/config/package.json'))
  return join(configRoot, 'src', 'crops', 'attestationData.json')
}

/**
 * The committed ledger's entries under a header written from this code's
 * constants, so a run always publishes the network and schema it attests
 * with. A ledger for another network is dropped: its history stays in git.
 */
export function ledgerFor(
  network: AttestationNetworkConfig,
  attester: Address,
  committed: CropAttestationLedger,
): CropAttestationLedger {
  const sameNetwork = committed.network === network.name
  return {
    network: network.name,
    chainId: network.chainId,
    isTestnet: network.isTestnet,
    eas: network.eas,
    explorer: network.explorer,
    schema: ATTESTATION_SCHEMA,
    schemaUid: ATTESTATION_SCHEMA_UID,
    attester,
    live: sameNetwork ? committed.live : [],
    revoked: sameNetwork ? committed.revoked : [],
  }
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
  ledger: CropAttestationLedger,
  path = getLedgerPath(),
): void {
  writeFileSync(path, `${JSON.stringify(sorted(ledger), null, 2)}\n`)
}

/** Deterministic order, so a run that changes nothing produces no diff. */
export function sorted(ledger: CropAttestationLedger): CropAttestationLedger {
  return {
    ...ledger,
    live: byRevision(ledger.live),
    revoked: byRevision(ledger.revoked),
  }
}

function byRevision<T extends { revision: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.revision - b.revision)
}

/**
 * Only crops-attest holds the attester key, so the one realistic way the
 * ledger and the chain diverge is a run whose output was never committed.
 * Refusing to start on top of such a file makes that visible right away.
 */
export function assertLedgerCommitted(path = getLedgerPath()): void {
  const status = execSync(`git status --porcelain -- ${JSON.stringify(path)}`, {
    encoding: 'utf8',
  }).trim()
  if (status !== '') {
    throw new Error(
      `${path} has uncommitted changes from an earlier run. Rebuild config, commit the ledger, then run again.`,
    )
  }
}
