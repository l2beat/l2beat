import type { ProjectCrops, ProjectScalingInfo } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { CropsProject, GeneratorInput } from '../generateCropsSite'
import type { CropsAttestationsMeta } from '../schemas'

// Plain fixtures shared by the generator and the OpenAPI agreement tests:
// contracts, a proxy with an implementation, a permission holder, a shared
// contract, a project without a page, and an attested and an unattested project.

export const FACTORY = ChainSpecificAddress(
  'eth:0x1F98431c8aD98523631AE4a59f267346ea31F984',
)
export const PROXY = ChainSpecificAddress(
  'eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
)
export const IMPLEMENTATION = ChainSpecificAddress(
  'eth:0x03893a7c7463AE47D46bc7f091665f1893656003',
)
export const MULTISIG = ChainSpecificAddress(
  'eth:0x07687e702b410Fa43f4cB4Af7FA097918ffD2730',
)
export const ARBITRUM_CONTRACT = ChainSpecificAddress(
  'arb1:0x1F98431c8aD98523631AE4a59f267346ea31F984',
)

/** How the generated site keys an address, without the chain prefix. */
export function lowerAddress(address: ChainSpecificAddress): string {
  return ChainSpecificAddress.address(address).toLowerCase()
}

const ALL_GOOD: ProjectCrops = {
  censorshipResistance: { sentiment: 'good' },
  openSource: { sentiment: 'good', license: 'MIT' },
  privacy: { sentiment: 'good' },
  security: { sentiment: 'good' },
}

const ONE_BAD: ProjectCrops = {
  ...ALL_GOOD,
  security: { sentiment: 'bad', missing: ['No audits.'] },
}

export const ATTESTATION_UID =
  '0xe390390934d3ac2a3f238a0b6f655ec9f847c7dade8240e7450ecd3ef339d24d'

export const LEDGER: CropsAttestationsMeta = {
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

export const UNISWAP: CropsProject = {
  id: 'uniswapv3',
  slug: 'uniswap-v3',
  name: 'Uniswap V3',
  crops: ALL_GOOD,
  scalingInfo: {} as ProjectScalingInfo,
  contracts: {
    addresses: {
      ethereum: [
        { address: FACTORY, name: 'UniswapV3Factory' },
        {
          address: PROXY,
          name: 'Router',
          upgradeability: { implementations: [IMPLEMENTATION] },
        },
      ],
    },
  },
  permissions: {
    ethereum: {
      actors: [{ name: 'Governance', accounts: [{ address: MULTISIG }] }],
    },
  },
}

/** Shares the factory with Uniswap, has no page and one red crop, and is not attested. */
export const OTHER: CropsProject = {
  id: 'other',
  slug: 'other',
  name: 'Other',
  crops: ONE_BAD,
  contracts: {
    addresses: {
      ethereum: [{ address: FACTORY, name: 'SharedFactory' }],
      arbitrum: [{ address: ARBITRUM_CONTRACT, name: 'ArbitrumThing' }],
    },
  },
}

export const FIXTURE_INPUT: GeneratorInput = {
  projects: [OTHER, UNISWAP],
  chains: { ethereum: 1, arbitrum: 42161 },
  ledger: LEDGER,
  commit: 'abc123',
  generatedAt: 1_800_000_000,
}
