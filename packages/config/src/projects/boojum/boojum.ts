import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const boojum: BaseProject = {
  id: ProjectId('boojum'),
  slug: 'boojum',
  name: 'Boojum',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-11')),
  display: {
    description:
      'Boojum is a zk proving system for EraVM programs built by Matter Labs to prove ZKsync Era state transition.',
    links: {
      documentation: [
        'https://matter-labs.github.io/zksync-era/core/latest/specs/prover/getting_started.html',
        'https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/14_zk_deeper_overview.html',
        'https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/15_prover_keys.html',
      ],
      repositories: ['https://github.com/matter-labs/era-boojum'],
    },
    badges: [],
  },
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  zkCatalogInfo: {
    creator: 'Matter Labs',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Boojum,
        ZK_CATALOG_TAGS.ISA.EraVM,
        // ZK_CATALOG_TAGS.Arithmetization.Plonkish,
        ZK_CATALOG_TAGS.Field.Goldilocks,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Bellman,
        ZK_CATALOG_TAGS.Fflonk.Zksync,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
      ## Description

      Boojum is a proving system operating on [EraVM](https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/12_alternative_vm_intro.html) ISA and supporting [zk stack](https://zkstack.io) chains. It includes recursive STARK proving of zkVM execution, as well as the final wrap with [Plonk](https://github.com/matter-labs/franklin-crypto/tree/dev/src/plonk) or [Fflonk](https://github.com/matter-labs/zksync-crypto/blob/main/crates/fflonk/docs/spec.pdf) SNARK proving system. Boojum targets [100 bits of security](https://github.com/matter-labs/era-boojum?tab=readme-ov-file#for-curions-in-benchmarks-only).

      ## Proof system

      ### zkVM component

      [Boojum](https://github.com/matter-labs/era-boojum/tree/main)'s core is an implementation of the [**Redshift**](https://eprint.iacr.org/2019/1400.pdf) protocol which uses the Plonk IOP with a polynomial commitment scheme based on List Polynomial Commitments (LPCs), which is in turn based on FRI, making the scheme transparent. The scheme makes use of the Goldilocks field, which is much smaller than BN254's field. This part of boojum implements a zkVM for EraVM, which is closely aligned with EVM but has essential differences like 16 registers.

      ### Recursion circuits

      The protocol makes use of several layers of recursive proof aggregation for 15 types of [circuits](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L29). In particular, node and scheduler circuits aggregate zk proofs and compressor and wrapper circuits reduce the final proof size. Further information about the aggregation architecture can be found [**here**](https://github.com/matter-labs/zksync-era/blob/1b61d0797062ab8b0aa2c1e92b23a3a0d8fd2c61/docs/guides/advanced/15_prover_keys.md#circuits).

      ### Final wrap

      The final proof could either be wrapped into a [Plonk](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs)+KZG proof, or into [Fflonk](https://github.com/matter-labs/zksync-crypto/tree/main/crates/fflonk)+KZG for cheap verification. The KZG commitment is done over BN254 curve and it uses Aztec Ignition trusted setup ceremony, see [below](#trusted-setups) for more details.
      `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0x6f36a08c517b060fa97308cdb3e23b04842ff839d451a753ec8fae1a5408304a',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: '0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911',
            chain: 'ethereum',
          },
          {
            address: '0x3CFB3a80Af42cBE4d82C14301690A62D53e870a5',
            chain: 'zksync',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0x17e8d7931f1314431359233e65c22657a32c335205e3c24ce292c5819becfaa7',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: '0xD5dBE903F5382B052317D326FA1a7B63710C6a5b',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
      },
      // {
      //   hash: '0x941fd36f78a5ba753dbbe65b9123a43ae833405fafd03b5149b959eee766e03c',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: '0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      {
        hash: '0x64b347c642ea60114c98b3976124ea8a7e0bb778bd7e479aedc02f994486c8a1',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: '0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6',
            chain: 'ethereum',
          },
          {
            address: '0x92A9Fd0E84354213D9c3d33128eDd6Ea55ee0717',
            chain: 'zksync',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0xd90459c5b727b9ceeb2b6192d2953dbf05970edf090333b3ad3bcac1a1442b78',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: '0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
      },
      // {
      //   hash: '0xf688611ad4e0ef20184a89e7b593493dffcefe92071f85c1a0b94d4852c4f82f',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: '0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0x14f97b81e54b35fe673d8708cc1a19e1ea5b5e348e12d31e39824ed4f42bbca2',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     'https://etherscan.io/address/0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5',
      //   ],
      //   verificationStatus: 'notVerified',
      //   usedBy: [ProjectId('treasure')],
      // },
      {
        hash: '0x8574e152c41dc39a2ecab984545e1cf21cb3ec250b919018a8053f2fa270784f',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: '0x902C3806A84f4e855a8746e92d7F1C9a51400458',
            chain: 'linea',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0x49eae0bf5c7ea580f4979b366e52b386adc5f42e2ce50fc1d3c4de9a86052bff',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: '0xD324a7c8556A059371B207fB96FD77bE24E2042c',
            chain: 'ethereum',
          },
          {
            address: '0xD324a7c8556A059371B207fB96FD77bE24E2042c',
            chain: 'gateway',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0x1ffc56111a5cfaf5db387f6a31408ad20217e9bc1f31f2f5c1bd38b0d6d7968b',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: '0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7',
            chain: 'ethereum',
          },
          {
            address: '0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7',
            chain: 'gateway',
          },
        ],
        verificationStatus: 'notVerified',
      },
    ],
  },
}
