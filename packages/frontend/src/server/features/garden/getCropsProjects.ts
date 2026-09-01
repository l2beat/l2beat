import {
  getCropAttestationLedger,
  getCurrentCropAttestation,
} from '@l2beat/config/build/crops/attestations'
import type {
  CropKey,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import {
  CROP_KEYS,
  qualifiesForGarden,
  resolveProjectCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
  getAttestationUrl,
} from '@l2beat/config/build/crops/eas'
import { ps } from '~/server/projects'
import { getGardenProjectPath } from './getGardenProjectPath'

const BASE_URL = 'https://l2beat.com'

/** The current onchain claim: which project ids we stand behind, and when. */
export function getAttestationsMeta() {
  const network = ATTESTATION_NETWORKS[ATTESTATION_NETWORK]
  const ledger = getCropAttestationLedger(ATTESTATION_NETWORK)
  const current = getCurrentCropAttestation(ATTESTATION_NETWORK)
  return {
    network: network.name,
    chainId: network.chainId,
    // Testnet attestations are a rehearsal, not a production claim. Consumers
    // must be able to tell without reading our docs.
    isTestnet: network.isTestnet,
    eas: network.eas,
    schemaUid: ATTESTATION_SCHEMA_UID,
    schema: ATTESTATION_SCHEMA,
    attester: ledger?.attester ?? null,
    // One attestation covers the whole set. Null before the first publish.
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: current.projectIds,
          txHash: current.txHash,
          explorerUrl: getAttestationUrl(network, current.uid),
        }
      : null,
  }
}

export interface CropsApiAttestation {
  uid: string
  revision: number
  reviewedAt: number
  explorerUrl: string
}

export interface CropsApiProject {
  id: string
  slug: string
  name: string
  /** Absolute url of the project page. Null for projects without one. */
  href: string | null
  crops: ResolvedCrops
  /**
   * Whether the review clears the bar for the garden. False while any crop is
   * red, so a consumer showing the garden can apply the same rule we do.
   */
  inGarden: boolean
  /** Whether the current onchain attestation names this project. */
  attested: boolean
  /**
   * The attestation covering this project. Shared by every attested project -
   * one attestation names the whole set - so the uid is the same for all of
   * them and only membership differs.
   */
  attestation: CropsApiAttestation | null
}

/** Sentiment and status only - the prose lives on the per-project endpoint. */
export type CropsApiSummary = Record<
  CropKey,
  Pick<ResolvedCropEvaluation, 'sentiment' | 'status'>
>

export async function getCropsProjects(): Promise<CropsApiProject[]> {
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
    optional: ['scalingInfo', 'privacyInfo'],
  })
  const attestation = getAttestation()
  const attested = new Set(
    getCurrentCropAttestation(ATTESTATION_NETWORK)?.projectIds ?? [],
  )

  return projects
    .map((project) => {
      const path = getGardenProjectPath(project)
      const crops = resolveProjectCrops(project.crops)
      const isAttested = attested.has(project.id)
      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        href: path ? `${BASE_URL}${path}` : null,
        crops,
        inGarden: qualifiesForGarden(crops),
        attested: isAttested,
        // Null rather than omitted, so consumers do not have to distinguish
        // "no field" from "reviewed but not attested yet".
        attestation: isAttested ? attestation : null,
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function toCropsSummary(crops: ResolvedCrops): CropsApiSummary {
  const summary = {} as CropsApiSummary
  for (const key of CROP_KEYS) {
    summary[key] = {
      sentiment: crops[key].sentiment,
      status: crops[key].status,
    }
  }
  return summary
}

function getAttestation(): CropsApiAttestation | null {
  const attestation = getCurrentCropAttestation(ATTESTATION_NETWORK)
  if (!attestation) {
    return null
  }
  return {
    uid: attestation.uid,
    revision: attestation.revision,
    reviewedAt: attestation.reviewedAt,
    explorerUrl: getAttestationUrl(
      ATTESTATION_NETWORKS[ATTESTATION_NETWORK],
      attestation.uid,
    ),
  }
}
