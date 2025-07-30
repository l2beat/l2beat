import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const loopringprover: BaseProject = {
  id: ProjectId('loopringprover'),
  slug: 'loopringprover',
  name: 'Loopring',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-23')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A Groth16-based proof system designed by Loopring for proving custom predefined state transitions of their L2.',
    links: {
      websites: ['https://loopring.org'],
      documentation: [
        'https://github.com/Loopring/whitepaper',
        'https://github.com/degatedev/protocols/blob/degate_mainnet/Smart%20Contract%20Design.md',
        'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md',
      ],
      repositories: [
        'https://github.com/Loopring/protocols/tree/master/packages/loopring_v3',
      ],
      socialMedia: ['https://x.com/loopringorg'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Loopring',
    techStack: {
      finalWrap: [
        ZK_CATALOG_TAGS.Groth16.EthSnarks,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.Arithmetization.R1CS,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        ...TRUSTED_SETUPS.Loopring,
      },
    ],
    verifierHashes: [
      {
        // Custom hash computation: SHA256 hash of the abi packed vk array
        // obtained by calling getVerificationKey(blockType = 0, blockSize = 16, blockVersion = 17)
        // on the smart contract
        hash: '0x4c18cccb70be9bd6c438cc6d558d3451114af2fcd2e45a4286afecf2f327b80d',
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        knownDeployments: [
          'https://etherscan.io/address/0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('loopring')],
      },
      {
        // Custom hash computation: SHA256 hash of the abi packed vk array
        // obtained by calling getVerificationKey(blockType = 0, blockSize = 32, blockVersion = 17)
        // on the smart contract
        hash: '0xf29dd53bbc041a71ed0ce5812b2795151a93d233f0b3d73205eaf1e3b5ebbb18',
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        knownDeployments: [
          'https://etherscan.io/address/0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('loopring')],
      },
      {
        // Custom hash computation: SHA256 hash of the abi packed vk array
        // obtained by calling getVerificationKey(blockType = 0, blockSize = 64, blockVersion = 17)
        // on the smart contract
        hash: '0xc1b762cee5cb2d339e88e5fc7ef9b3ab62887b150929f6e3599fef289838bae0',
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        knownDeployments: [
          'https://etherscan.io/address/0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('loopring')],
      },
      {
        // Custom hash computation: SHA256 hash of the abi packed vk array
        // obtained by calling getVerificationKey(blockType = 0, blockSize = 128, blockVersion = 17)
        // on the smart contract
        hash: '0x998a7b6031386f1ce64bbbfc9375b341ee4385289c1d4f121a62f1e3c73d3efb',
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        knownDeployments: [
          'https://etherscan.io/address/0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('loopring')],
      },
      {
        // Custom hash computation: SHA256 hash of the abi packed vk array
        // obtained by calling getVerificationKey(blockType = 0, blockSize = 256, blockVersion = 17)
        // on the smart contract
        hash: '0x765eff9d78d1abfe496040f999714d58df54c49753db801633762dd48b74f9ae',
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        knownDeployments: [
          'https://etherscan.io/address/0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('loopring')],
      },
      {
        // Custom hash computation: SHA256 hash of the value hardcoded into VerificationKeys.sol library
        // for the current deployment for blockType == 0 && blockSize == 25 && blockVersion == 0.
        // Arrays vk and vk_gammaABC are concatenated into vkeys array, which is abi packed and hashed
        hash: '0x297a8528055635ba2ee3e292ff3d8e871a10900f2e514e45ef2f2434ca8f8945',
        proofSystem: ZK_CATALOG_TAGS.Groth16.EthSnarks,
        knownDeployments: [
          'https://etherscan.io/address/0xE3B7fE3ce0fa54C5AC7F48E7ED9E52dA045bE4d6',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('degate3')],
      },
    ],
  },
}
