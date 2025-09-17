import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const stone: BaseProject = {
  id: ProjectId('stone'),
  slug: 'stone',
  name: 'Stone',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-14')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Stone is a proving system for programs written with Cairo language. Originally built by Starkware for proving Starknet state transition.',
    links: {
      websites: [
        'https://starkware.co',
        'https://starkware.co/blog/open-sourcing-the-battle-tested-stone-prover/',
      ],
      documentation: ['https://docs.starknet.io/architecture/sharp/'],
      repositories: ['https://github.com/starkware-libs/stone-prover'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Starkware',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Stone,
        ZK_CATALOG_TAGS.ISA.CASM,
        // ZK_CATALOG_TAGS.Arithmetization.AIR,
        ZK_CATALOG_TAGS.Field.felt252,
      ],
    },
    proofSystemInfo: `
    
    ## Description

    Stone is a STARK proof system that is designed to prove the execution of programs written in [Cairo language](https://www.starknet.io/cairo-book/title-page.html) and compiled into Cairo assembly (cASM) byte code. This ISA is highly optimized for the performance of zkVM proving. Stone verifies STARK proofs directly onchain without any final SNARK wraps and thus requires no trusted setup. Stone targets 80 bits of security (e.g. see constructor params on [this contract](https://etherscan.io/address/0x3d57526c1C8D63fa2A8704487Df65e9000166c8E#code)).

    ## Proof system

    Stone is a Cairo-based zkVM with AIR arithmetization over [felt252 field](https://docs.starknet.io/archive/cairo-101/felt/) and FRI-based commitment. The protocol makes use of recursive proof aggregation among many projects utilizing the CairoVM (i.e. Starknet forks and StarkEx systems) using SHARP. Some documentation on the aggregation scheme can be found [here](https://docs.starknet.io/architecture/sharp/) and the Cairo verifier implemented in Cairo can be found [here](https://github.com/starkware-libs/cairo-lang/tree/v0.13.1/src/starkware/cairo/cairo_verifier/layouts/all_cairo).

    ### StarkNet Operating System (SNOS)

    The base layer of Stone proving is a Cairo program called [SNOS](https://docs.starknet.io/architecture/os/) that proves the correct STF from one state to another given the list of transactions. SNOS execution includes checking transaction inputs (e.g. state), executing transactions and processing state diffs. The source code of the Starknet OS can be found [here](https://github.com/starkware-libs/cairo-lang/tree/ee7ce74e1159a349d4b77a5f952241b50b1692de/src/starkware/starknet/core/os).

    ### Recursive aggregation

    Proofs of SNOS executions of several consecutive blocks are recursively aggregated. The correctness of this aggregation is checked by [applicative bootloader](https://github.com/starkware-libs/cairo-lang/blob/8e11b8cc65ae1d0959328b1b4a40b92df8b58595/src/starkware/cairo/bootloaders/applicative_bootloader/applicative_bootloader.cairo#L15) program, which also verifies the correct relation of corresponding SNOS inputs and outputs. Applicative bootloader proofs are aggregated across several blockchains and proven by [SHARP](https://docs.starknet.io/architecture/sharp/#what_is_sharp). The SHARP STARK proof is verified onchain without any SNARK wraps.
    `,
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
      },
    ],
    verifierHashes: [
      {
        // Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier)
        // in hex format '0x...'
        hash: '0x5ed8957171b466464570ba10b3d5c5adfc54546ba56278129af5ae63a0d4ad22',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
        knownDeployments: [
          {
            address: '0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942',
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      },
      // {
      //   hash: '0xe12a7131035327b1f54cf3163d124b71da052535e71f64bbd9c2a460ec3a43f0',
      //   proofSystem: ZK_CATALOG_TAGS.STARK.Stone,
      //   knownDeployments: [
      //     'https://etherscan.io/address/0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
      //   ],
      //   verificationStatus: 'notVerified',
      //   usedBy: [ProjectId('dydx')],
      //   description:
      //     "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      // },
    ],
  },
}
