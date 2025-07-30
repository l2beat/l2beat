import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const polygonzkevmprover: BaseProject = {
  id: ProjectId('polygonzkevmprover'),
  slug: 'polygonzkevmprover',
  name: 'Polygon zkEVM',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-18')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Polygon zkEVM prover originally built by Polygon Zero team to prove state transition of Polygon zkEVM chain.',
    links: {
      documentation: [
        'https://docs.polygon.technology/zkEVM/architecture/zkprover/',
      ],
      repositories: [
        'https://github.com/0xPolygon/zkevm-prover',
        'https://github.com/0xPolygon/zkevm-proverjs',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Polygon Zero',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK['PIL-STARK'],
        ZK_CATALOG_TAGS.ISA.ZkASM,
        // ZK_CATALOG_TAGS.Arithmetization.eAIR,
        ZK_CATALOG_TAGS.Field.Goldilocks,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        ...TRUSTED_SETUPS.PolygonZkEVM,
      },
    ],
    verifierHashes: [
      {
        // Custom verifier ID: SHA256 hash of the following values from the verifier smart contract
        // abi packed in the same order they are defined: verification key data,
        // omegas, verifier preprocessed inputs (from k1 to X2y2)
        hash: '0x28ddf3744fb9b64bc428bee318e026bee0cf210e23ff5932f645e32aa916c28f',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          'https://etherscan.io/address/0x0775e11309d75aA6b0967917fB0213C5673eDf81',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('astarzkevm'),
          ProjectId('gpt'),
          ProjectId('wirex'),
          ProjectId('witness'),
        ],
      },
      {
        // Custom verifier ID: SHA256 hash of the following values from the verifier smart contract
        // abi packed in the same order they are defined: verification key data,
        // omegas, verifier preprocessed inputs (from k1 to X2y2)
        hash: '0x237bc5d6efad6d844534c4a45f5f19fa86344615ac00054821915c219e9abd81',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          'https://etherscan.io/address/0x9B9671dB83CfcB4508bF361942488C5cA2b1286D',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('polygonzkevm'),
          ProjectId('lumia'),
          ProjectId('silicon'),
          ProjectId('ternoa'),
          ProjectId('penchain'),
        ],
      },
      {
        // Custom verifier ID: SHA256 hash of the following values from the verifier smart contract
        // abi packed in the same order they are defined: verification key data,
        // omegas, verifier preprocessed inputs (from k1 to X2y2)
        hash: '0xd7331eca890a6201708336d89e099d242f8b5b57ead785225220f7ef36b6aaf6',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Snarkjs,
        knownDeployments: [
          'https://etherscan.io/address/0x455ac63E96e6a64EA59C6Da0D8F90FCa3F1535aB',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('xlayer')],
      },
    ],
  },
}
