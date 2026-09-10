import { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  type CropsApiProject,
  type CropsAttestationsMeta,
  getAttestationsMeta,
  getCropsProjects,
  toCropsSummary,
} from '~/server/features/garden/getCropsProjects'
import { ps } from '~/server/projects'
import { CROPS_API_URL, type IntegrateEndpoint } from './content'

export interface IntegrateExample {
  request: string
  /** Abbreviated where it repeats itself. */
  response: string
}

export type IntegrateExamples = Record<IntegrateEndpoint, IntegrateExample>

/** A reviewed protocol and one of its contracts, shown in every example. */
export interface IntegrateSample {
  project: CropsApiProject
  contract: { chainId: number; address: string; name: string }
}

const ETHEREUM_CHAIN_ID = 1
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Built from the same config the generator reads rather than typed into the
 * docs, so the sample protocol and its ratings cannot drift. The shapes
 * mirror crops-api's schemas until the garden helpers move into config.
 */
export async function getIntegrateExamples(): Promise<IntegrateExamples> {
  const sample = await pickSample(await getCropsProjects())
  return buildIntegrateExamples(
    sample,
    getAttestationsMeta(),
    Math.floor(Date.now() / 1000),
  )
}

export function buildIntegrateExamples(
  { project, contract }: IntegrateSample,
  attestations: CropsAttestationsMeta,
  generatedAt: number,
): IntegrateExamples {
  const stamp = { attestations, generatedAt, commit: ELIDED_VALUE }
  const address = contract.address.toLowerCase()
  const match = {
    id: project.id,
    slug: project.slug,
    name: project.name,
    href: project.href,
    contractName: contract.name,
    crops: toCropsSummary(project.crops),
    attestation: project.attestation
      ? { uid: project.attestation.uid, revision: project.attestation.revision }
      : null,
  }

  return {
    address: {
      request: `${CROPS_API_URL}/v1/address/${contract.chainId}/${address}.json`,
      response: toExample(
        { ...stamp, chainId: contract.chainId, address, matches: [match] },
        ['attestations'],
      ),
    },
    addresses: {
      request: `${CROPS_API_URL}/v1/addresses.json`,
      response: toExample(
        {
          ...stamp,
          addresses: { [`${contract.chainId}:${address}`]: [match] },
        },
        ['attestations'],
      ),
    },
    project: {
      request: `${CROPS_API_URL}/v1/project/${project.slug}.json`,
      response: toExample({ ...stamp, ...project }, ['attestations']),
    },
    crops: {
      request: `${CROPS_API_URL}/v1/crops.json`,
      response: toExample({ ...stamp, projects: [project] }, ['projects']),
    },
  }
}

/** Prefers a protocol both attested and in the garden that has an Ethereum contract. */
async function pickSample(
  projects: CropsApiProject[],
): Promise<IntegrateSample> {
  const contracts = await loadEthereumContracts()
  const candidates = [
    ...projects.filter((x) => x.attested && x.inGarden),
    ...projects.filter((x) => x.attested),
    ...projects,
  ]
  for (const project of candidates) {
    const contract = contracts.get(project.id)
    if (contract) {
      return { project, contract }
    }
  }
  const project = candidates[0]
  if (!project) {
    throw new Error('No reviewed project to build the CROPS examples from')
  }
  return {
    project,
    contract: {
      chainId: ETHEREUM_CHAIN_ID,
      address: ZERO_ADDRESS,
      name: 'Contract',
    },
  }
}

async function loadEthereumContracts(): Promise<
  Map<string, IntegrateSample['contract']>
> {
  const projects = await ps.getProjects({
    where: ['crops'],
    optional: ['contracts'],
  })
  const contracts = new Map<string, IntegrateSample['contract']>()
  for (const project of projects) {
    const contract = project.contracts?.addresses.ethereum?.[0]
    if (contract) {
      contracts.set(project.id, {
        chainId: ETHEREUM_CHAIN_ID,
        address: ChainSpecificAddress.address(contract.address),
        name: contract.name,
      })
    }
  }
  return contracts
}

// Sentinels no real value can equal, swapped for elisions once stringified.
const ELIDED_OBJECT = ' elided object'
const ELIDED_ARRAY = ' elided array'
const ELIDED_VALUE = ' elided value'
const AND_MORE = ' and more'

/** JSON with the keys in `elide` collapsed and every list of prose cut to its first entry. */
function toExample(value: unknown, elide: string[]): string {
  const json = JSON.stringify(
    value,
    (key, item: unknown) => {
      if (elide.includes(key)) {
        return Array.isArray(item) ? ELIDED_ARRAY : ELIDED_OBJECT
      }
      if (
        Array.isArray(item) &&
        item.length > 1 &&
        item.every((x) => typeof x === 'string')
      ) {
        return [item[0], AND_MORE]
      }
      return item
    },
    2,
  )
  return json
    .replaceAll(JSON.stringify(ELIDED_OBJECT), '{ … }')
    .replaceAll(JSON.stringify(ELIDED_ARRAY), '[ … ]')
    .replaceAll(JSON.stringify(ELIDED_VALUE), '"…"')
    .replaceAll(JSON.stringify(AND_MORE), '…')
}
