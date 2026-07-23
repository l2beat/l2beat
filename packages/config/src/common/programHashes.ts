import { assert, ProjectId } from '@l2beat/shared-pure'
import type { ProjectScalingContractsProgramHash } from '../types'
import { readMarkdown } from '../utils/readMarkdown'

export function PROGRAM_HASHES(
  hash: ProjectScalingContractsProgramHash['hash'],
): ProjectScalingContractsProgramHash {
  const programHashData = programHashes[hash]
  assert(
    programHashData,
    `Program hash data for ${hash} not found, please configure it in programHashes.ts`,
  )

  return {
    ...programHashData,
    hash,
  }
}

const OP_SUCCINCT_FDP_AGG_EIGENDA = (version: string) => ({
  title: `Aggregation program of OP Succinct FDP ${version}`,
  description:
    'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client in fault dispute proof mode. Data availability layer is set to EigenDA.',
  proverSystemProject: ProjectId('sp1hypercube'),
})

const OP_SUCCINCT_FDP_RANGE_EIGENDA = (version: string) => ({
  title: `Range program of OP Succinct FDP ${version}`,
  description:
    'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks in fault dispute proof mode. Data availability layer is set to EigenDA.',
  proverSystemProject: ProjectId('sp1hypercube'),
})

const OP_SUCCINCT_LITE_AGG_BLOBS = {
  title: 'Aggregation program of OP Succinct Lite',
  description:
    'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client in fault dispute proof mode. Data availability layer is set to Ethereum blobs.',
  proverSystemProject: ProjectId('sp1hypercube'),
}

const OP_SUCCINCT_LITE_RANGE_BLOBS = {
  title: 'Range program of OP Succinct Lite',
  description:
    'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks in fault dispute proof mode. Data availability layer is set to Ethereum blobs.',
  proverSystemProject: ProjectId('sp1hypercube'),
}

const OP_SUCCINCT_AGG_BLOBS = {
  title: 'Aggregation program of OP Succinct',
  description:
    'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client. Data availability layer is set to Ethereum blobs.',
}

const OP_SUCCINCT_AGG_EIGENDA = {
  title: 'Aggregation program of OP Succinct',
  description:
    'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client. Data availability layer is set to EigenDA.',
}

const OP_SUCCINCT_RANGE_BLOBS = {
  title: 'Range program of OP Succinct',
  description:
    'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks. Data availability layer is set to Ethereum blobs.',
}

const OP_SUCCINCT_RANGE_EIGENDA = {
  title: 'Range program of OP Succinct',
  description:
    'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks. Data availability layer is set to EigenDA.',
}

const OP_SUCCINCT_AGGLAYER_V390_STEPS = `
Prepare:

1. Install sp1 toolchain version \`v6.1.0\`: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up v6.1.0\`.
2. Install docker https://docs.docker.com/get-started/get-docker/.
3. Install \`clang\` / \`libclang\`, required by the host-side vkey printing command.

Verify:

1. Checkout the correct tag in [agglayer/op-succinct](https://github.com/agglayer/op-succinct) repo: \`git checkout v3.9.0-agglayer\`. Commit hash should be \`0b6013316946541601d6535b50fc9e23d15f638c\`.
2. Make sure docker is running: \`docker ps\`.
3. Reproducibly rebuild the Ethereum DA range ELF from source: from \`programs/range/ethereum\` run \`cargo prove build --elf-name range-elf-embedded --docker --tag v6.1.0 --output-directory ../../../elf\`.
4. Reproducibly rebuild the aggregation ELF from source: from \`programs/aggregation\` run \`cargo prove build --elf-name aggregation-elf --docker --tag v6.1.0 --output-directory ../../elf\`.
5. From the repo root run \`cargo run --release --bin config\` to print the Ethereum DA range verification key hash and aggregation verification key hash. The range commitment is the \`hash_u32()\` digest converted to big-endian bytes.
`

const PESSIMISTIC_PROG = (version: string) => ({
  title: `Pessimistic program of agglayer ${version}`,
  description:
    'Verifies that a chain connected to Polygon Agglayer does not bridge out more tokens that were bridged in, thus preventing stealing tokens from other Agglayer chains. Also verifies aggchain proof for this chain.',
  proverSystemProject: ProjectId('sp1turbo'),
})

const AGGCHAIN_PROG = (version: string) => ({
  title: `Aggchain program of agglayer ${version}`,
  description:
    'Verifies state transition of an Agglayer-based chain either by checking a full validity proof or just by checking a registered sequencer signature. Also checks that L1 information on the chain aligns with the values stored on Agglayer.',
  proverSystemProject: ProjectId('sp1turbo'),
})

const RAIKO_AGG = (version: string) => ({
  title: `Aggregation program of Raiko ${version}`,
  description:
    'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
})

const RAIKO_BATCH = (version: string) => ({
  title: `Batch proving program of Raiko ${version}`,
  description:
    'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
})

const RAIKO2_PROPOSAL = (version: string) => ({
  title: `Proposal program of Raiko2 ${version}`,
  description: 'Proves a Taiko Shasta proposal state transition with Raiko2.',
})

const RAIKO2_AGG = (version: string) => ({
  title: `Aggregation program of Raiko2 ${version}`,
  description: 'Aggregates Raiko2 proofs for multiple Taiko Shasta proposals.',
})

const RAIKO2_BOUNDLESS_AGG = (version: string) => ({
  title: `Boundless aggregation program of Raiko2 ${version}`,
  description:
    'Aggregates RISC0 Boundless proofs for multiple Taiko Shasta proposals with Raiko2.',
})

const RAIKO2_GUEST_DIGEST_STEPS = (
  objectName: string,
  digestSource: string,
  version = 'v0.1.0',
  commitHash = 'a3fb34237daeddab65b965c33b2f85570dd3ff74',
  options: {
    enableDigestsFeature?: boolean
    forceRebuild?: boolean
    reference?: string
  } = {},
) => {
  const guestDigestsCommand = options.enableDigestsFeature
    ? 'cargo run -r -p xtask-build-guest --bin guest-digests --features digests --'
    : 'cargo run -p xtask-build-guest --bin guest-digests --'
  const buildGuestCommand = options.forceRebuild
    ? 'just build-guest all --force'
    : 'just build-guest all'
  const buildGuestCargoCommand = options.forceRebuild
    ? 'cargo run -r -p xtask -- build-guest all --force'
    : 'cargo run -r -p xtask-build-guest --bin xtask-build-guest -- all'
  const reference = options.reference ? `\n\n${options.reference}` : ''

  return `
Dependencies: Git, Rust/Cargo, Docker with a running daemon, and either \`just\` or the equivalent Cargo command below. The build pulls Docker images and locked Rust/git dependencies.

1. Check out the correct tag in [raiko2](https://github.com/taikoxyz/raiko2):
\`\`\`
git clone https://github.com/taikoxyz/raiko2.git
cd raiko2
git checkout ${version}
\`\`\`
Commit hash should be \`${commitHash}\`.
2. From the \`raiko2\` root dir, rebuild the Shasta guest ELFs from source:
\`\`\`
${buildGuestCommand}
\`\`\`
If \`just\` is unavailable, run the equivalent command:
\`\`\`
${buildGuestCargoCommand}
\`\`\`
This exports fresh ELFs to \`crates/guests/elf\`.
3. Generate the guest digest summary from the rebuilt ELFs:
\`\`\`
${guestDigestsCommand} \\
  --output /tmp/raiko2-${version}-guest-digests.json
\`\`\`
4. In \`/tmp/raiko2-${version}-guest-digests.json\`, find the entry with \`object_name: "${objectName}"\` and \`digest_source: "${digestSource}"\`. Its \`digest\` field should match this program hash.${reference}
`
}

const RAIKO2_V051_COMMIT_HASH = 'b08f4c57cd69a0f8dc1316a21f4ce4b08eddbebe'

const RAIKO2_V051_GUEST_DIGEST_OPTIONS = {
  enableDigestsFeature: true,
  reference:
    'Reference: [Taiko Proposal0017 recovery bundle](https://github.com/taikoxyz/taiko-mono/blob/0603e070589a091db61e95b883a007bd271886ac/packages/protocol/script/layer1/proposals/Proposal0017.md) from [taiko-mono#21833](https://github.com/taikoxyz/taiko-mono/pull/21833).',
}

const RAIKO2_V060_COMMIT_HASH = 'a9e88a4bd9e38383d601685d74e9d977531c909f'

const RAIKO2_V060_GUEST_DIGEST_OPTIONS = {
  enableDigestsFeature: true,
  forceRebuild: true,
  reference:
    'References: [Raiko2 v0.6.0 release](https://github.com/taikoxyz/raiko2/releases/tag/v0.6.0) and [Taiko Proposal0019 Unzen hardfork bundle](https://github.com/taikoxyz/taiko-mono/blob/9bd8e263065be0c553e41c6d4a82f978bdce80ed/packages/protocol/script/layer1/proposals/Proposal0019.md) from [taiko-mono#21935](https://github.com/taikoxyz/taiko-mono/pull/21935).',
}

const KAILUA_FP = (version: string, descAppendix = '') => ({
  title: `Kailua fault proof program ${version}`,
  description:
    'Program that executes OP Kona client to derive blocks and generate fault or validity proofs, is a part of ZK non-interactive kailua fault proof system. ' +
    descAppendix,
  proverSystemProject: ProjectId('risc0'),
})

const APPLICATIVE_BOOTLOADER = (version: string) => ({
  title: `Applicative bootloader Cairo program ${version}`,
  description:
    'Runs an aggregator program, checks that its input matches the recursively unpacked task outputs, and relabels the resulting fact with the domain-separated aggregator program hash.',
  proverSystemProject: ProjectId('stwo'),
})

const OUTER_BOOTLOADER = (version: string) => ({
  title: `Outer bootloader Cairo program ${version}`,
  description: 'Top-level Cairo program executed by SHARP.',
  proverSystemProject: ProjectId('stwo'),
})

const SUPPORTED_SIMPLE_BOOTLOADERS = (version: string) => ({
  title: `Supported simple bootloader programs commitment ${version}`,
  description:
    'Pedersen commitment to the ordered list of accepted simple-bootloader executable hashes.',
  proverSystemProject: ProjectId('stwo'),
})

const SUPPORTED_CAIRO_VERIFIERS = (version: string) => ({
  title: `Supported recursive Cairo verifier programs commitment ${version}`,
  description:
    'Pedersen commitment to the ordered allowlist of Cairo programs that may recursively verify and unpack nested SHARP proofs.',
  proverSystemProject: ProjectId('stwo'),
})

const SHARP_AGG = (prover: string) => ({
  title: 'Aggregation program for SHARP prover',
  description:
    'Aggregates proofs of correct execution for several consecutive transaction ranges generated by Starknet OS.',
  proverSystemProject: ProjectId(prover),
})

const STARKNET_OS = {
  title: 'Starknet OS',
  proverSystemProject: ProjectId('stwo'),
  description:
    'Proves correct state transition for a range of consecutive Starknet transactions.',
}

const STARK_EX = (version: string) => ({
  title: `StarkEx program ${version}`,
  description:
    'Cairo program that implements an application-specific L2 with spot and perpetual trading functionality.',
  proverSystemProject: ProjectId('stone'),
})

const SCROLL_BUNDLE_EXE = (version: string) => ({
  title: `Executable of the Scroll bundle program ${version}`,
  description:
    'Proves the correct execution of a bundle of Scroll L2 blocks, which is the unit of L2 state finalisation from L1’s perspective.',
  proverSystemProject: ProjectId('openvmprover'),
})

