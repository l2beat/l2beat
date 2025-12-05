import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const stwo: BaseProject = {
  id: ProjectId('stwo'),
  slug: 'stwo',
  name: 'Stwo',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-10-29')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Stwo is a circle STARK optimized for proving performance, representing the next generation of Starkware prover after Stone.',
    links: {
      repositories: [
        'https://github.com/starkware-libs/stwo?tab=readme-ov-file',
        'https://github.com/starkware-libs/stwo-cairo',
        'https://github.com/keep-starknet-strange/awesome-stwo',
      ],
      documentation: [
        'https://zksecurity.github.io/stwo-book/introduction.html',
      ],
      socialMedia: ['https://x.com/StarkWareLtd'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Starkware',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Stwo,
        ZK_CATALOG_TAGS.ISA.CASM,
        ZK_CATALOG_TAGS.Field.Mersenne31,
      ],
    },
    proofSystemInfo: `
## Description

Stwo is the next iteration of Starkware zkVM STARK system. It is intended to prove the execution of programs written in [Cairo language](https://www.starknet.io/cairo-book/title-page.html) and compiled into Cairo assembly (cASM) byte code, however it also allows writing custom AIR to be proven. Stwo verifies STARK proofs directly onchain without any final SNARK wraps and thus requires no trusted setup. 

Stwo targets 96 bits of cryptographic security + 30 bits of PoW grinding security (e.g. see constructor params on [this contract](https://etherscan.io/address/0x3d57526c1C8D63fa2A8704487Df65e9000166c8E#code)). Here PoW grinding refers to a challenge that prover needs to compute every time they generate a proof. An honest prover performs the work only once but a malicious prover has additional computational load with every attempted forging of a proof.

## Proof system

Stwo proof system is a zkVM working with AIR arithmetizations over Mersenne31 field. [This stwo-cairo toolkit](https://github.com/starkware-libs/stwo-cairo/tree/main) allows compiling Cairo program traces to the AIR arithmetization, however it is possible to create custom AIRs to be proven by Stwo, see more [here](https://zksecurity.github.io/stwo-book/air-development/index.html). 

Stwo offers several innovations to optimize proving time. Firstly, its use of small Mersenne31 field compared to previous version [felt252 field](https://docs.starknet.io/archive/cairo-101/felt/) is much better aligned with CPU arithmetics, also operations over M31 could be highly optimized as explained [here](https://zksecurity.github.io/stwo-book/how-it-works/mersenne-prime.html). Secondly, Stwo implements a circle STARK as introduced in [this paper](https://eprint.iacr.org/2024/278). Thirdly, Stwo prover now uses Blake2 hash function instead of Poseidon, which is more efficient.

### Circle STARKs

Circle STARKs replace interpolation domain without any structure with an interpolation domain with a structure of a circle domain, where points of interpolation are chosen from a complex unit circle over Mersenne31 field. It allows using Circle FFT algorithm, which speeds up the interpolation step in STARK proving, as well as Circle FRI algorithm for low-degree polynomial testing.

### StarkNet Operating System (SNOS)

The base layer of Stwo proving L2s is a Cairo program called [SNOS](https://docs.starknet.io/architecture/os/) that proves the correct STF from one state to another given the list of transactions. SNOS execution includes checking transaction inputs (e.g. state), executing transactions and processing state diffs. The source code of the Starknet OS can be found [here](https://github.com/starkware-libs/cairo-lang/tree/ee7ce74e1159a349d4b77a5f952241b50b1692de/src/starkware/starknet/core/os).

### Recursive aggregation

Proofs of SNOS executions of several consecutive blocks are recursively aggregated. The correctness of this aggregation is checked by [applicative bootloader](https://github.com/starkware-libs/cairo-lang/blob/8e11b8cc65ae1d0959328b1b4a40b92df8b58595/src/starkware/cairo/bootloaders/applicative_bootloader/applicative_bootloader.cairo#L15) program, which also verifies the correct relation of corresponding SNOS inputs and outputs. Applicative bootloader proofs are aggregated across several blockchains and proven by [SHARP](https://docs.starknet.io/architecture/sharp/#what_is_sharp). The SHARP STARK proof is verified onchain without any SNARK wraps.

## Trusted setup

Stwo is a STARK (transparent SNARK) that does not perform a wrap in a SNARK, so it does not require any trusted setup.`,
    trustedSetups: [
      {
        ...TRUSTED_SETUPS.TransparentSetup,
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('starknet'),
        sinceTimestamp: UnixTime(1760824800),
      },
    ],
    verifierHashes: [
      {
        hash: '0xf16d320ba0d2087a99ffd465041960fd0aedf5e723c0fb877533876c531191d3',
        proofSystem: ZK_CATALOG_TAGS.STARK.Stwo,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x13e120F6c8E747983F7aaF0f7731796bfcb0D934',
            ),
            chain: 'ethereum',
            overrideUsedIn: [ProjectId('starknet'), ProjectId('paradex')],
          },
        ],
        verificationStatus: 'notVerified',
        description:
          "Custom verifier ID: SHA256 hash of the address of the immutable verifier smart contract (GpsStatementVerifier) in hex string format '0x...'.",
      },
    ],
  },
}
