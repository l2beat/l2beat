import { getCropsAddressIndex } from '~/server/features/garden/getCropsAddressIndex'
import {
  type CropsApiSummary,
  getAttestationsMeta,
  getCropsProjects,
  toCropsSummary,
} from '~/server/features/garden/getCropsProjects'
import {
  getChainLookup,
  parseCropsAddress,
} from '~/server/features/garden/parseCropsAddress'

export interface GardenLookupMatch {
  id: string
  slug: string
  name: string
  href: string | null
  contractName: string
  crops: CropsApiSummary
  attestation: { uid: string; revision: number } | null
}

export interface GardenLookupResult {
  query: string
  matches: GardenLookupMatch[]
  /** Set when the query could not be parsed as chain:address. */
  error?: string
}

export async function getGardenLookupApiData(queries: string[]) {
  const [index, projects, chains, attestations] = await Promise.all([
    getCropsAddressIndex(),
    getCropsProjects(),
    getChainLookup(),
    getAttestationsMeta(),
  ])
  const projectById = new Map(projects.map((x) => [x.id, x]))

  const results: GardenLookupResult[] = queries.map((query) => {
    const parsed = parseCropsAddress(query, chains)
    if (!parsed) {
      return {
        query,
        matches: [],
        error:
          'Expected chain:address, where chain is a short name (eth), a long name (ethereum) or a chain id (1).',
      }
    }

    const matches = index
      .lookup(parsed.chain, parsed.address)
      .flatMap((match): GardenLookupMatch[] => {
        const project = projectById.get(match.projectId)
        if (!project) {
          return []
        }
        return [
          {
            id: project.id,
            slug: project.slug,
            name: project.name,
            href: project.href,
            contractName: match.targetName,
            crops: toCropsSummary(project.crops),
            attestation: project.attestation
              ? {
                  uid: project.attestation.uid,
                  revision: project.attestation.revision,
                }
              : null,
          },
        ]
      })

    return { query, matches }
  })

  return { attestations, results }
}
