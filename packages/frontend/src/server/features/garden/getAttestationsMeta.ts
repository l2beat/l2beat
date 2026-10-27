import {
  type CropsAttestationsMeta,
  getCropsAttestationsMeta,
} from '@l2beat/config'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export type { CropsAttestationsMeta }

/**
 * The attester's current attestation, as the backend last read it from EAS.
 * Only the projects it names count as reviewed: a CROPS evaluation in config
 * that no attestation names yet is not shown.
 * Stamped with the source the backend read it from, not this build's config,
 * so after a source change it shows the previous attestation, not nothing,
 * until the backend switches.
 */
export async function getAttestationsMeta(): Promise<CropsAttestationsMeta> {
  if (env.MOCK) {
    return getMockAttestationsMeta()
  }
  const record = await getDb().cropAttestation.find()
  return getCropsAttestationsMeta(record, record)
}

/** Without a database, every project with an evaluation reads as attested. */
async function getMockAttestationsMeta(): Promise<CropsAttestationsMeta> {
  const projects = await ps.getProjects({ where: ['crops'] })
  return getCropsAttestationsMeta({
    uid: `0x${'0'.repeat(64)}`,
    revision: 1,
    reviewedAt: 0,
    projectIds: projects.map((p) => p.id.toString()),
    txHash: `0x${'0'.repeat(64)}`,
    blockNumber: 0,
  })
}

/**
 * TODO: remove once CROPS launches. Until the attester Safe attests on
 * Ethereum, the projects the last Sepolia attestation named stay shown,
 * without an attestation.
 */
const PRE_LAUNCH_PROJECT_IDS = [
  'aztecnetworkv6',
  'ethscriptions',
  'tornado-cash',
  'umbra',
  'uniswapv3',
]

/** The projects whose CROPS evaluation is shown. */
export function getShownCropsProjectIds(
  meta: CropsAttestationsMeta,
): Set<string> {
  return new Set(meta.current?.projectIds ?? PRE_LAUNCH_PROJECT_IDS)
}

/** Whether the project's CROPS evaluation is shown. */
export async function isCropsShown(projectId: string): Promise<boolean> {
  return getShownCropsProjectIds(await getAttestationsMeta()).has(projectId)
}