const SCROLL_BUNDLE_CONFIG = (version: string) => ({
  title: `Config of the Scroll bundle program ${version}`,
  description:
    'This is not a ZK program, but a commitment to the config of Scroll bundle program (bundle leaf commitment). It also needs to be checked to verify the expected ZK verification.',
  proverSystemProject: ProjectId('openvmprover'),
})

const BOOJUM_BOOTLOADER = (version: string) => ({
  title: `Boojum L2 Bootloader program ${version}`,
  description:
    'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
  proverSystemProject: ProjectId('boojum'),
})

const WASM_MODULE_ROOT = (version: string) => ({
  title: `ArbOS wasmModuleRoot ${version}`,
  description:
    'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
})

const ABSOLUTE_PRESTATE = (version: string) => ({
  title: `OP absolute prestate ${version}`,
  description:
    'A commitment to the initial state of the OP stack fault proof program.',
})

const programHashes: Record<
  ProjectScalingContractsProgramHash['hash'],
  Omit<ProjectScalingContractsProgramHash, 'hash'>
> = {
  '0x0075c7ec424df1386508596dc886e528c733a5f2c7728e7a81ad7676495ff31c': {
    ...OP_SUCCINCT_FDP_AGG_EIGENDA('v1.0.1'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.1/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0075c7ec424df1386508596dc886e528c733a5f2c7728e7a81ad7676495ff31c.md',
    ),
  },
  '0x223fe2ba07be84da6afb2e3c1ed5c76b182aed383ad45aee40970cd30bcf9a83': {
    ...OP_SUCCINCT_FDP_RANGE_EIGENDA('v1.0.1'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.1/programs/range/eigenda',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x223fe2ba07be84da6afb2e3c1ed5c76b182aed383ad45aee40970cd30bcf9a83.md',
    ),
  },
  '0x00b37da93c30bef199e4f70190c46367ade11ab988c3cff4c661960919718afd': {
    ...OP_SUCCINCT_FDP_AGG_EIGENDA('v1.0.2'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.2/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00b37da93c30bef199e4f70190c46367ade11ab988c3cff4c661960919718afd.md',
    ),
  },
  '0x05ca7dfb1b7ca7a103fa36750d622f81182eb7c9679b9487418968400e2b1a29': {
    ...OP_SUCCINCT_FDP_RANGE_EIGENDA('v1.0.2'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.2/programs/range/eigenda',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x05ca7dfb1b7ca7a103fa36750d622f81182eb7c9679b9487418968400e2b1a29.md',
    ),
  },
  '0x004f4bbc8b8599a08bb3715b9a18bb53996ac81d558a0ac094f6e97c71b70377': {
    ...OP_SUCCINCT_FDP_AGG_EIGENDA(''), // idk which version this is exactly, but not 2.0.0
    // programUrl:
    //   'https://github.com/celo-org/op-succinct/tree/celo/v2.0.0/programs/aggregation',
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'As shared by the Celo team, this program fixes a security issue and because of that it is not yet public. Program hash could not be regenerated.',
  },
  '0x1fffeb5a6f932e26084c284829e79973121fe5d456a7ec9029febc1308167c2c': {
    ...OP_SUCCINCT_FDP_RANGE_EIGENDA(''), // prior on-chain version, superseded by celo/v2.1.0 below; exact version unidentified (not 2.0.0)
    // programUrl:
    //   'https://github.com/celo-org/op-succinct/tree/celo/v2.0.0/programs/range/eigenda',
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'As shared by the Celo team, this program fixes a security issue and because of that it is not yet public. Program hash could not be regenerated.',
  },
  '0x00b04647b693a1024f3f6524643693ac5445fbabe5cdfcd3b2d3d468274d4be4': {
    ...OP_SUCCINCT_FDP_AGG_EIGENDA('v2.1.0'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v2.1.0/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [celo-org/op-succinct](https://github.com/celo-org/op-succinct) repo: \`git checkout celo/v2.1.0\`. Commit hash should be \`00ac9f41a19917be8add5f7b60bef5be93b5b2b7\`.
2. Make sure docker is running by running \`docker ps\`
3. Reproducibly rebuild the program ELF from source: from \`programs/aggregation\` run \`cargo prove build --elf-name aggregation-elf --docker --tag v6.1.0 --output-directory ../../elf\`. The rebuilt ELF is byte-identical to the one committed in the release.
4. From the \`op-succinct\` dir run \`cargo run --bin config --release --features eigenda\` to print the verification key hashes.
    `,
  },
  '0x1dd60be45aa2e74722e16f3a7c2d3b0a3339c1b72dc4e5b513487da3528e5c94': {
    ...OP_SUCCINCT_FDP_RANGE_EIGENDA('v2.1.0'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v2.1.0/programs/range/eigenda',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [celo-org/op-succinct](https://github.com/celo-org/op-succinct) repo: \`git checkout celo/v2.1.0\`. Commit hash should be \`00ac9f41a19917be8add5f7b60bef5be93b5b2b7\`.
2. Make sure docker is running by running \`docker ps\`
3. Reproducibly rebuild the program ELF from source: from \`programs/range/eigenda\` run \`cargo prove build --elf-name eigenda-range-elf-embedded --docker --tag v6.1.0 --output-directory ../../../elf\`. The rebuilt ELF is byte-identical to the one committed in the release.
4. From the \`op-succinct\` dir run \`cargo run --bin config --release --features eigenda\` to print the verification key hashes.
    `,
  },
  '0x003991487ea72a40a1caa7c234b12c0da52fc4ccc748a07f6ebd354bbb54772e': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v2.3.1/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x003991487ea72a40a1caa7c234b12c0da52fc4ccc748a07f6ebd354bbb54772e.md',
    ),
  },
  '0x00afb45d8064ae10aa6a1793b8f39a24c27268efae2917b5c02950b2377fbf00': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.1.0-agglayer/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00afb45d8064ae10aa6a1793b8f39a24c27268efae2917b5c02950b2377fbf00.md',
    ),
  },
  '0x0095c1f31a6e1003e1e3083ca45bf69b95c9a1468708df1029c9cf4bceb8a852': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.9.0-agglayer/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: OP_SUCCINCT_AGGLAYER_V390_STEPS,
  },
  '0x0034587dfb1de8163284d39f3043f5fadfa92f9e03fb3e0315eb469c550fde40': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.10.0-agglayer/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0034587dfb1de8163284d39f3043f5fadfa92f9e03fb3e0315eb469c550fde40.md',
    ),
  },
  '0x490685ea27adbbb83301073734f40a5656c984fe352359d54dd637e828e66872': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v2.3.1/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x490685ea27adbbb83301073734f40a5656c984fe352359d54dd637e828e66872.md',
    ),
  },
  '0x416d710344b6b6fa2a0b1a1445f3d6ba4fdd5ab43f0e863b1c522db20f28ad9b': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.1.0-agglayer/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x3813362d038935ad6cb1e2566278975f08be38a92bfe7137505ef0c14a9d1972': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.9.0-agglayer/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: OP_SUCCINCT_AGGLAYER_V390_STEPS,
  },
  '0x1b04822373ca65680026b5610c1edf424798421b032ef9117b2c264661de246f': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.10.0-agglayer/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x1b04822373ca65680026b5610c1edf424798421b032ef9117b2c264661de246f.md',
    ),
  },
  '0x00d9be2980d484ba29aaa1e0d27648b8182df8616a4ec85c3c2b528b29d1a085': {
    ...OP_SUCCINCT_LITE_AGG_BLOBS,
    verificationStatus: 'notVerified',
  },
  '0x464b1e81672b12e60eb509f54a13aaa877abafda1a015a9339285a381e4146fc': {
    ...OP_SUCCINCT_LITE_RANGE_BLOBS,
    verificationStatus: 'notVerified',
  },
  '0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30': {
    ...PESSIMISTIC_PROG('0.3.3-post4'),
    programUrl:
      'https://github.com/agglayer/agglayer/tree/v0.3.3-post.4/crates/pessimistic-proof-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30.md',
    ),
  },
  '0x000055f14384bdb5bb092fd7e5152ec31856321c5a30306ab95836bdf5cdb639': {
    ...PESSIMISTIC_PROG('v0.4.4'),
    programUrl:
      'https://github.com/agglayer/agglayer/tree/v0.4.4/crates/pessimistic-proof',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/agglayer-pessimistic-proof.md',
      {
        version: 'v0.4.4',
        commitHash: 'caac9f06bc7cb1cf89912dbb4dffa4d594a00bd5',
        elfTarget: 'riscv32im-succinct-zkvm-elf',
      },
    ),
  },
  '0x00d14f977a6ec393014f300ad78d0761dc29435d3fa1e2626fa466bd3343578e': {
    ...PESSIMISTIC_PROG('v0.5.1'),
    programUrl:
      'https://github.com/agglayer/agglayer/tree/v0.5.1/crates/pessimistic-proof',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/agglayer-pessimistic-proof.md',
      {
        version: 'v0.5.1',
        commitHash: 'f7bb86695b03d363c3d0d15ff7f2d8b386e58c91',
        elfTarget: 'riscv64im-succinct-zkvm-elf',
      },
    ),
  },
  '0x713f8a687452545141b6cd852472c67742a5c61474b97a136d0d107804affa1f': {
    ...AGGCHAIN_PROG('v1.1.2'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.1.2/crates/aggchain-proof-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x713f8a687452545141b6cd852472c67742a5c61474b97a136d0d107804affa1f.md',
    ),
  },
  '0x374ee73950cdb07d1b8779d90a8467df232639c13f9536b03f1ba76a2aa5dac6': {
    ...AGGCHAIN_PROG('v1.5.0'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.5.0/crates/aggchain-proof-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x374ee73950cdb07d1b8779d90a8467df232639c13f9536b03f1ba76a2aa5dac6.md',
    ),
  },
  '0x7767a8330ce68dac35265ba15d9eec6722b943cf00dc3b733779e1ae55696f70': {
    ...AGGCHAIN_PROG('v1.9.2'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.9.2/crates/aggchain-proof-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x7767a8330ce68dac35265ba15d9eec6722b943cf00dc3b733779e1ae55696f70.md',
    ),
  },
  '0x679bc13716cdb49416a9ca9e297b10d76390df2c343690d4172676c207517915': {
    ...AGGCHAIN_PROG('v2.0.0'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v2.0.0/crates/aggchain-proof-program',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)
3. Install pkg-config and OpenSSL development headers, e.g. on Debian/Ubuntu: \`sudo apt-get install pkg-config libssl-dev\`
4. Install protobuf compiler, e.g. on Debian/Ubuntu: \`sudo apt-get install protobuf-compiler\`. Make sure \`protoc --version\` works.

Verify:

1. Checkout the correct branch in [provers repo](https://github.com/agglayer/provers): \`git checkout v2.0.0\`. Commit hash should be \`5c51190e0c0edd1ee9ba8bc4383bd74f361760e7\`.
2. Make sure docker is running by running \`docker ps\`
3. From the root dir: \`cargo make ap-elf\` to generate aggchain program elf from sources. The generated ELF should be at \`crates/aggchain-proof-program/target/elf-compilation/docker/riscv64im-succinct-zkvm-elf/release/aggchain-proof-program\`.
4. From the root dir: \`cargo run -p aggkit-prover -- vkey\` to compute vkey hash bytes for the aggchain program. This should print \`0x679bc13716cdb49416a9ca9e297b10d76390df2c343690d4172676c207517915\`.

Note: \`cargo prove vkey --elf <path-to-elf-file>\` prints a different SP1 vkey representation for this program, not the \`hash_bytes()\` program hash used here.
    `,
  },
  '0x6e38caa6114ac4b9779f647547de9e8f09e9f5cd6194e7134110760d3aa31b53': {
    ...AGGCHAIN_PROG('v1.8.0'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.8.0/crates/aggchain-proof-program', // ??? verify version tag
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x6e38caa6114ac4b9779f647547de9e8f09e9f5cd6194e7134110760d3aa31b53.md',
    ),
  },
  '0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef': {
    title: 'Celestia Blobstream DA bridge program',
    description:
      'ZK-friendly implementation of Celestia Blobstream DA bridge that proves that enough Celestia validators have confirmed a given data root.',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'notVerified',
  },
  '0x00b451fcd696cd0a4025e30bfed96343b1767ac6523a360fee1183f9e2e20745': {
    title: 'Celestia Blobstream DA bridge program',
    description:
      'ZK-friendly implementation of Celestia Blobstream DA bridge that proves that enough Celestia validators have confirmed a given data root.',
    programUrl:
      'https://github.com/succinctlabs/sp1-blobstream/tree/78a9d3419339a8c60bf51e1e3241f242bc44d434/program',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00b451fcd696cd0a4025e30bfed96343b1767ac6523a360fee1183f9e2e20745.md',
    ),
  },
  '0x0057b7de6dcd8ff25e7b41089f4b5fa586067fbb107756d1f66d92fe71dd6ad1': {
    title: 'Avail VectorX DA bridge program',
    description:
      'ZK-friendly implementation of Avail Vector DA bridge that proves that a given data root was finalized on Avail.',
    programUrl:
      'https://github.com/availproject/sp1-vector/tree/1378db51be7634593f2bbb6301e5adf7590d03ab/program',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0057b7de6dcd8ff25e7b41089f4b5fa586067fbb107756d1f66d92fe71dd6ad1.md',
    ),
  },
  '0x00bca7947ba758bd6f539f480c6d983cca4bd4387a411a41a71fb953d5df3de7': {
    ...OP_SUCCINCT_AGG_EIGENDA,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x2d0dcc4f4a5e59b80239c28a3fb68ab63b8eaf6f132239e95f927da9046f4256': {
    ...OP_SUCCINCT_RANGE_EIGENDA,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x006110a295396036ad8df48c333e2b99b11624799138fbc18e10181551e29eb1': {
    ...OP_SUCCINCT_AGG_EIGENDA,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.1.8/programs/aggregation',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x006110a295396036ad8df48c333e2b99b11624799138fbc18e10181551e29eb1.md',
    ),
  },
  '0x5d15e85151cc8f4b68d2721f675b0b8665a7a2752fa34ff935d5adbc3c8acab8': {
    ...OP_SUCCINCT_RANGE_EIGENDA,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x05044f60230e1ea664a43fa92e27735e3bbc97736c2e7ab961a5115a732a6da5': {
    ...OP_SUCCINCT_RANGE_EIGENDA,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.1.8/programs/range/eigenda',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x05044f60230e1ea664a43fa92e27735e3bbc97736c2e7ab961a5115a732a6da5.md',
    ),
  },
  '0x00767dc6943b07bd7c57755dad9156b5e89c23d714f8475d5b7a207f74360654': {
    ...OP_SUCCINCT_AGG_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.0-beta.5/programs/aggregation',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00767dc6943b07bd7c57755dad9156b5e89c23d714f8475d5b7a207f74360654.md',
    ),
  },
  '0x47fd478c5b2111934c7a233c409f16553d0f67d5701e58fa76c77339764bfd7a': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.0-beta.5/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x47fd478c5b2111934c7a233c409f16553d0f67d5701e58fa76c77339764bfd7a.md',
    ),
  },
  '0x0022379400ea3157fae440ae7a8101e8bb01ca58e6a5f132c66751513aa58f08': {
    ...OP_SUCCINCT_AGG_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.0-beta.8/programs/aggregation',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0022379400ea3157fae440ae7a8101e8bb01ca58e6a5f132c66751513aa58f08.md',
    ),
  },
  '0x0006e0a9f37edc912bb269856518599d61689c78300c23615b2f90868d0181cf': {
    ...OP_SUCCINCT_AGG_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.1/programs/aggregation',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0006e0a9f37edc912bb269856518599d61689c78300c23615b2f90868d0181cf.md',
    ),
  },
  '0x1d1e0ac74bb66ded0388062e779adae47925fd572a49a3424e2684f83d776004': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.1/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x1d1e0ac74bb66ded0388062e779adae47925fd572a49a3424e2684f83d776004.md',
    ),
  },
  '0x001db6dc655ffc97e6ec7a2b5c9b1ddf42c2235faa007d8a96d659c68b7c432a': {
    ...OP_SUCCINCT_AGG_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.4-mainnet.4/programs/aggregation',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x001db6dc655ffc97e6ec7a2b5c9b1ddf42c2235faa007d8a96d659c68b7c432a.md',
    ),
  },
  '0x6f0230de6e9b59592b3127f55829c9a766d397903df5c57d557c91634a30b32b': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.4-mainnet.4/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x6f0230de6e9b59592b3127f55829c9a766d397903df5c57d557c91634a30b32b.md',
    ),
  },
  '0x08666bcf03c2240b14b399040abdc4aa2fe934535315fd3c158f010926d1e4a5': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/mantle-xyz/op-succinct/tree/v2.2.0-beta.8/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x08666bcf03c2240b14b399040abdc4aa2fe934535315fd3c158f010926d1e4a5.md',
    ),
  },
  '0x008adbf6e7ba087ac0b05572c938b7707400d7b41318efcbc1d7ffbbbed50452': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x40bc0563112dcc6868037ea0445916342df200ec0152bf7b4c2cca1d640fdaa3': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x0083a8b50160475a7a5911c03dfdee30f6c8a83112a71c5c1125cfb96148b8c2': {
    ...OP_SUCCINCT_AGG_BLOBS,
    programUrl:
      'https://github.com/0xFacet/zk-fault-proofs/tree/facet/programs/aggregation',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0083a8b50160475a7a5911c03dfdee30f6c8a83112a71c5c1125cfb96148b8c2.md',
    ),
  },
  '0x43f01f7522e77ddc0bea30de6cb8075608a0d0c906660e4f5f430a1e5e170829': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    programUrl:
      'https://github.com/0xFacet/zk-fault-proofs/tree/facet/programs/range',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x43f01f7522e77ddc0bea30de6cb8075608a0d0c906660e4f5f430a1e5e170829.md',
    ),
  },
  '0x0050b72e60cf8aef095d5718413fd32e1c18d0e54ebc4b9f560cf1cd93dd2605': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x04415a0d46de8b145eb5056969fa3b5900c3c23a21cb3feb2bdcb8da752de7a1': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v3.4.0-rc.1/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d.md',
    ),
  },
  '0x0077f45ec2258cc98fa879d13a2773190bffb9cafb9f428ce3c5718dc768f03e': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v3.5.0/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0077f45ec2258cc98fa879d13a2773190bffb9cafb9f428ce3c5718dc768f03e.md',
    ),
  },
  '0x0065e407807b2b3610cc9ff6637ea16e815552bc34b48c206529d3cfcd9d1152': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00987c64e3710bc9ab5f3a93f3f1249be821b1a6eedb14dbc1ae2d6fc4fd9337': {
    ...OP_SUCCINCT_AGG_BLOBS,
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x4b8234c47685b3361b22399702416a8010783b1b701b279073b4f0831e55da63': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x64c8517c14f10577381d8961139a4420420e90e528d02be96e2b0961671db248': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'The sources for this program contain a security advisory fix and are not published yet. Thus the hash cannot be independently regenerated.',
  },
  '0x0e5158b64c46007c04e5972727a2a26832337fbe765162294b0ce1ed0db36f9d': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0e5158b64c46007c04e5972727a2a26832337fbe765162294b0ce1ed0db36f9d.md',
    ),
  },
  '0x05f486d43f4066c24b8652cd52e122df59f0ea4c33c0df8155dc58de37f93330': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x5c7c05114bc5dd360fdb52ec2b4977a45f7e22806bc949a72759ea1172202229': {
    ...OP_SUCCINCT_RANGE_BLOBS,
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00cd47e188eeeab95c3c666088b928ff8243f8dd8d6e94f49795013bcd6231f0': {
    title: 'SP1 Helios program',
    description:
      'Implements a light client of Ethereum, validating state data and block headers in a trust-minimized way.',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'notVerified',
  },
  '0x0033e2cccc3296e7def7b381a4fb96fafec64f45420b6d24686779ef6236dff1': {
    ...RAIKO2_PROPOSAL('v0.1.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_bn254',
    ),
  },
  '0x19f166660ca5b9f75ef670344fb96faf76327a2a082db49150cef3de6236dff1': {
    ...RAIKO2_PROPOSAL('v0.1.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_hash_bytes',
    ),
  },
  '0x009d26a03d10b4e70eef6a339187c258a7701d6a0150524684cb46b56cf9e540': {
    ...RAIKO2_AGG('v0.1.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_bn254',
    ),
  },
  '0x4e93501e442d39c35ded4672187c258a3b80eb500541491a09968d6a6cf9e540': {
    ...RAIKO2_AGG('v0.1.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_hash_bytes',
    ),
  },
  '0x00cbb3390c27696467170dd5dac119dc7d579da7d069afae078806f9d6f47580': {
    ...RAIKO2_PROPOSAL('v0.2.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.2.0/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_bn254',
      'v0.2.0',
      'f5d46652658f63c0bbd6d6e47871d57abd50c349',
    ),
  },
  '0x65d99c8609da591962e1babb2c119dc76abced3e41a6beb80f100df356f47580': {
    ...RAIKO2_PROPOSAL('v0.2.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.2.0/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_hash_bytes',
      'v0.2.0',
      'f5d46652658f63c0bbd6d6e47871d57abd50c349',
    ),
  },
  '0x001e209da7d70983b826d88cb227861d1263435fe54fad6e4e5d83c593ee94c5': {
    ...RAIKO2_AGG('v0.2.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.2.0/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_bn254',
      'v0.2.0',
      'f5d46652658f63c0bbd6d6e47871d57abd50c349',
    ),
  },
  '0x0f104ed375c260ee04db1196227861d1131a1aff153eb5b91cbb078b13ee94c5': {
    ...RAIKO2_AGG('v0.2.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.2.0/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_hash_bytes',
      'v0.2.0',
      'f5d46652658f63c0bbd6d6e47871d57abd50c349',
    ),
  },
  '0x007594632ec31fae9d44799b97316fcbcaa3ff6b5db268c7a5d8025b3bbb487e': {
    ...RAIKO2_PROPOSAL('v0.5.1'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.5.1/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_bn254',
      'v0.5.1',
      RAIKO2_V051_COMMIT_HASH,
      RAIKO2_V051_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x3aca319730c7eba7288f33727316fcbc551ffb5a76c9a31e4bb004b63bbb487e': {
    ...RAIKO2_PROPOSAL('v0.5.1'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.5.1/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_hash_bytes',
      'v0.5.1',
      RAIKO2_V051_COMMIT_HASH,
      RAIKO2_V051_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x00e91cb391c22d6fd015e4c6041dbbe6efb2d8be6d4046eec28f12acba5a17bc': {
    ...RAIKO2_AGG('v0.5.1'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.5.1/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_bn254',
      'v0.5.1',
      RAIKO2_V051_COMMIT_HASH,
      RAIKO2_V051_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x748e59c8708b5bf402bc98c041dbbe6e7d96c5f335011bbb051e25593a5a17bc': {
    ...RAIKO2_AGG('v0.5.1'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.5.1/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_hash_bytes',
      'v0.5.1',
      RAIKO2_V051_COMMIT_HASH,
      RAIKO2_V051_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x00ad090221a8fa0f09e1be7a53feb67be010f01310d4b2314a69d10152ee1ce0': {
    ...RAIKO2_PROPOSAL('v0.6.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.6.0/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_bn254',
      'v0.6.0',
      RAIKO2_V060_COMMIT_HASH,
      RAIKO2_V060_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x568481106a3e83c23c37cf4a3feb67be008780984352c8c514d3a20252ee1ce0': {
    ...RAIKO2_PROPOSAL('v0.6.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.6.0/guests/sp1/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_proposal',
      'vk_hash_bytes',
      'v0.6.0',
      RAIKO2_V060_COMMIT_HASH,
      RAIKO2_V060_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x000b11691352e55fcf64f62620cefaa700161600093f2751032fe71ea912264d': {
    ...RAIKO2_AGG('v0.6.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.6.0/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_bn254',
      'v0.6.0',
      RAIKO2_V060_COMMIT_HASH,
      RAIKO2_V060_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x0588b48954b957f36c9ec4c40cefaa7000b0b00024fc9d44065fce3d2912264d': {
    ...RAIKO2_AGG('v0.6.0'),
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.6.0/guests/sp1/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'sp1_shasta_aggregation',
      'vk_hash_bytes',
      'v0.6.0',
      RAIKO2_V060_COMMIT_HASH,
      RAIKO2_V060_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x0040b6021bbe547fc651492bcc4eea12eaaa9b0a60086439206e27495ec6d6c3': {
    ...RAIKO_AGG('v1.10.4'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/eebee8c953d5acb8fe2d97098e6cf2079b31a6b6/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0040b6021bbe547fc651492bcc4eea12eaaa9b0a60086439206e27495ec6d6c3.md',
    ),
  },
  '0x00b14510cec97d3449eb84b814be2f4b5dae3eb56528d6bb65e1aa8226f2bed3': {
    ...RAIKO_BATCH('v1.10.4'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/eebee8c953d5acb8fe2d97098e6cf2079b31a6b6/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00b14510cec97d3449eb84b814be2f4b5dae3eb56528d6bb65e1aa8226f2bed3.md',
    ),
  },
  '0x205b010d6f951ff14a29257944eea12e5554d853002190e440dc4e925ec6d6c3': {
    ...RAIKO_AGG('v1.10.4'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/eebee8c953d5acb8fe2d97098e6cf2079b31a6b6/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x205b010d6f951ff14a29257944eea12e5554d853002190e440dc4e925ec6d6c3.md',
    ),
  },
  '0x58a28867325f4d123d7097024be2f4b56d71f5ab14a35aed4bc3550426f2bed3': {
    ...RAIKO_BATCH('v1.10.4'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/eebee8c953d5acb8fe2d97098e6cf2079b31a6b6/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x58a28867325f4d123d7097024be2f4b56d71f5ab14a35aed4bc3550426f2bed3.md',
    ),
  },
  '0x008f96447139673b3f2d29b30ad4b43fe6ccb3f31d40f6e61478ac5640201d9e': {
    ...RAIKO_AGG('v1.12.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.12.0/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x008f96447139673b3f2d29b30ad4b43fe6ccb3f31d40f6e61478ac5640201d9e.md',
    ),
  },
  '0x00a32a15ab7a74a9a79f3b97a71d1b014cd4361b37819004b9322b502b5f5be1': {
    ...RAIKO_BATCH('v1.12.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.12.0/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00a32a15ab7a74a9a79f3b97a71d1b014cd4361b37819004b9322b502b5f5be1.md',
    ),
  },
  '0x47cb22384e59cecf65a536612d4b43fe36659f987503db9828f158ac40201d9e': {
    ...RAIKO_AGG('v1.12.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.12.0/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x47cb22384e59cecf65a536612d4b43fe36659f987503db9828f158ac40201d9e.md',
    ),
  },
  '0x00380861a3c05aa16421c66921e7b952005ddad5b91b81e56d1a5f92a88db099': {
    ...RAIKO_AGG('v1.8.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.8.0/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00380861a3c05aa16421c66921e7b952005ddad5b91b81e56d1a5f92a88db099.md',
    ),
  },
  '0x1c0430d17016a8590438cd241e7b952002eed6ad646e07955a34bf25288db099': {
    ...RAIKO_AGG('v1.8.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.8.0/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x1c0430d17016a8590438cd241e7b952002eed6ad646e07955a34bf25288db099.md',
    ),
  },
  '0x00745853e47349fb2ddb364dae473e099c19890da8c786490da83066a0959689': {
    ...RAIKO_BATCH('v1.8.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.8.0/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00745853e47349fb2ddb364dae473e099c19890da8c786490da83066a0959689.md',
    ),
  },
  '0x3a2c29f21cd27ecb3b66c9b56473e09960cc486d231e19241b5060cd20959689': {
    ...RAIKO_BATCH('v1.8.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.8.0/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x3a2c29f21cd27ecb3b66c9b56473e09960cc486d231e19241b5060cd20959689.md',
    ),
  },
  '0x34712aed5061bce303b4bae32d3edafc05a1b9ec04c6d1d84dedc5ab28e8fe98': {
    ...RAIKO_BATCH('v1.9.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.9.0/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x34712aed5061bce303b4bae32d3edafc05a1b9ec04c6d1d84dedc5ab28e8fe98.md',
    ),
  },
  '0x0068e255db4186f38c1da5d71ad3edafc0b4373d8131b47626f6e2d5a8e8fe98': {
    ...RAIKO_BATCH('v1.9.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.9.0/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0068e255db4186f38c1da5d71ad3edafc0b4373d8131b47626f6e2d5a8e8fe98.md',
    ),
  },
  '0x43645b1b5d225d4539e38da910e3ba2a4d8d8dfc457a10d26a03d3cf1fb969be': {
    ...RAIKO_AGG('v1.9.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.9.0/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x43645b1b5d225d4539e38da910e3ba2a4d8d8dfc457a10d26a03d3cf1fb969be.md',
    ),
  },
  '0x0086c8b63774897515cf1c6d490e3ba2a9b1b1bf915e8434b501e9e79fb969be': {
    ...RAIKO_AGG('v1.9.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.9.0/provers/sp1/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0086c8b63774897515cf1c6d490e3ba2a9b1b1bf915e8434b501e9e79fb969be.md',
    ),
  },
  '0x51950ad55e9d2a6973e772f471d1b01466a1b0d95e064012726456a02b5f5be1': {
    ...RAIKO_BATCH('v1.12.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.12.0/provers/risc0/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x51950ad55e9d2a6973e772f471d1b01466a1b0d95e064012726456a02b5f5be1.md',
    ),
  },
  '0x0079682c7b5af614273de79761aaad20d1c8e1a65091388b81be836632d382f8': {
    ...RAIKO_BATCH('v1.16.1'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/tree/hotfix/hotfix-based-on-1.16.1/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0079682c7b5af614273de79761aaad20d1c8e1a65091388b81be836632d382f8.md',
    ),
  },
  '0x0026ff63d649779a5dbc88c3359ab83399a21fb6ef9b7ec082f77a8a465806e7': {
    ...RAIKO_BATCH('v1.16.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/b9da2b011d5427f3602cd7fbe7882b7a37b88f71/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0026ff63d649779a5dbc88c3359ab83399a21fb6ef9b7ec082f77a8a465806e7.md',
    ),
  },
  '0x3cb4163d56bd850967bcf2ec1aaad20d0e470d324244e22e037d06cc32d382f8': {
    ...RAIKO_BATCH('v1.16.1'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/tree/hotfix/hotfix-based-on-1.16.1/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x3cb4163d56bd850967bcf2ec1aaad20d0e470d324244e22e037d06cc32d382f8.md',
    ),
  },
  '0x137fb1eb125de6973791186659ab83394d10fdb73e6dfb0205eef514465806e7': {
    ...RAIKO_BATCH('v1.16.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/b9da2b011d5427f3602cd7fbe7882b7a37b88f71/provers/sp1/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x137fb1eb125de6973791186659ab83394d10fdb73e6dfb0205eef514465806e7.md',
    ),
  },
  '0x0002ac747570512099ca19c17f5a3b9f39697e5617a19ff2f2b2464229a50c7c': {
    ...RAIKO_AGG('v1.16.1'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/tree/hotfix/hotfix-based-on-1.16.1/provers/sp1/guest/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0002ac747570512099ca19c17f5a3b9f39697e5617a19ff2f2b2464229a50c7c.md',
    ),
  },
  '0x008e24716118be9594358d8882d93d5425f0827cf0a7a4fd0ea2fc4414debfe7': {
    ...RAIKO_AGG('v1.16.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/b9da2b011d5427f3602cd7fbe7882b7a37b88f71/provers/sp1/guest/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x008e24716118be9594358d8882d93d5425f0827cf0a7a4fd0ea2fc4414debfe7.md',
    ),
  },
  '0x01563a3a5c1448263943382f75a3b9f34b4bf2b05e867fcb65648c8429a50c7c': {
    ...RAIKO_AGG('v1.16.1'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/tree/hotfix/hotfix-based-on-1.16.1/provers/sp1/guest/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x01563a3a5c1448263943382f75a3b9f34b4bf2b05e867fcb65648c8429a50c7c.md',
    ),
  },
  '0x471238b0462fa56506b1b1102d93d5422f8413e7429e93f41d45f88814debfe7': {
    ...RAIKO_AGG('v1.16.0'),
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/b9da2b011d5427f3602cd7fbe7882b7a37b88f71/provers/sp1/guest/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x471238b0462fa56506b1b1102d93d5422f8413e7429e93f41d45f88814debfe7.md',
    ),
  },
  '0x7ce98c36408e86dac21fc16af301740d07a849be0a80529debcb0797fd66f5e3': {
    ...KAILUA_FP('Risc0 v2.3.2'),
    verificationStatus: 'notVerified',
  },
  '0xd7c1d74ce26e897e8bc7ea094667dcdb04c405ba1836bdb9b0ad773fc9fd0651': {
    // https://github.com/boundless-xyz/kailua/blob/3d284ca656a678f0546500e4a30c494a26358a18/book/src/setup.md?plain=1#L44
    ...KAILUA_FP('Risc0 v3.0.3'),
    verificationStatus: 'notVerified',
  },
  '0x3768ea4f0e0d940f69c4cc5bd39a9e2772bfe3cb57818ce526bbe68033ee5934': {
    ...KAILUA_FP('BOB'),
    verificationStatus: 'notVerified',
  },
  '0xb2e2b1513e80ea1e8f998e51bf8e7754eec21dbd0463e0b6b115165ba6bac2bf': {
    ...KAILUA_FP('v1.3.0'),
    programUrl: 'https://github.com/boundless-xyz/kailua/tree/v1.3.0',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xb2e2b1513e80ea1e8f998e51bf8e7754eec21dbd0463e0b6b115165ba6bac2bf.md',
    ),
  },
  '0xf176eb82fbbb5d2d281a9cce459062bcdbe65f93d7156829b174fae2b4690c23': {
    // https://github.com/boundless-xyz/kailua/blob/dead453517c48240a221845640493b232255c907/book/src/setup.md
    ...KAILUA_FP('Risc0 v3.0.4, Kailua v1.1.8'),
    programUrl: 'https://github.com/boundless-xyz/kailua/releases/tag/v1.1.8',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xf176eb82fbbb5d2d281a9cce459062bcdbe65f93d7156829b174fae2b4690c23.md',
    ),
  },
  '0x951f56039ddaca6cdd588e55d7205882ec158e3afc5d048f2d723da0d8858ecf': {
    ...KAILUA_FP('SOON'),
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'According to the SOON team, this Kailua FPVM program was compiled using a local version with some additional logging added for debugging purposes. The code is not public and thus the program hash cannot be independently verified.',
  },
  '0x4aca4abde3db9c42152b4d9eb359e6030111c34ba68f7c68160fce93ed5b7b25': {
    ...KAILUA_FP('BOB', 'This version adds op-contracts v5 compatibility.'),
    verificationStatus: 'notVerified',
  },
  '0xd3c097dfec583bb305eefcb5dcddc313b072e372cee66e13492c37fb50e6a90b': {
    // https://github.com/boundless-xyz/kailua/tree/a11c73fec58f55010b4c6feec0d5c73dd9346f45
    ...KAILUA_FP(
      'Risc0 v3.0.5, Kailua v1.3.0 (Hokulea)',
      'This is the Hokulea variant of the Kailua guest, used by projects that post data availability to EigenDA.',
    ),
    programUrl: 'https://github.com/boundless-xyz/kailua/releases/tag/v1.3.0',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xd3c097dfec583bb305eefcb5dcddc313b072e372cee66e13492c37fb50e6a90b.md',
    ),
  },
  '0xf0ce5d15fa89991210ca2667b7f7a8bb740ce551c0f2b20cc76f9debc55d22c2': {
    ...KAILUA_FP('MegaETH'),
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'The sources for this program are under development and not published yet. The hash cannot be independently regenerated.',
  },
  '0xbee1be4cbe2bdf9b0034a1ab6572061a76019e73189ff96322e58ab229b75f92': {
    ...RAIKO2_PROPOSAL('v0.1.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/risc0/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_proposal',
      'image_id',
    ),
  },
  '0xa9cc799b246826a3a1b9545e82a290227a65044612a6273b0aaf90dd51169831': {
    ...RAIKO2_AGG('v0.1.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/risc0/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_aggregation',
      'image_id',
    ),
  },
  '0x588c81521db5bef5e07f5beab37f1f0b2bba925ac82e733db7cc72e046362754': {
    ...RAIKO2_PROPOSAL('v0.2.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.2.0/guests/risc0/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_proposal',
      'image_id',
      'v0.2.0',
      'f5d46652658f63c0bbd6d6e47871d57abd50c349',
    ),
  },
  '0x91ddc48054ff4ec62a93bfa0583582d0e04de6ab3928e51e0ea3ee523fee129f': {
    ...RAIKO2_AGG('v0.2.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.2.0/guests/risc0/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_aggregation',
      'image_id',
      'v0.2.0',
      'f5d46652658f63c0bbd6d6e47871d57abd50c349',
    ),
  },
  '0xa38d1fac63aa6a553fdb6fea01fdc96534564c31de916aaafe5f5a1dd3bb908b': {
    ...RAIKO2_PROPOSAL('v0.5.1'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.5.1/guests/risc0/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_proposal',
      'image_id',
      'v0.5.1',
      RAIKO2_V051_COMMIT_HASH,
      RAIKO2_V051_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x868b5154ae01a9a045051da2d7ba2e21d4132c7ec096da343fa24149407fefef': {
    ...RAIKO2_AGG('v0.5.1'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.5.1/guests/risc0/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_aggregation',
      'image_id',
      'v0.5.1',
      RAIKO2_V051_COMMIT_HASH,
      RAIKO2_V051_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x5a818b4c7dc80e9ba85d55492c20c263c67238724e3982f76d15a158e501210b': {
    ...RAIKO2_PROPOSAL('v0.6.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.6.0/guests/risc0/src/shasta_proposal.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_proposal',
      'image_id',
      'v0.6.0',
      RAIKO2_V060_COMMIT_HASH,
      RAIKO2_V060_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0x9cfcc1b34a98853c3c5873a4d456726e528246f7f03a4ea35f27c2543aa6e7f0': {
    ...RAIKO2_AGG('v0.6.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.6.0/guests/risc0/src/shasta_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_aggregation',
      'image_id',
      'v0.6.0',
      RAIKO2_V060_COMMIT_HASH,
      RAIKO2_V060_GUEST_DIGEST_OPTIONS,
    ),
  },
  '0xcecc85819e15d173c2991577727525b136e820728f7aaaede612f1281cac2249': {
    ...RAIKO2_BOUNDLESS_AGG('v0.1.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko2/blob/v0.1.0/guests/risc0/src/boundless_aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: RAIKO2_GUEST_DIGEST_STEPS(
      'risc0_shasta_boundless_aggregation',
      'image_id',
    ),
  },
  '0xe9aec1d30d25da1ccfc02a81c4b71f32e0a6f675dff4ce01fe4bd5f96ff320bd': {
    ...RAIKO_AGG('v1.10.4'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/eebee8c953d5acb8fe2d97098e6cf2079b31a6b6/provers/risc0/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xe9aec1d30d25da1ccfc02a81c4b71f32e0a6f675dff4ce01fe4bd5f96ff320bd.md',
    ),
  },
  '0xee950d20e2483b9b6b859272feaea2dd84cea8a9cfdf1af8834df6b75c3d715e': {
    ...RAIKO_BATCH('v1.10.4'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/eebee8c953d5acb8fe2d97098e6cf2079b31a6b6/provers/risc0/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xee950d20e2483b9b6b859272feaea2dd84cea8a9cfdf1af8834df6b75c3d715e.md',
    ),
  },
  '0x3d933868e2ac698df98209b45e6c34c435df2d3c97754bb6739d541d5fd312e3': {
    ...RAIKO_AGG('v1.12.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.12.0/provers/risc0/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x3d933868e2ac698df98209b45e6c34c435df2d3c97754bb6739d541d5fd312e3.md',
    ),
  },
  '0x77ff0953ded4fb48bb52b1099cc36c6b8bf603dc4ed9211608c039c7ec31b82b': {
    ...RAIKO_BATCH('v1.12.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.12.0/provers/risc0/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x77ff0953ded4fb48bb52b1099cc36c6b8bf603dc4ed9211608c039c7ec31b82b.md',
    ),
  },
  '0x49c8f13fdfbec7c03fc8516ef7d32d8fa43fa4f495d62e9ff6bf63710df402d4': {
    ...RAIKO_AGG('v1.8.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.8.0/provers/risc0/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x49c8f13fdfbec7c03fc8516ef7d32d8fa43fa4f495d62e9ff6bf63710df402d4.md',
    ),
  },
  '0x052010a130f9957a9d218a173242070c47af1c5d2c3ccae1d8e8d85ce6c7d78e': {
    ...RAIKO_BATCH('v1.8.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.8.0/provers/risc0/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x052010a130f9957a9d218a173242070c47af1c5d2c3ccae1d8e8d85ce6c7d78e.md',
    ),
  },
  '0x1f28744f3b199dd31cfe84ee45bf6a7c9e4b7e8f7e888bb47889bba0237e00ff': {
    ...RAIKO_BATCH('v1.9.0-rc.2'),
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
    // verificationStatus: 'unsuccessful',
    // verificationSteps:
    //   'According to the Taiko team, sources for this program are missing and thus it cannot be regenerated.',
  },
  '0x0a0488e485692dd711b60258bd799099f8d1e6776cb96ede88c9fecfcc9b7e7c': {
    ...RAIKO_AGG('v1.9.0-rc.2'),
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
    // verificationStatus: 'unsuccessful',
    // verificationSteps:
    //   'According to the Taiko team, sources for this program are missing and thus it cannot be regenerated.',
  },
  '0xa41db9223051c1a6b046829dc372eab4989ff0a3e027c360d8c906d831ca60d4': {
    ...RAIKO_AGG('v1.10.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.10.0/provers/risc0/guest/src/aggregation.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xa41db9223051c1a6b046829dc372eab4989ff0a3e027c360d8c906d831ca60d4.md',
    ),
  },
  '0xa3f175713dc988430192dfd9a6c49ea111e389e2c008428eedd5f38648094404': {
    ...RAIKO_BATCH('v1.10.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/v1.10.0/provers/risc0/guest/src/batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xa3f175713dc988430192dfd9a6c49ea111e389e2c008428eedd5f38648094404.md',
    ),
  },
  '0x46efe5e0c74976548ee6856789fbfb4929b8f2f9118a119c57ced6e1062e727b': {
    ...RAIKO_BATCH('v1.16.1'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/tree/hotfix/hotfix-based-on-1.16.1/provers/risc0/guest/src/boundless_batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x46efe5e0c74976548ee6856789fbfb4929b8f2f9118a119c57ced6e1062e727b.md',
    ),
  },
  '0x779c032b91d0730ef13b26eafa47b32df7ebdaa4ed766d587fe905530afa2544': {
    ...RAIKO_BATCH('v1.16.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/b9da2b011d5427f3602cd7fbe7882b7a37b88f71/provers/risc0/guest/src/boundless_batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x779c032b91d0730ef13b26eafa47b32df7ebdaa4ed766d587fe905530afa2544.md',
    ),
  },
  '0xdfbce2039ad8b78b236b5a9dceba5d8cee0d9e4638fc8f1fe11a0b2d8bfa039e': {
    ...RAIKO_AGG('v1.16.1'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/tree/hotfix/hotfix-based-on-1.16.1/provers/risc0/guest/src/boundless_batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xdfbce2039ad8b78b236b5a9dceba5d8cee0d9e4638fc8f1fe11a0b2d8bfa039e.md',
    ),
  },
  '0x26abb0237d10e891443e2a76bd3c1f6704c1ad03c07cb2165f4afcfc64b3cee7': {
    ...RAIKO_AGG('v1.16.0'),
    proverSystemProject: ProjectId('risc0'),
    programUrl:
      'https://github.com/taikoxyz/raiko/blob/b9da2b011d5427f3602cd7fbe7882b7a37b88f71/provers/risc0/guest/src/boundless_batch.rs',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x26abb0237d10e891443e2a76bd3c1f6704c1ad03c07cb2165f4afcfc64b3cee7.md',
    ),
  },
  '0x70909b25db0db00f1d4b4016aeb876f53568a3e5a8e6397cb562d79947a02cc9': {
    title: 'Set builder program',
    description:
      'Recursively verifies a Merkle tree of zk proofs at once, identified by a Merkle Mountain Range root.',
    programUrl:
      'https://github.com/risc0/risc0-ethereum/tree/v3.0.1/crates/aggregation/guest/set-builder',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x70909b25db0db00f1d4b4016aeb876f53568a3e5a8e6397cb562d79947a02cc9.md',
    ),
  },
  '3427958597398434235135013788958741576989752718219267963615783564775551242024':
    {
      ...OUTER_BOOTLOADER('StarkWare_GpsStatementVerifier_2026_13'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/56407b69f3f19f69302a8623baa8c5f71f967eed/src/starkware/cairo/bootloaders/bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/3427958597398434235135013788958741576989752718219267963615783564775551242024.md',
      ),
    },
  '2549868507195840500193135872505150687001846773665388230794631345999578394351':
    {
      ...SUPPORTED_CAIRO_VERIFIERS('StarkWare_GpsStatementVerifier_2026_13_4'),
      verificationStatus: 'notVerified',
    },
  '2344514586684536563385559840360704301482767436870016911498865422916991654732':
    {
      ...SUPPORTED_CAIRO_VERIFIERS(
        'StarkWare_GpsStatementVerifier_2026_13_2/3',
      ),
      verificationStatus: 'notVerified',
    },
  '2989448937132554463006794084002640731746256535824175616421304143852713734169':
    {
      ...SUPPORTED_CAIRO_VERIFIERS('StarkWare_GpsStatementVerifier_2026_13_1'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/blob/56407b69f3f19f69302a8623baa8c5f71f967eed/src/starkware/cairo/bootloaders/bootloader/supported_program_hashes.json',
      verificationStatus: 'notVerified',
    },
  '2932072919023221119013858170796075739921358449313810261427542077330086829225':
    {
      ...SUPPORTED_CAIRO_VERIFIERS('StarkWare_GpsStatementVerifier_2025_12'),
      verificationStatus: 'notVerified',
    },
  '2466486069452806242840925975386070877213363233399077553187556921270027085075':
    {
      ...SUPPORTED_CAIRO_VERIFIERS('StarkWare_GpsStatementVerifier_2025_11'),
      verificationStatus: 'notVerified',
    },
  '988080400528720010398639244351885480706475299330001427790099377094461351470':
    {
      ...SUPPORTED_CAIRO_VERIFIERS('StarkWare_GpsStatementVerifier_2024_10'),
      verificationStatus: 'notVerified',
    },
  '989994135429182905628199499137734285064642484443466268071170571058909750176':
    {
      ...APPLICATIVE_BOOTLOADER('StarkWare_GpsStatementVerifier_2026_13'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/56407b69f3f19f69302a8623baa8c5f71f967eed/src/starkware/cairo/bootloaders/applicative_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/989994135429182905628199499137734285064642484443466268071170571058909750176.md',
      ),
    },
  '3442855748187296636739564186904728563385971901122957091055928358173521721079':
    {
      ...SUPPORTED_SIMPLE_BOOTLOADERS('StarkWare_GpsStatementVerifier_2026_13'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/1c5dace6fbd1dc9d1ae2eb878dc1dd85f23512ab/src/starkware/cairo/bootloaders/simple_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/3442855748187296636739564186904728563385971901122957091055928358173521721079.md',
      ),
    },
  '37889379279861089970868356983774360253508326951064758033885675883862334778':
    {
      ...SUPPORTED_SIMPLE_BOOTLOADERS('StarkWare_GpsStatementVerifier_2025_12'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/56407b69f3f19f69302a8623baa8c5f71f967eed/src/starkware/cairo/bootloaders/simple_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/37889379279861089970868356983774360253508326951064758033885675883862334778.md',
      ),
    },
  '3035974089339935040143966034750116008615662951603253398063766337728525196711':
    {
      ...SUPPORTED_SIMPLE_BOOTLOADERS('StarkWare_GpsStatementVerifier_2025_11'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/57317a743004a608ce1aab0211c40d50083f0a65/src/starkware/cairo/bootloaders/simple_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/3035974089339935040143966034750116008615662951603253398063766337728525196711.md',
      ),
    },
  '160268921359133235574810995023520895391777547407923205700393332203861498631':
    {
      ...SUPPORTED_SIMPLE_BOOTLOADERS('StarkWare_GpsStatementVerifier_2024_10'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.13.5/src/starkware/cairo/bootloaders/simple_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/160268921359133235574810995023520895391777547407923205700393332203861498631.md',
      ),
    },
  '2358844945297786488640123814540854423585455959362109345448922524567546993330':
    {
      ...APPLICATIVE_BOOTLOADER('StarkWare_GpsStatementVerifier_2026_13'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/1c5dace6fbd1dc9d1ae2eb878dc1dd85f23512ab/src/starkware/cairo/bootloaders/applicative_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/2358844945297786488640123814540854423585455959362109345448922524567546993330.md',
      ),
    },
  '3585039955034622347908243360088523999417661979601115750324841620224559981237':
    {
      ...APPLICATIVE_BOOTLOADER('StarkWare_GpsStatementVerifier_2025_11'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/57317a743004a608ce1aab0211c40d50083f0a65/src/starkware/cairo/bootloaders/applicative_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/3585039955034622347908243360088523999417661979601115750324841620224559981237.md',
      ),
    },
  '1104316318711847786071125527957082259001554753246760931396914052122269757907':
    {
      ...APPLICATIVE_BOOTLOADER('StarkWare_GpsStatementVerifier_2024_10'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.13.5/src/starkware/cairo/bootloaders/applicative_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/1104316318711847786071125527957082259001554753246760931396914052122269757907.md',
      ),
    },
  '3480185788024326007166778030599498673382667448173974782477620863541158415714':
    {
      ...APPLICATIVE_BOOTLOADER('StarkWare_GpsStatementVerifier_2025_12'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/020f846ee43d0a85f082dcfcc001f39446977272/src/starkware/cairo/bootloaders/applicative_bootloader',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/3480185788024326007166778030599498673382667448173974782477620863541158415714.md',
      ),
    },
  '1050253032170513549151251823521174837478197699740478552102884446098263561922':
    {
      ...SHARP_AGG('stwo'),
      programUrl:
        'https://github.com/starkware-libs/sequencer/tree/APOLLO-0.14.3-RC.11/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/aggregator',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/1050253032170513549151251823521174837478197699740478552102884446098263561922.md',
      ),
    },
  '2571508110958925737463010241874806654058743535666147712534445437599630018294':
    {
      ...SHARP_AGG('stwo'),
      programUrl:
        'https://github.com/starkware-libs/sequencer/blob/c294a8ba263834d45cf525217d8700f5de24a260/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/aggregator/main.cairo#L15',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/2571508110958925737463010241874806654058743535666147712534445437599630018294.md',
      ),
    },
  '1701025211190912681772481128523426351562426117847395998223683709327746845867':
    {
      ...SHARP_AGG('stwo'),
      programUrl:
        'https://github.com/starkware-libs/sequencer/blob/9b4f27df41e8c45aeeb155d4fe84a1df18a8358a/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/aggregator/main.cairo#L15',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/1701025211190912681772481128523426351562426117847395998223683709327746845867.md',
      ),
    },
  '760308386675154762009993173725077399730170358078020153308029499928875469870':
    {
      ...SHARP_AGG('stwo'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.14.0.1/src/starkware/starknet/core/aggregator',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/760308386675154762009993173725077399730170358078020153308029499928875469870.md',
      ),
    },
  '2006389624453304912912750132846114593020263069652857561377702883656839453432':
    {
      ...STARKNET_OS,
      programUrl:
        'https://github.com/starkware-libs/sequencer/tree/APOLLO-0.14.3-RC.11/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/os',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/2006389624453304912912750132846114593020263069652857561377702883656839453432.md',
      ),
    },
  '2733003247060056328192560178934419513655729851806095615814023997114795707702':
    {
      ...STARKNET_OS,
      programUrl:
        'https://github.com/starkware-libs/sequencer/blob/c294a8ba263834d45cf525217d8700f5de24a260/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/os/os.cairo#L69',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/2733003247060056328192560178934419513655729851806095615814023997114795707702.md',
      ),
    },
  '918745833886511857768061986591752808672496300091957204265383861063635175685':
    {
      ...STARKNET_OS,
      programUrl:
        'https://github.com/starkware-libs/sequencer/blob/9b4f27df41e8c45aeeb155d4fe84a1df18a8358a/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/os/os.cairo#L69',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/918745833886511857768061986591752808672496300091957204265383861063635175685.md',
      ),
    },
  '793595346346724189681221050719974054861327641387231526786912662354259445535':
    {
      ...STARKNET_OS,
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.14.0.1/src/starkware/starknet/core/os',
      verificationStatus: 'successful',
      verificationSteps: readMarkdown(
        'common/programHashes/793595346346724189681221050719974054861327641387231526786912662354259445535.md',
      ),
    },
  '2530337539466159944237001094809327283009177793361359619481044346150483328860':
    {
      ...STARK_EX('EdgeX'),
      verificationStatus: 'notVerified',
    },
  '273279642033703284306509103355536170486431195329675679055627933497997642494':
    {
      ...SHARP_AGG('stone'),
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.13.5/src/starkware/starknet/core/aggregator',
      verificationStatus: 'notVerified',
    },
  '2534935718742676028234156221136000178296467523045214874259117268197132196876':
    {
      title: 'Paradex implementation of StarkNet OS',
      description:
        'Proves correct state transition for a range of consecutive Paradex transactions.',
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.13.5/src/starkware/starknet/core/os',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '3485280386001712778192330279103973322645241679001461923469191557000342180556':
    {
      ...STARK_EX('Spot v3.0'),
      programUrl:
        'https://github.com/starkware-libs/starkex-for-spot-trading/tree/bf49fb5a7411b71bf7b24ebcb13cd1b2282bfb48/src/starkware/cairo/dex',
      verificationStatus: 'notVerified',
    },
  '3174901404014912024702042974619036870715605532092680335571201877913899936957':
    {
      ...STARK_EX('Spot v4.0'),
      verificationStatus: 'notVerified',
    },
  '16830627573509542901909952446321116535677491650708854009406762893086223513':
    {
      ...STARK_EX('Spot v4.5'),
      verificationStatus: 'notVerified',
    },
  '0x30513ba1873ce1b9598c4faf101dccd32498e93c39e1f31a423390cbb1f81f7a': {
    title: 'Scroll program',
    description:
      'Proves the correct STF of Scroll L2 before the Euclid upgrade (V2).',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'notVerified',
  },
  '0x0a1904dbfff4614fb090b4b3864af4874f12680c32f07889e9ede8665097e5ec': {
    title: 'Scroll program',
    description:
      'Proves the correct STF of Scroll L2 before the Euclid upgrade (V2).',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'notVerified',
  },
  '0x001e7bcb266824cb08ad303990e90a9c4b901eaaa52e562e513df47d4c168949': {
    ...SCROLL_BUNDLE_EXE(''),
    verificationStatus: 'notVerified',
  },
  '0x0038553adf417a6a3df35d2fdfd14b892f1e49ba18937ece7960c1e7cee6e3dc': {
    ...SCROLL_BUNDLE_CONFIG('v0.2.0'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/v0.2.0/crates/circuits/bundle-circuit',
    verificationStatus: 'notVerified',
  },
  '0x003ac2e012d8a7fb1495d94839fe36559b52fd6d60a532884c7558de2b88bf72': {
    ...SCROLL_BUNDLE_EXE('v0.5.2'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/0.5.2/crates/circuits/bundle-circuit',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x003ac2e012d8a7fb1495d94839fe36559b52fd6d60a532884c7558de2b88bf72.md',
    ),
  },
  '0x0062333dc88631be7af046cc8d3c24f346de172aa2030a28b445ab500889d297': {
    ...SCROLL_BUNDLE_EXE('v0.7.1'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/v0.7.1/crates/circuits/bundle-circuit',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0062333dc88631be7af046cc8d3c24f346de172aa2030a28b445ab500889d297.md',
    ),
  },
  '0x0091609acb607118f47f756c0f4db9aad227420326cbda96f0303384e0bbf8e3': {
    ...SCROLL_BUNDLE_EXE('v0.7.2'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/v0.7.2/crates/circuits/bundle-circuit',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0091609acb607118f47f756c0f4db9aad227420326cbda96f0303384e0bbf8e3.md',
    ),
  },
  '0x00398b786b500ca759ca2de2aee9c73bd8e28f1c80b49e1c53bc060a9a649269': {
    ...SCROLL_BUNDLE_EXE('v0.8.0'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/1839b4905bd920bf75de9c25997b8383029e021d/crates/circuits/bundle-circuit',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00398b786b500ca759ca2de2aee9c73bd8e28f1c80b49e1c53bc060a9a649269.md',
    ),
  },
  '0x0021785a05e931b447c8d6463f4547f92081a92ee357af26e1c6f6ecfe373d67': {
    ...SCROLL_BUNDLE_CONFIG('v0.8.0'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/1839b4905bd920bf75de9c25997b8383029e021d/crates/circuits/bundle-circuit',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0021785a05e931b447c8d6463f4547f92081a92ee357af26e1c6f6ecfe373d67.md',
    ),
  },
  '0x009305f0762291e3cdd805ff6d6e81f1d135dbfdeb3ecf30ad82c3855dde7909': {
    ...SCROLL_BUNDLE_CONFIG('v0.5.2'),
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/0.5.2/crates/circuits/bundle-circuit',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x009305f0762291e3cdd805ff6d6e81f1d135dbfdeb3ecf30ad82c3855dde7909.md',
    ),
  },
  '0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35': {
    ...BOOJUM_BOOTLOADER('v0.28.0'),
    programUrl:
      'https://github.com/matter-labs/era-contracts/blob/v0.28.0/system-contracts/bootloader/bootloader.yul',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35.md',
    ),
  },
  '0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81': {
    ...BOOJUM_BOOTLOADER('v26'),
    programUrl:
      'https://github.com/matter-labs/era-contracts/blob/release-v26/system-contracts/bootloader/bootloader.yul',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81.md',
    ),
  },
  // v29 upgrade, added by basti without knowing what he is doing https://www.tally.xyz/gov/zksync/proposal/40562439712311128665286075271414168289029475306445402072499591795343687723101?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f
  // Turned out to be exactly correct
  '0x01000911c4db4fe62c98e180cfa7e9b3a22fb15f505905d4bf36192f481551e6': {
    ...BOOJUM_BOOTLOADER('v0.29.2'),
    programUrl:
      'https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/bootloader/bootloader.yul',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x01000911c4db4fe62c98e180cfa7e9b3a22fb15f505905d4bf36192f481551e6.md',
    ),
  },
  '0x0059b74a8fd03c44462de3916b45ebeedb9f1158e3037e8c40b8941cbe438d7e': {
    title: 'Morph Guest program (v0.4.5 release)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    programUrl:
      'https://github.com/morph-l2/morph/tree/v0.4.5/prover/bin/client',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0059b74a8fd03c44462de3916b45ebeedb9f1158e3037e8c40b8941cbe438d7e.md',
    ),
  },
  '0x00ad538a51c761c06f5075d11f3ee64d5d00c272a741ccf098e1d9f062fee13d': {
    title: 'Morph Guest program (v0.4.9 release)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    programUrl:
      'https://github.com/morph-l2/morph/tree/v0.4.9/prover/bin/client',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00ad538a51c761c06f5075d11f3ee64d5d00c272a741ccf098e1d9f062fee13d.md',
    ),
  },
  '0x00940d658cf507217304ec5f7ca5558e2e0fd67881485f604b63588c31a8792f': {
    title: 'Morph Guest program (v0.5.3 release)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    programUrl:
      'https://github.com/morph-l2/morph/tree/v0.5.3/prover/bin/client',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00940d658cf507217304ec5f7ca5558e2e0fd67881485f604b63588c31a8792f.md',
    ),
  },
  '0x00c4ea13863f7b423f53140f432d7147e48b8e31660420636931c0a72459c25c': {
    title: 'Morph Guest program (v0.5.6 release)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    programUrl:
      'https://github.com/morph-l2/morph/tree/v0.5.6/prover/bin/client',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00c4ea13863f7b423f53140f432d7147e48b8e31660420636931c0a72459c25c.md',
    ),
  },
  '0x00f1b104202c89fe60d973cbf456a4e2e1ec1e7d63c61453b959dda153df798c': {
    title: 'Morph Guest program (v0.5.7 release)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    programUrl:
      'https://github.com/morph-l2/morph/tree/v0.5.7/prover/bin/client',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00f1b104202c89fe60d973cbf456a4e2e1ec1e7d63c61453b959dda153df798c.md',
    ),
  },
  '0x001d6dd65980c80ef8496f4a0bd9b2ccc1c9e66aeb122f841e0b90e322bbacdd': {
    title: 'Aggregation program of Ethscriptions ZK Fault Proofs',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of the Ethscriptions L2 client.',
    programUrl:
      'https://github.com/0xFacet/ethscriptions-zk-fault-proofs/tree/251c5248cf92b544a3e6b1b4c0b98b0146dab1c6/programs/aggregation',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x001d6dd65980c80ef8496f4a0bd9b2ccc1c9e66aeb122f841e0b90e322bbacdd.md',
    ),
  },
  '0x5a02c6f96d93f5ff1bfe8f5f2f7f158a3bc6ab7e294d3f7824507a1c67edf594': {
    title: 'Range program of Ethscriptions ZK Fault Proofs',
    description:
      'Proves correct state transition function within the Ethscriptions L2 client over a range of consecutive L2 blocks.',
    programUrl:
      'https://github.com/0xFacet/ethscriptions-zk-fault-proofs/tree/251c5248cf92b544a3e6b1b4c0b98b0146dab1c6/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1turbo'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x5a02c6f96d93f5ff1bfe8f5f2f7f158a3bc6ab7e294d3f7824507a1c67edf594.md',
    ),
  },
  '0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a': {
    ...WASM_MODULE_ROOT('v40'),
    verificationStatus: 'successful',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v40/arbos',
    verificationSteps: readMarkdown(
      'common/programHashes/0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a.md',
    ),
  },
  '0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499': {
    ...WASM_MODULE_ROOT('v51'),
    verificationStatus: 'successful',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v51/arbos',
    verificationSteps: readMarkdown(
      'common/programHashes/0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499.md',
    ),
  },
  '0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c': {
    ...WASM_MODULE_ROOT('v51.1'),
    verificationStatus: 'notVerified',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v51.1/arbos',
    verificationSteps: readMarkdown(
      'common/programHashes/0xc2c02df561d4afaf9a1d6785f70098ec3874765c638e3cb6dbe8d3c83333e14c.md',
    ),
  },
  '0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39': {
    ...WASM_MODULE_ROOT('v32'),
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v32/arbos',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39.md',
    ),
  },
  '0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4': {
    // only used by archived projects
    ...WASM_MODULE_ROOT('v20'),
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v20/arbos',
    verificationStatus: 'notVerified',
  },
  '0x58a9512cf4096461f866446387e845c6573856ef603bba4e24cb1d89630a675c': {
    // only used by archived projects
    ...WASM_MODULE_ROOT('Kinto'),
    verificationStatus: 'notVerified',
  },
  '0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69': {
    // only used by archived projects
    ...WASM_MODULE_ROOT('v31'),
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v31/arbos',
    verificationStatus: 'notVerified',
  },
  '0x5b82aa008989d331bf6f3cf75b85a04c9ee809447c19b85fecaf3b7d749a6576': {
    ...WASM_MODULE_ROOT('Apechain'),
    verificationStatus: 'notVerified', // Apechain has closed challengers, so I think it doesn't make sense to mark them red for non reproducible program
    verificationSteps:
      'The sources for this program are located in a private repository, shared with L2BEAT to independently regenerate the wasm module root. This value is not reproducible by members of public, but we attest that it can be obtained from sources.',
  },
  '0x2dc824fed99dcdf659f2523ad68d1ec70bd5f08e3c533996be3a2d2b19813e83': {
    ...WASM_MODULE_ROOT('Apechain'),
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'The sources for this program are located in a private repository, shared with L2BEAT to independently regenerate the wasm module root. This value is not reproducible by members of public, but we attest that it can be obtained from sources.',
  },
  '0x2c9a9d645ae56304c483709fc710a58a0935ed43893179fe4b275e1400503ea7': {
    ...WASM_MODULE_ROOT('Syndicate'),
    verificationStatus: 'notVerified',
  },
  '0xc10cd7ec6acaf1c441a3f6bd0900ad20f15855ba775a96f1939118cbc629dc97': {
    ...WASM_MODULE_ROOT('v61'),
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v61/arbos',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xc10cd7ec6acaf1c441a3f6bd0900ad20f15855ba775a96f1939118cbc629dc97.md',
    ),
  },
  '0xa18d6266cef250802c3cb2bfefe947ea1aa9a32dd30a8d1dfc4568a8714d3a7a': {
    ...WASM_MODULE_ROOT('v41'),
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v41/arbos',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xa18d6266cef250802c3cb2bfefe947ea1aa9a32dd30a8d1dfc4568a8714d3a7a.md',
    ),
  },
  '0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287': {
    title: 'Celestia Nitro 3.2.1 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games, which uses Celestia DA.',
    programUrl: 'https://github.com/celestiaorg/nitro/tree/v3.2.1-rc.1/arbos',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287.md',
    ),
  },
  '0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3': {
    title: 'Celestia Nitro 3.3.2 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games, which uses Celestia DA.',
    programUrl:
      'https://github.com/celestiaorg/nitro/tree/celestia-v3.3.2/arbos',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3.md',
    ),
  },
  '0x0323914d3050e80c3d09da528be54794fde60cd26849cd3410dde0da7cd7d4fa': {
    title: 'OP Kona absolute prestate v1.2.7 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program of Kona client.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/d181d5b197665df9b5efd66e4f76f09adf5c697f/kona',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0323914d3050e80c3d09da528be54794fde60cd26849cd3410dde0da7cd7d4fa.md',
    ),
  },
  '0x033c000916b4a88cfffeceddd6cf0f4be3897a89195941e5a7c3f8209b4dbb6e': {
    ...ABSOLUTE_PRESTATE('v1.9.0 (cannon64)'),
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.9.0/op-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x033c000916b4a88cfffeceddd6cf0f4be3897a89195941e5a7c3f8209b4dbb6e.md',
    ),
  },
  // Active CANNON_KONA prestate (Karst). Reproduced via kona Docker build,
  // tag kona-client/v1.6.0-rc.2 (commit d7cea91b).
  '0x0337ecb3604c0b40c352e0c7711beb17a212d583f4fe956fd8d66e29ad5f9025': {
    title: 'OP Kona absolute prestate v1.6.0-rc.2 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program of Kona client.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/d7cea91bc2f555a76b7720bf9c32f46c0b856119/kona',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0337ecb3604c0b40c352e0c7711beb17a212d583f4fe956fd8d66e29ad5f9025.md',
    ),
  },
  '0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6': {
    ...ABSOLUTE_PRESTATE('v1.6.0 (cannon64)'),
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.6.0/op-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6.md',
    ),
  },
  '0x03caa1871bb9fe7f9b11217c245c16e4ded33367df5b3ccb2c6d0a847a217d1b': {
    ...ABSOLUTE_PRESTATE('v1.8.0-rc.4 (cannon64)'),
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.8.0-rc.4/op-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x03caa1871bb9fe7f9b11217c245c16e4ded33367df5b3ccb2c6d0a847a217d1b.md',
    ),
  },
  '0x03ddcb9294fef6dd477b4e911fd777fda0832fdd10aa594ac941540ea62a2aa0': {
    ...ABSOLUTE_PRESTATE('Boba'),
    verificationStatus: 'unsuccessful',
  },
  '0x03c7ae758795765c6664a5d39bf63841c71ff191e9189522bad8ebff5d4eca98': {
    ...ABSOLUTE_PRESTATE('Cyber'),
    verificationStatus: 'unsuccessful',
  },
  '0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c': {
    ...ABSOLUTE_PRESTATE('v1.3.1'),
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-node/v1.3.1/op-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c.md',
    ),
  },
  '0x03cb5216c8cf2902c66127db119ba03a1296205736addc39cfeafc7c14d0bd14': {
    ...ABSOLUTE_PRESTATE('Lisk'),
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-contracts/v1.3.0/op-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x03cb5216c8cf2902c66127db119ba03a1296205736addc39cfeafc7c14d0bd14.md',
    ),
  },
  '0x03eb07101fbdeaf3f04d9fb76526362c1eea2824e4c6e970bdb19675b72e4fc8': {
    ...ABSOLUTE_PRESTATE('v1.6.1 (cannon64)'),
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.6.1/op-program',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x03eb07101fbdeaf3f04d9fb76526362c1eea2824e4c6e970bdb19675b72e4fc8.md',
    ),
  },
  '0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609': {
    title: 'Cartesi Honeypot v2 template hash',
    description:
      'The hash of the initial Cartesi machine state that is used in Dave dispute games of Cartesi Honeypot v2.',
    programUrl:
      'https://github.com/cartesi/honeypot/blob/699c2b12745f1f7da708cb497106e657e3a67e49/honeypot.cpp',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609.md',
    ),
  },
  '0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14': {
    title: 'Cartesi Honeypot v1 template hash',
    description:
      'The hash of the initial Cartesi machine state that is used in Dave dispute games of Cartesi Honeypot v1.',
    verificationStatus: 'notVerified',
  },
  '0x5731b637d9e3b693fc0d74e570bac76ca6c0defe3e4c119b1cea981a9bd307d6': {
    title: 'Appchain TEE Enclave hash',
    verificationStatus: 'unsuccessful',
  },
  '0x025b20bb8cd6aebf15f787050c19291014ec2ef70cf045f756c3a90d2a672373': {
    title: 'Apechain TEE Enclave hash',
    verificationStatus: 'unsuccessful',
  },
  '0x002bb66c60302a81a621d7899e3f6ee1d0db9fb1eae5d1e80e94a33cb1e24922': {
    title: 'Nitro TEE Aggregated Verifer',
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/automata-network/aws-nitro-enclave-attestation/tree/f6f9410227adc63ff5117ce3f6f7e0f155083389/crates/sp1-methods/sp1-aggregator',
    description:
      'Verifies correctness of several aggregated TEE attestations for correctly running Arbitrum Nitro within a trusted enclave.',
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'According to Automata Network, the linked program was compiled in a non-reporducible way (without docker). The compiled binary could not be reproduced.',
  },
  '0x00e874289e8c7f42381b6220f438801d2d1478dc8230f866a31e5ceec6e93322': {
    title: 'Nitro TEE Verifer',
    proverSystemProject: ProjectId('sp1turbo'),
    programUrl:
      'https://github.com/automata-network/aws-nitro-enclave-attestation/tree/f6f9410227adc63ff5117ce3f6f7e0f155083389/crates/sp1-methods/sp1-verifier',
    description:
      'Verifies correctness of a single TEE attestation for correctly running Arbitrum Nitro within a trusted enclave.',
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'According to Automata Network, the linked program was compiled in a non-reporducible way (without docker). The compiled binary could not be reproduced.',
  },
  '0x00294928e44f0cdc9c74848c4cafcdb29f733a3bc07408c240be3d5afe750b3e': {
    title: 'Nitro TEE Aggregated Verifer',
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/automata-network/aws-nitro-enclave-attestation/tree/8607619cc620a93d029a9569bccf752f341aad99/crates/sp1-methods/sp1-aggregator',
    description:
      'Verifies correctness of several aggregated TEE attestations for correctly running Arbitrum Nitro within a trusted enclave.',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00294928e44f0cdc9c74848c4cafcdb29f733a3bc07408c240be3d5afe750b3e.md',
    ),
  },
  '0x00643c7149cf335e7ec9d3f3301e69658a7f0ef2bc7546509c257ed8809f28e1': {
    title: 'Nitro TEE Verifer',
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/automata-network/aws-nitro-enclave-attestation/tree/8607619cc620a93d029a9569bccf752f341aad99/crates/sp1-methods/sp1-verifier',
    description:
      'Verifies correctness of a single TEE attestation for correctly running Arbitrum Nitro within a trusted enclave.',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00643c7149cf335e7ec9d3f3301e69658a7f0ef2bc7546509c257ed8809f28e1.md',
    ),
  },
  '0x0085924e73e2b0d0e2626c592825fe092d3cfb63b108757965b2a6c06c8c311b': {
    title: 'Fluent Nitro TEE verifier v1.0.0',
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/fluentlabs-xyz/fluent-stf/tree/v1.0.0/bin/aws-nitro-validator',
    description:
      'Verifies correctness of a single TEE attestation for executing Fluent STF within a trusted enclave on AWS cloud.',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x0085924e73e2b0d0e2626c592825fe092d3cfb63b108757965b2a6c06c8c311b.md',
    ),
  },
  '0x00fb9ae7af3b4852bd4524789cb15dbf188ee47b1d3838bdd39062821c6182e6': {
    title: 'Fluent Nitro TEE verifier v1.0.3',
    proverSystemProject: ProjectId('sp1hypercube'),
    programUrl:
      'https://github.com/fluentlabs-xyz/fluent-stf/tree/v1.0.3/bin/aws-nitro-validator',
    description:
      'Verifies correctness of a single TEE attestation for executing Fluent STF within a trusted enclave on AWS cloud.',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x00fb9ae7af3b4852bd4524789cb15dbf188ee47b1d3838bdd39062821c6182e6.md',
    ),
  },
  '0x00e34107e4c5284bd4ecc4269c650671038c1e85d9dacb931b534e984f607334': {
    title: 'Fluent STF guest program',
    proverSystemProject: ProjectId('sp1hypercube'),
    // programUrl:
    //   'https://github.com/fluentlabs-xyz/fluent-stf/tree/djadjka/release-1.0.1/bin/client',
    description:
      'Guest program implementing state transition function of the Fluent rollup',
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'According to the Fluent team, the sources for this program were not yet published. Thus it cannot be verified.',
    //       verificationSteps: `
    // Regeneration steps are based on [this guide](https://github.com/fluentlabs-xyz/fluent-stf/blob/v1.0.0/README.md). The process is reproducible on a Linux machnie.

    // 1. Install prerequesits: docker, python3, git, jq.
    // 2. Checkout correct branch in https://github.com/fluentlabs-xyz/fluent-stf/tree/v1.0.0: \`git checkout v1.0.0\`. Commit hash should be \`c8023c370a3fb859b591223bf81a9fe81df43778\`.
    // 3. Build client program for the mainnet within docker: \`make build-client-docker NETWORK=mainnet\`. This command will create \`rsp-client-mainnet.vkey\` file with the program hash string.
    //     `
  },
  '0x003147cde8e7d519d3dbae6b76f1198a70d4ff477a3aaea73bee4153f250288a': {
    title: 'Aggregation program of Base AggregateVerifier',
    programUrl:
      'https://github.com/base/base/tree/v0.9.1/crates/proof/succinct/programs/aggregation',
    description:
      'Aggregates range proofs of correct execution for several consecutive sub-ranges of Base L2 blocks.',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x003147cde8e7d519d3dbae6b76f1198a70d4ff477a3aaea73bee4153f250288a.md',
    ),
  },
  '0x001df6dffb10eebfa70e392bb6a4d0d1e3e5ac48cf07d473b6c244bdd8243a3b': {
    title: 'Aggregation program of Base AggregateVerifier',
    programUrl:
      'https://github.com/base/base/tree/v1.1.1/crates/proof/succinct/programs/aggregation',
    description:
      'Aggregates range proofs of correct execution for several consecutive sub-ranges of Base L2 blocks.',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/base-aggregate-verifier.md',
      {
        version: 'v1.1.1',
        commitHash: '01e732cdbae0c624d652da9e608d7d3fe0f9c74b',
      },
    ),
  },
  '0x44f625fa2a41367670d74a7b0d9899412dc1ca406f90df7a5bd9f8ae581ee47f': {
    title: 'Range program of Base AggregateVerifier',
    programUrl:
      'https://github.com/base/base/tree/v0.9.1/crates/proof/succinct/programs/range',
    description:
      'Proves correct state transition function of the Base rollup over a sub-range of L2 blocks.',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x44f625fa2a41367670d74a7b0d9899412dc1ca406f90df7a5bd9f8ae581ee47f.md',
    ),
  },
  '0x505c97f13a996b722a90d54753fb82de5ce1b9e94bd499a46d42b2982188d677': {
    title: 'Range program of Base AggregateVerifier',
    programUrl:
      'https://github.com/base/base/tree/v1.1.1/crates/proof/succinct/programs/range/ethereum',
    description:
      'Proves correct state transition function of the Base rollup over a sub-range of L2 blocks.',
    proverSystemProject: ProjectId('sp1hypercube'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/base-aggregate-verifier.md',
      {
        version: 'v1.1.1',
        commitHash: '01e732cdbae0c624d652da9e608d7d3fe0f9c74b',
      },
    ),
  },
  '0xc9536fb5b1387f30d16f6b95a5a26de352f8056866482bca632f7219896ea74c': {
    title: 'TEE enclave image hash of Base client',
    programUrl:
      'https://github.com/base/base/tree/v0.9.0/crates/proof/tee/nitro-enclave',
    description:
      'TEE image hash of Base L2 node program. AWS Nitro Enclave attestations guarantee that exactly this program was run within a TEE.',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0xc9536fb5b1387f30d16f6b95a5a26de352f8056866482bca632f7219896ea74c.md',
    ),
  },
  '0x58557c709e93357a135041297107aecc4bc6ba616509098a4aa8dbef774d212a': {
    title: 'TEE enclave image hash of Base client',
    programUrl:
      'https://github.com/base/base/tree/v1.1.1/crates/proof/tee/nitro-enclave',
    description:
      'TEE image hash of Base L2 node program. AWS Nitro Enclave attestations guarantee that exactly this program was run within a TEE.',
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/base-tee-enclave-image.md',
      {
        version: 'v1.1.1',
        commitHash: '01e732cdbae0c624d652da9e608d7d3fe0f9c74b',
      },
    ),
  },
  '0x20141665fe40bce01fbcfa0a95c8a1bd750eadbe3f24e06a75571e6fd7a9dc11': {
    title: 'AWS Nitro TEE attestation verifier for Base',
    programUrl:
      'https://github.com/base/base/tree/v0.9.0/crates/proof/tee/nitro-attestation-prover',
    description:
      'RISC Zero guest program that verifies an AWS Nitro TEE Enclave attestation document.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'successful',
    verificationSteps: readMarkdown(
      'common/programHashes/0x20141665fe40bce01fbcfa0a95c8a1bd750eadbe3f24e06a75571e6fd7a9dc11.md',
    ),
  },
}
