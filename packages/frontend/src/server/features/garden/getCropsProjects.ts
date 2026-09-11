import type {
  AttestationNetworkConfig,
  CropKey,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config'
import { CROP_COLUMNS } from '~/components/garden/crops'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { ps } from '~/server/projects'
import { getGardenProjectPath } from './getGardenProjectPath'

export interface CropsAttestationsMeta {
  network: string
  chainId: number
  isTestnet: boolean
  eas: string
  schemaUid: string
  schema: string
  attester: string | null
  current: {
    uid: string
    revision: number
    reviewedAt: number
    projectIds: string[]
    txHash: string
    explorerUrl: string
  } | null
}

/** Read from the config build, so no RPC call is needed. */
export async function getAttestationsMeta(): Promise<CropsAttestationsMeta> {
  const { network, schema, networks, ledgers, current } =
    await ps.getCropAttestations()
  const config = networks[network]
  return {
    network: config.name,
    chainId: config.chainId,
    isTestnet: config.isTestnet,
    eas: config.eas,
    schemaUid: schema.uid,
    schema: schema.definition,
    attester: ledgers[network]?.attester ?? null,
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: current.projectIds,
          txHash: current.txHash,
          explorerUrl: getAttestationUrl(config, current.uid),
        }
      : null,
  }
}

export function getAttestationUrl(
  network: AttestationNetworkConfig,
  uid: string,
): string {
  return `${network.explorer}/attestation/view/${uid}`
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
  /** Null for projects without a page. */
  href: string | null
  crops: ResolvedCrops
  /** False while any crop is red - see `ProjectGardenInfo`. */
  inGarden: boolean
  attested: boolean
  /** One attestation names the whole set, so this is the same for every attested project. */
  attestation: CropsApiAttestation | null
}

/** Sentiment and status only - the prose lives on the per-project endpoint. */
export type CropsApiSummary = Record<
  CropKey,
  Pick<ResolvedCropEvaluation, 'sentiment' | 'status'>
>

export async function getCropsProjects(): Promise<CropsApiProject[]> {
  const [projects, attestations] = await Promise.all([
    ps.getProjects({
      where: ['gardenInfo'],
      select: ['gardenInfo'],
      optional: ['scalingInfo', 'privacyInfo'],
    }),
    getAttestationsMeta(),
  ])
  const attestation = toApiAttestation(attestations)
  const attested = new Set(attestations.current?.projectIds ?? [])

  return projects
    .map((project) => {
      const path = getGardenProjectPath(project)
      const isAttested = attested.has(project.id)
      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        href: path ? `${PRODUCTION_ORIGIN}${path}` : null,
        crops: project.gardenInfo.crops,
        inGarden: project.gardenInfo.inGarden,
        attested: isAttested,
        attestation: isAttested ? attestation : null,
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function toCropsSummary(crops: ResolvedCrops): CropsApiSummary {
  const summary = {} as CropsApiSummary
  for (const { key } of CROP_COLUMNS) {
    summary[key] = {
      sentiment: crops[key].sentiment,
      status: crops[key].status,
    }
  }
  return summary
}

function toApiAttestation(
  meta: CropsAttestationsMeta,
): CropsApiAttestation | null {
  if (!meta.current) {
    return null
  }
  return {
    uid: meta.current.uid,
    revision: meta.current.revision,
    reviewedAt: meta.current.reviewedAt,
    explorerUrl: meta.current.explorerUrl,
  }
}
