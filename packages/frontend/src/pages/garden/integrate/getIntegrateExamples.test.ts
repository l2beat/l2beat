import { resolveProjectCrops } from '@l2beat/config'
import { expect } from 'earl'
import type {
  CropsApiProject,
  CropsAttestationsMeta,
} from '~/server/features/garden/getCropsProjects'
import { CROPS_API_URL } from './content'
import {
  buildIntegrateExamples,
  type IntegrateSample,
} from './getIntegrateExamples'

// Mirrors the crops-api fixtures, so the shapes shown on the Integrate page
// are checked against the same data the generator is tested with.

const ATTESTATION_UID =
  '0xe390390934d3ac2a3f238a0b6f655ec9f847c7dade8240e7450ecd3ef339d24d'

const ATTESTATIONS: CropsAttestationsMeta = {
  network: 'sepolia',
  chainId: 11155111,
  isTestnet: true,
  eas: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
  schemaUid: '0xbe00',
  schema: 'string[] projectIds,uint64 reviewedAt,uint32 revision',
  attester: '0xb55D684Be25227b722a007F6bB8AA706ca18BdDA',
  current: {
    uid: ATTESTATION_UID,
    revision: 3,
    reviewedAt: 1787132641,
    projectIds: ['uniswapv3'],
    txHash: '0x70ef',
    explorerUrl: `https://sepolia.easscan.org/attestation/view/${ATTESTATION_UID}`,
  },
}

const UNISWAP: CropsApiProject = {
  id: 'uniswapv3',
  slug: 'uniswap-v3',
  name: 'Uniswap V3',
  href: 'https://l2beat.com/layer2s/projects/uniswap-v3',
  crops: resolveProjectCrops({
    censorshipResistance: { sentiment: 'good', points: ['One', 'Two'] },
    openSource: { sentiment: 'good', license: 'MIT' },
    privacy: { sentiment: 'good' },
    security: { sentiment: 'good' },
  }),
  inGarden: true,
  attested: true,
  attestation: {
    uid: ATTESTATION_UID,
    revision: 3,
    reviewedAt: 1787132641,
    explorerUrl: `https://sepolia.easscan.org/attestation/view/${ATTESTATION_UID}`,
  },
}

const FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

const SAMPLE: IntegrateSample = {
  project: UNISWAP,
  contract: { chainId: 1, address: FACTORY, name: 'UniswapV3Factory' },
}

describe(buildIntegrateExamples.name, () => {
  const examples = buildIntegrateExamples(SAMPLE, ATTESTATIONS, 1787200000)

  it('points every request at the static host', () => {
    expect(examples.address.request).toEqual(
      `${CROPS_API_URL}/v1/address/1/${FACTORY.toLowerCase()}.json`,
    )
    expect(examples.project.request).toEqual(
      `${CROPS_API_URL}/v1/project/uniswap-v3.json`,
    )
    expect(examples.crops.request).toEqual(`${CROPS_API_URL}/v1/crops.json`)
  })

  it('shows the address file keyed by chain id and lowercase address', () => {
    const response = parseExample(examples.address.response)
    expect(response).toHaveSubset({
      chainId: 1,
      address: FACTORY.toLowerCase(),
      generatedAt: 1787200000,
    })
    expect(response.matches).toEqual([
      {
        id: 'uniswapv3',
        slug: 'uniswap-v3',
        name: 'Uniswap V3',
        href: 'https://l2beat.com/layer2s/projects/uniswap-v3',
        contractName: 'UniswapV3Factory',
        crops: {
          censorshipResistance: { sentiment: 'good', status: 'reviewed' },
          openSource: { sentiment: 'good', status: 'reviewed' },
          privacy: { sentiment: 'good', status: 'reviewed' },
          security: { sentiment: 'good', status: 'reviewed' },
        },
        attestation: { uid: ATTESTATION_UID, revision: 3 },
      },
    ])
  })

  it('shows the project file with the full evaluation', () => {
    const response = parseExample(examples.project.response)
    expect(response).toHaveSubset({
      id: 'uniswapv3',
      inGarden: true,
      attested: true,
    })
    expect(response.attestation).toEqual(UNISWAP.attestation)
  })

  it('shows the attestations in full only on the whole garden', () => {
    expect(examples.crops.response).toInclude(ATTESTATION_UID)
    expect(examples.address.response).not.toInclude(ATTESTATIONS.eas)
    expect(examples.project.response).not.toInclude(ATTESTATIONS.eas)
  })

  it('elides the commit and long lists so the snippets stay short', () => {
    expect(examples.project.response).toInclude('"commit": "…"')
    expect(examples.project.response).toInclude('"One",\n')
    expect(examples.project.response).not.toInclude('"Two"')
  })
})

/** The snippets contain elisions, which are restored to valid JSON here. */
function parseExample(response: string): Record<string, unknown> {
  return JSON.parse(
    response
      .replaceAll('{ … }', '{}')
      .replaceAll('[ … ]', '[]')
      .replaceAll('"…"', '"elided"')
      .replaceAll('…', '"elided"'),
  )
}
