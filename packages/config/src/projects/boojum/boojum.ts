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

        Boojum is a proving system operating on [EraVM](https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/12_alternative_vm_intro.html) ISA. It supports recursive STARK proving, as well as the final wrap with Plonk or [Fflonk](https://github.com/matter-labs/zksync-crypto/blob/main/crates/fflonk/docs/spec.pdf) SNARK proving system. 

        ## Proof system

        ### Top-level proof system

        [Boojum](https://github.com/matter-labs/era-boojum/tree/main) is an implementation of the [**Redshift**](https://eprint.iacr.org/2019/1400.pdf) protocol which uses the Plonk IOP with a polynomial commitment scheme based on List Polynomial Commitments (LPCs), which is in turn based on FRI, making the scheme transparent. The scheme makes use of the Goldilocks field, which is much smaller than alt_bn128’s field.

        ### Recursion circuits

        The protocol makes use of recursive proof aggregation via 15 [**recursive circuits**](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L29). Some information about the aggregation architecture can be found [**here**](https://github.com/matter-labs/zksync-era/blob/1b61d0797062ab8b0aa2c1e92b23a3a0d8fd2c61/docs/guides/advanced/15_prover_keys.md#circuits).

        ### Final wrap

        The final proof could either be wrapped into a [Plonk](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs)+KZG proof, or into [Fflonk](https://github.com/matter-labs/zksync-crypto/tree/main/crates/fflonk)+KZG for cheap verification.

        ## Trusted setup

        Only the final SNARK wrap needs a universal trusted setup, fflonk and plonk share the same setup CRS ([link](https://github.com/matter-labs/zksync-crypto/blob/949f38ac03bd2bc27e39961c08f6fe4996855f4b/crates/fflonk/src/definitions/setup.rs#L7)). The CRS from Aztec Ignition ceremony with 176 participants is used ([link](https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/15_prover_keys.html#crs-files-setup_226key-8gb-files)).
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
        hash: '0x17e8d7931f1314431359233e65c22657a32c335205e3c24ce292c5819becfaa7',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          'https://etherscan.io/address/0xD5dBE903F5382B052317D326FA1a7B63710C6a5b',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('zksync2'),
          ProjectId('abstract'),
          ProjectId('grvt'),
          ProjectId('lens'),
          ProjectId('sophon'),
          ProjectId('wonder'),
          ProjectId('zkcandy'),
        ],
      },
      {
        hash: '0x941fd36f78a5ba753dbbe65b9123a43ae833405fafd03b5149b959eee766e03c',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          'https://etherscan.io/address/0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('zeronetwork'),
          ProjectId('cronoszkevm'),
          ProjectId('lachain'),
          ProjectId('sxt'),
        ],
      },
      {
        hash: '0xd90459c5b727b9ceeb2b6192d2953dbf05970edf090333b3ad3bcac1a1442b78',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          'https://etherscan.io/address/0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('zksync2'),
          ProjectId('abstract'),
          ProjectId('grvt'),
          ProjectId('lens'),
          ProjectId('sophon'),
          ProjectId('wonder'),
          ProjectId('zkcandy'),
        ],
      },
      {
        hash: '0xf688611ad4e0ef20184a89e7b593493dffcefe92071f85c1a0b94d4852c4f82f',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          'https://etherscan.io/address/0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e',
        ],
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('zeronetwork'),
          ProjectId('cronoszkevm'),
          ProjectId('lachain'),
          ProjectId('sxt'),
        ],
      },
      {
        hash: '0x14f97b81e54b35fe673d8708cc1a19e1ea5b5e348e12d31e39824ed4f42bbca2',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          'https://etherscan.io/address/0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5',
        ],
        verificationStatus: 'notVerified',
        usedBy: [ProjectId('treasure')],
      },
    ],
  },
}
