import { getCropsAddressIndex } from '~/server/features/garden/getCropsAddressIndex'
import {
  type CropsApiSummary,
  getAttestationsMeta,
  getCropsProjects,
  toCropsSummary,
} from '~/server/features/garden/getCropsProjects'
import { parseCropsAddress } from '~/server/features/garden/parseCropsAddress'

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
  const [index, projects] = await Promise.all([
    getCropsAddressIndex(),
    getCropsProjects(),
  ])
  const projectById = new Map(projects.map((x) => [x.id, x]))

  const results: GardenLookupResult[] = []
  for (const query of queries) {
    const parsed = await parseCropsAddress(query)
    if (!parsed) {
      results.push({
        query,
        matches: [],
        error:
          'Expected chain:address, where chain is a short name (eth), a long name (ethereum) or a chain id (1).',
      })
      continue
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

    results.push({ query, matches })
  }

  return { attestations: getAttestationsMeta(), results }
}
