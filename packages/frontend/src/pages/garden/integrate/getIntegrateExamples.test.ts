import type { ProjectScalingInfo } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { CropsAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { CROPS_API_URL } from './content'
import { elided } from './exampleValue'
import {
  buildIntegrateExamples,
  type ExampleProject,
} from './getIntegrateExamples'

const ATTESTATION_UID =
  '0xe390390934d3ac2a3f238a0b6f655ec9f847c7dade8240e7450ecd3ef339d24d'

const META: CropsAttestationsMeta = {
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

const FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

const SAMPLE: ExampleProject = {
  id: 'uniswapv3',
  slug: 'uniswap-v3',
  name: 'Uniswap V3',
  scalingInfo: {} as ProjectScalingInfo,
  crops: {
    censorshipResistance: { sentiment: 'good', points: ['One', 'Two'] },
    openSource: { sentiment: 'good', license: 'MIT' },
    privacy: { sentiment: 'good' },
    security: { sentiment: 'good' },
  },
  contracts: {
    addresses: {
      ethereum: [
        {
          address: ChainSpecificAddress(`eth:${FACTORY}`),
          name: 'UniswapV3Factory',
        },
      ],
    },
  },
}

describe(buildIntegrateExamples.name, () => {
  // crops-api tests its generator; these check the examples mirror its files,
  // addressed at the static host and cut short where agreed.
  const examples = buildIntegrateExamples(SAMPLE, META, 1787200000)

  it('points every request at the static host, with the address lowercased', () => {
    expect(examples.address.request).toEqual(
      `${CROPS_API_URL}/v1/address/1/${FACTORY.toLowerCase()}.json`,
    )
    expect(examples.project.request).toEqual(
      `${CROPS_API_URL}/v1/project/uniswap-v3.json`,
    )
    expect(examples.crops.request).toEqual(`${CROPS_API_URL}/v1/crops.json`)
  })

  it('shows the address match as crops-api writes it', () => {
    expect(examples.address.response).toHaveSubset({
      chainId: 1,
      address: FACTORY.toLowerCase(),
      generatedAt: 1787200000,
      matches: [
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
      ],
    })
  })

  it('shows the project file with its attestation, in the garden', () => {
    expect(examples.project.response).toHaveSubset({
      id: 'uniswapv3',
      inGarden: true,
      attestation: {
        uid: ATTESTATION_UID,
        revision: 3,
        reviewedAt: 1787132641,
        explorerUrl: META.current?.explorerUrl,
      },
    })
  })

  it('shows the attestations in full only on the whole garden', () => {
    expect(examples.crops.response).toHaveSubset({ attestations: META })
    expect(examples.address.response).toHaveSubset({
      attestations: elided('object'),
    })
    expect(examples.project.response).toHaveSubset({
      attestations: elided('object'),
    })
  })

  it('elides the commit and cuts a list of prose to its first entry', () => {
    expect(examples.project.response).toHaveSubset({
      commit: elided('value'),
      crops: expect.subset({
        censorshipResistance: expect.subset({
          points: ['One', elided('value')],
        }),
      }),
    })
  })
})
