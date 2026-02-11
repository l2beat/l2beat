import { assert, ProjectId } from '@l2beat/shared-pure'
import type { ProjectScalingContractsProgramHash } from '../types'

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

const programHashes: Record<
  ProjectScalingContractsProgramHash['hash'],
  Omit<ProjectScalingContractsProgramHash, 'hash'>
> = {
  '0x0075c7ec424df1386508596dc886e528c733a5f2c7728e7a81ad7676495ff31c': {
    title: 'Aggregation program of OP Succinct FDP',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client in fault dispute proof mode.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.1/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: `
    Prepare:
    
    1. Install cargo make: \`cargo install --debug --locked cargo-make\`
    2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
    3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)
    
    Verify:
    
    1. Checkout the correct branch in [celo-org/op-succinct](https://github.com/celo-org/op-succinct) repo:  \`git checkout celo/v1.0.1\` . Commit hash should be  \`4408f080e40526eaf2e327ac651e106842478523\`.
    2. Make sure docker is running by running  \`docker ps\`
    3. From the  \`op-succinct\` dir:  \`cargo run --bin config --release --features eigenda\` to build the SP1 programs for EigenDA features and generate and print verification key hashes.
        `,
  },
  '0x223fe2ba07be84da6afb2e3c1ed5c76b182aed383ad45aee40970cd30bcf9a83': {
    title: 'Range program of OP Succinct FDP',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks in fault dispute proof mode.',
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.1/programs/range/eigenda',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [celo-org/op-succinct](https://github.com/celo-org/op-succinct) repo:  \`git checkout celo/v1.0.1\` . Commit hash should be  \`4408f080e40526eaf2e327ac651e106842478523\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the  \`op-succinct\` dir:  \`cargo run --bin config --release --features eigenda\` to build the SP1 programs for EigenDA features and generate and print verification key hashes.
    `,
  },
  '0x00b37da93c30bef199e4f70190c46367ade11ab988c3cff4c661960919718afd': {
    title: 'Aggregation program of OP Succinct FDP',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client in fault dispute proof mode.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.2/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [celo-org/op-succinct](https://github.com/celo-org/op-succinct) repo:  \`git checkout celo/v1.0.2\` . Commit hash should be  \`a8d870c320c158a2a2e4eee0303c688b15bea2c0\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the  \`op-succinct\` dir:  \`cargo run --bin config --release --features eigenda\` to build the SP1 programs for EigenDA features and generate and print verification key hashes.
  `,
  },
  '0x05ca7dfb1b7ca7a103fa36750d622f81182eb7c9679b9487418968400e2b1a29': {
    title: 'Range program of OP Succinct FDP',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks in fault dispute proof mode.',
    programUrl:
      'https://github.com/celo-org/op-succinct/tree/celo/v1.0.2/programs/range/eigenda',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [celo-org/op-succinct](https://github.com/celo-org/op-succinct) repo:  \`git checkout celo/v1.0.2\` . Commit hash should be  \`a8d870c320c158a2a2e4eee0303c688b15bea2c0\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the  \`op-succinct\` dir:  \`cargo run --bin config --release --features eigenda\` to build the SP1 programs for EigenDA features and generate and print verification key hashes.
    `,
  },
  '0x003991487ea72a40a1caa7c234b12c0da52fc4ccc748a07f6ebd354bbb54772e': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v2.3.1/programs/aggregation',
    verificationStatus: 'notVerified',
  },
  '0x00afb45d8064ae10aa6a1793b8f39a24c27268efae2917b5c02950b2377fbf00': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.1.0-agglayer/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [agglayer/op-succinct](https://github.com/agglayer/op-succinct) repo:  \`git checkout v3.1.0-agglayer\` . Commit hash should be  \`9af9cecad2c7f6ee17c87e9bba616ef4d638c958\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the  \`op-succinct/programs/aggregation\` dir:  \`cargo prove build --elf-name aggregation-elf --docker --tag v5.1.0 --output-directory ../../elf\` to generate aggregation program elf from sources
4. From op-succinct/elf dir:  \`cargo prove vkey --elf aggregation-elf \` to check the verification key of this elf.
    `,
  },
  '0x490685ea27adbbb83301073734f40a5656c984fe352359d54dd637e828e66872': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v2.3.1/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x416d710344b6b6fa2a0b1a1445f3d6ba4fdd5ab43f0e863b1c522db20f28ad9b': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    programUrl:
      'https://github.com/agglayer/op-succinct/tree/v3.1.0-agglayer/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00eff0b6998df46ec388bb305618089ae3dc74e513e7676b2e1909694f49cc30': {
    title: 'Pessimistic program of agglayer',
    description:
      'Verifies that a chain connected to Polygon Agglayer does not bridge out more tokens that were bridged in, thus preventing stealing tokens from other Agglayer chains. Also verifies aggchain proof for this chain.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/agglayer/agglayer/tree/v0.3.3-post.4/crates/pessimistic-proof-program',
    verificationStatus: 'successful',
    verificationSteps: `
    Prepare:
    
    1. Install cargo make: \`cargo install --debug --locked cargo-make\`
    2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
    3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)
    
    Verify:
    
    1. Checkout the correct branch in [agglayer repo](https://github.com/agglayer/agglayer/tree/main): \`git checkout v0.3.3-post.4\`. Commit hash should be \`df072abc86fa89e12b17204246325983272a1141\`
    2. Make sure docker is running by running \`docker ps\`
    3. From the root dir: \`cargo make install-cargo-prove\` to install the correct version of sp1 toolchain
    4. From the root dir: \`cargo make pp-elf\` to generate pessimistic program elf from sources
    5. From the pessimistic-proof/elf dir: \`cargo prove vkey --elf riscv32im-succinct-zkvm-elf\` to check the verification key of this elf
      `,
  },
  '0x000055f14384bdb5bb092fd7e5152ec31856321c5a30306ab95836bdf5cdb639': {
    title: 'Pessimistic program of agglayer',
    description:
      'Verifies that a chain connected to Polygon Agglayer does not bridge out more tokens that were bridged in, thus preventing stealing tokens from other Agglayer chains. Also verifies aggchain proof for this chain.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/agglayer/agglayer/tree/v0.4.4/crates/pessimistic-proof',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [agglayer repo](https://github.com/agglayer/agglayer/tree/main): \`git checkout v0.4.4\`. Commit hash should be \`caac9f06bc7cb1cf89912dbb4dffa4d594a00bd5\`.
2. Make sure docker is running by running \`docker ps\`
3. From the root dir: \`cargo make pp-elf\` to generate pessimistic program elf from sources
4. From the pessimistic-proof/elf dir: \`cargo prove vkey --elf riscv32im-succinct-zkvm-elf\` to check the verification key of this elf.
    `,
  },
  '0x713f8a687452545141b6cd852472c67742a5c61474b97a136d0d107804affa1f': {
    title: 'Aggchain program of agglayer',
    description:
      'Verifies state transition of an Agglayer-based chain either by checking a full validity proof or just by checking a registered sequencer signature. Also checks that L1 information on the chain aligns with the values stored on Agglayer.',
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.1.2/crates/aggchain-proof-program',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [provers repo](https://github.com/agglayer/provers): \`git checkout v1.1.2\`. Commit hash should be \`f8580024d771580217ded443f85e42919d682595\`.
2. Make sure docker is running by running \`docker ps\`
3. From the root dir: \`cargo make install-cargo-prove\` to install the correct version of sp1 toolchain
4. From the root dir: \`cargo make ap-elf\` to generate aggchain program elf from sources
5. Compute vkey hash bytes of the generated \`crates/aggchain-proof-program/elf/riscv32im-succinct-zkvm-elf\` using SP1 toolchain, e.g. by this simple rust script:

\`\`\`
use sp1_sdk::{HashableKey, Prover, CpuProver};

fn main() {
    let elf_path = std::env::args().nth(1).expect("Provide elf_path");
    let elf_bytes = std::fs::read(&elf_path).expect("File read error");
    let prover = CpuProver::new();
    let (_pk, vkey) = Prover::setup(&prover, &elf_bytes);
    let comm = vkey.hash_bytes();
    let hex: String = comm.iter().
        map(|b| format!("{:02x}", b)).collect();
    println!("0x{}", hex);
}
\`\`\`
    `,
  },
  '0x374ee73950cdb07d1b8779d90a8467df232639c13f9536b03f1ba76a2aa5dac6': {
    title: 'Aggchain program of agglayer',
    description:
      'Verifies state transition of an Agglayer-based chain either by checking a full validity proof or just by checking a registered multisig signature. Also checks that L1 information on the chain aligns with the values stored on Agglayer.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.5.0/crates/aggchain-proof-program',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [provers repo](https://github.com/agglayer/provers): \`git checkout v1.5.0\`. Commit hash should be \`347a140649383d8f5aa5a14907a45cfa756426af\`.
2. Make sure docker is running by running \`docker ps\`
3. From the root dir: \`cargo make ap-elf\` to generate aggchain program elf from sources
4. Compute vkey hash bytes of the generated \`crates/aggchain-proof-program/elf/riscv32im-succinct-zkvm-elf\` using SP1 toolchain, e.g. by this simple rust script:

\`\`\`
use sp1_sdk::{HashableKey, Prover, CpuProver};

fn main() {
    let elf_path = std::env::args().nth(1).expect("Provide elf_path");
    let elf_bytes = std::fs::read(&elf_path).expect("File read error");
    let prover = CpuProver::new();
    let (_pk, vkey) = Prover::setup(&prover, &elf_bytes);
    let comm = vkey.hash_bytes();
    let hex: String = comm.iter().
        map(|b| format!("{:02x}", b)).collect();
    println!("0x{}", hex);
}
\`\`\`
    `,
  },
  '0x6e38caa6114ac4b9779f647547de9e8f09e9f5cd6194e7134110760d3aa31b53': {
    title: 'Aggchain program of agglayer',
    description:
      'Verifies state transition of an Agglayer-based chain either by checking a full validity proof or just by checking a registered multisig signature. Also checks that L1 information on the chain aligns with the values stored on Agglayer.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/agglayer/provers/tree/v1.8.0/crates/aggchain-proof-program', // ??? verify version tag
    verificationStatus: 'successful',
    verificationSteps: `
  Prepare:
  
  1. Install cargo make: \`cargo install --debug --locked cargo-make\`
  2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
  3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)
  

  Verify:
  
  1. Checkout the correct branch in [provers repo](https://github.com/agglayer/provers): \`git checkout v1.8.0\`. Commit hash should be \`df2e48ad8432a863bdc0a939108d37a69f4bea4e\`
  2. Make sure docker is running by running \`docker ps\`
  3. From the root dir: \`cargo make ap-elf\` to generate aggchain program elf from sources
  4. Compute vkey hash bytes of the generated \`crates/aggchain-proof-program/elf/riscv32im-succinct-zkvm-elf\` using SP1 toolchain, e.g. by this simple rust script:
  
  \`\`\`
  use sp1_sdk::{HashableKey, Prover, CpuProver};
  
  fn main() {
      let elf_path = std::env::args().nth(1).expect("Provide elf_path");
      let elf_bytes = std::fs::read(&elf_path).expect("File read error");
      let prover = CpuProver::new();
      let (_pk, vkey) = Prover::setup(&prover, &elf_bytes);
      let comm = vkey.hash_bytes();
      let hex: String = comm.iter().
          map(|b| format!("{:02x}", b)).collect();
      println!("0x{}", hex);
  }
  \`\`\`
      `,
  },
  '0x00de39c136b88dfeacb832629e21a9667935bc0e74aaa21292e4f237d79d0bef': {
    title: 'Celestia Blobstream DA bridge program',
    description:
      'ZK-friendly implementation of Celestia Blobstream DA bridge that proves that enough Celestia validators have confirmed a given data root.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0057b7de6dcd8ff25e7b41089f4b5fa586067fbb107756d1f66d92fe71dd6ad1': {
    title: 'Avail VectorX DA bridge program',
    description:
      'ZK-friendly implementation of Avail Vector DA bridge that proves that a given data root was finalized on Avail.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00bca7947ba758bd6f539f480c6d983cca4bd4387a411a41a71fb953d5df3de7': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x2d0dcc4f4a5e59b80239c28a3fb68ab63b8eaf6f132239e95f927da9046f4256': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x006110a295396036ad8df48c333e2b99b11624799138fbc18e10181551e29eb1': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x5d15e85151cc8f4b68d2721f675b0b8665a7a2752fa34ff935d5adbc3c8acab8': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x05044f60230e1ea664a43fa92e27735e3bbc97736c2e7ab961a5115a732a6da5': {
    title: 'Range program of OP Succinct (Mantle)',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks. Mantle-specific build addressing revm/geth inconsistency.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x008adbf6e7ba087ac0b05572c938b7707400d7b41318efcbc1d7ffbbbed50452': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x40bc0563112dcc6868037ea0445916342df200ec0152bf7b4c2cca1d640fdaa3': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0083a8b50160475a7a5911c03dfdee30f6c8a83112a71c5c1125cfb96148b8c2': {
    title: 'Aggregation program of Facet v1 (OP Succinct)',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    programUrl:
      'https://github.com/0xFacet/zk-fault-proofs/tree/facet/programs/aggregation',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [zk-fault-proofs](https://github.com/0xFacet/zk-fault-proofs) repo:  \`git checkout facet\` . Commit hash should be  \`ad0ef0488e714212cb420ae04c9b242d9ef26f24\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the root dir:  \`cargo run --bin config --release\` to build the SP1 programs and generate and print verification key hashes.
  `,
  },
  '0x43f01f7522e77ddc0bea30de6cb8075608a0d0c906660e4f5f430a1e5e170829': {
    title: 'Range program of Facet v1 (OP Succinct)',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    programUrl:
      'https://github.com/0xFacet/zk-fault-proofs/tree/facet/programs/range',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [zk-fault-proofs](https://github.com/0xFacet/zk-fault-proofs) repo:  \`git checkout facet\` . Commit hash should be  \`ad0ef0488e714212cb420ae04c9b242d9ef26f24\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the root dir:  \`cargo run --bin config --release\` to build the SP1 programs and generate and print verification key hashes.
  `,
  },
  '0x0050b72e60cf8aef095d5718413fd32e1c18d0e54ebc4b9f560cf1cd93dd2605': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x04415a0d46de8b145eb5056969fa3b5900c3c23a21cb3feb2bdcb8da752de7a1': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x007efdd073c9845bbc446e0e62018af999bde96ecec416725391efa4a3f0a44d': {
    title: 'Aggregation program of OP Succinct',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of OP L2 client.',
    proverSystemProject: ProjectId('sp1'),
    programUrl:
      'https://github.com/succinctlabs/op-succinct/tree/v3.4.0-rc.1/programs/aggregation',
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`
3. Make sure the correct version of sp1 toolchain is installed: \`sp1up -v v5.2.4\`
4. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [succinctlabs/op-succinct](https://github.com/succinctlabs/op-succinct) repo:  \`git checkout v3.4.0-rc.1\` . Commit hash should be  \`c010f100c50ed226c86762b1a2845b13da0280bd \`.
2. Make sure docker is running by running  \`docker ps \`
3. From the  \`op-succinct/programs/aggregation \` dir:  \`cargo prove build --elf-name aggregation-elf --docker --tag v5.2.0 --output-directory ../../elf\` to generate aggregation program elf from sources
4. From op-succinct/elf dir:  \`cargo prove vkey --elf aggregation-elf \` to check the verification key of this elf.
    `,
  },
  '0x4b8234c47685b3361b22399702416a8010783b1b701b279073b4f0831e55da63': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x64c8517c14f10577381d8961139a4420420e90e528d02be96e2b0961671db248': {
    title: 'Range program of OP Succinct',
    description:
      'Proves correct state transition function within an OP L2 client over a range of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'The sources for this program contain a security advisory fix and are not published yet. Thus the hash cannot be independently regenerated.',
  },
  '0x00cd47e188eeeab95c3c666088b928ff8243f8dd8d6e94f49795013bcd6231f0': {
    title: 'SP1 Helios program',
    description:
      'Implements a light client of Ethereum, validating state data and block headers in a trust-minimized way.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x0040b6021bbe547fc651492bcc4eea12eaaa9b0a60086439206e27495ec6d6c3': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    description:
      'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00b14510cec97d3449eb84b814be2f4b5dae3eb56528d6bb65e1aa8226f2bed3': {
    title: 'Batch proving program of Raiko (reth Taiko)',
    description:
      'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x008f96447139673b3f2d29b30ad4b43fe6ccb3f31d40f6e61478ac5640201d9e': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    description:
      'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x00a32a15ab7a74a9a79f3b97a71d1b014cd4361b37819004b9322b502b5f5be1': {
    title: 'Batch proving program of Raiko (reth Taiko)',
    description:
      'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x7ce98c36408e86dac21fc16af301740d07a849be0a80529debcb0797fd66f5e3': {
    title: 'Kailua fault proof program (Risc0 v2.3.2)',
    description:
      'Program that executes OP Kona client to derive blocks and generate fault or validity proofs, is a part of ZK non-interactive fault proof system.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xd7c1d74ce26e897e8bc7ea094667dcdb04c405ba1836bdb9b0ad773fc9fd0651': {
    title: 'Kailua fault proof program (Risc0 v3.0.3)', // https://github.com/boundless-xyz/kailua/blob/3d284ca656a678f0546500e4a30c494a26358a18/book/src/setup.md?plain=1#L44
    description:
      'Program that executes OP Kona client to derive blocks and generate fault or validity proofs, is a part of ZK non-interactive fault proof system.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xf176eb82fbbb5d2d281a9cce459062bcdbe65f93d7156829b174fae2b4690c23': {
    title: 'Kailua fault proof program (Risc0 v3.0.4, Kailua v1.1.8)', // https://github.com/boundless-xyz/kailua/blob/dead453517c48240a221845640493b232255c907/book/src/setup.md
    description:
      'Program that executes OP Kona client to derive blocks and generate fault or validity proofs, is a part of ZK non-interactive fault proof system.',
    proverSystemProject: ProjectId('risc0'),
    programUrl: 'https://github.com/boundless-xyz/kailua/releases/tag/v1.1.8',
    verificationStatus: 'successful',
    verificationSteps: `
    Even though the program is compiled in docker for reproducibility reasons, it gives the correct image ID only on linux OS. Steps below were done on Ubuntu 22.04 OS.
    
    Prepare (see [kailua prerequisites](https://github.com/boundless-xyz/kailua?tab=readme-ov-file#prerequisites)):
    
    1. Install rust: \`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\`, then \`. .cargo/env\`.
    2. Install dependency libs \`sudo apt-get install build-essential libssl-dev clang\`.
    3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/).
    4. Install the risc zero toolkit \`curl -L https://risczero.com/install | bash\`, then \`rzup install\`.
    5. Install just, svm and foundry.
    
    Verify:
    
    1. Checkout the correct branch in [kailua](https://github.com/boundless-xyz/kailua) repo:  \`git checkout v1.1.8\`. Commit hash should be  \`e4b655382c5f481b61f0c4459fb3559b54c84137\`.
    2. Make sure docker is running by running  \`docker ps\`.
    3. Execute just script to build FPVM kona image: \`just build-fpvm-kona\`.
    4. Execute \`just export-fpvm\`. This command should output correct ImageID in a format of array of hex values instead of a single string. Note that the array elements will have bytes in the reverse order.
    `,
  },
  '0x951f56039ddaca6cdd588e55d7205882ec158e3afc5d048f2d723da0d8858ecf': {
    title: 'Kailua fault proof program (SOON)',
    description:
      'Program that executes OP Kona client to derive blocks and generate fault or validity proofs for SOON SVM chain, is a part of ZK non-interactive fault proof system.',
    programUrl: 'https://github.com/soonlabs/kailua-soon',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xf0ce5d15fa89991210ca2667b7f7a8bb740ce551c0f2b20cc76f9debc55d22c2': {
    title: 'Kailua fault proof program (MegaETH)',
    description:
      'Program that supposedly executes OP Kona client (no source available yet) to derive blocks and generate fault or validity proofs for MegaETH chain, is a part of ZK non-interactive fault proof system.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'unsuccessful',
    verificationSteps:
      'The sources for this program are under development and not published yet. The hash cannot be independently regenerated.',
  },
  '0xe9aec1d30d25da1ccfc02a81c4b71f32e0a6f675dff4ce01fe4bd5f96ff320bd': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    description:
      'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0xee950d20e2483b9b6b859272feaea2dd84cea8a9cfdf1af8834df6b75c3d715e': {
    title: 'Batch proving program of Raiko (reth Taiko)',
    description:
      'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0x3d933868e2ac698df98209b45e6c34c435df2d3c97754bb6739d541d5fd312e3': {
    title: 'Aggregation program of Raiko (reth Taiko)',
    description:
      'Aggregates proofs of correct execution for several consecutive block batches of Rust-based Taiko L2 client (raiko).',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0x77ff0953ded4fb48bb52b1099cc36c6b8bf603dc4ed9211608c039c7ec31b82b': {
    title: 'Batch proving program of Raiko (reth Taiko)',
    description:
      'Proves correct state transition function within Rust-based Taiko L2 client (raiko) over a batch of consecutive L2 blocks.',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'notVerified',
  },
  '0x70909b25db0db00f1d4b4016aeb876f53568a3e5a8e6397cb562d79947a02cc9': {
    title: 'Set builder program',
    description:
      'Recursively verifies a Merkle tree of zk proofs at once, identified by a Merkle Mountain Range root.',
    programUrl:
      'https://github.com/risc0/risc0-ethereum/tree/v3.0.1/crates/aggregation/guest/set-builder',
    proverSystemProject: ProjectId('risc0'),
    verificationStatus: 'successful',
    verificationSteps: `
Even though the program is compiled in docker for reproducibility reasons, it gives the correct image ID only on linux OS. Steps below were done on Ubuntu 22.04 OS.

Prepare:

1. Install rust: \`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\`, then \`. .cargo/env\`.
2. Install dependency libs \`sudo apt-get install build-essential\`.
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/).
4. Install the risc zero toolkit \`curl -L https://risczero.com/install | bash\`, then \`rzup install\`.

Verify:

1. Checkout the correct branch in [risc0-ethereum](https://github.com/risc0/risc0-ethereum/tree/main) repo:  \`git checkout v3.0.1\` . Commit hash should be  \`365e7b2db4f620fa256580c27558d2623362b9ae \`.
2. Make sure docker is running by running  \`docker ps \`.
3. Set env var to use Risc Zero docker build: \`export RISC0_USE_DOCKER=1\`.
4. From the repo root dir:  \`cargo risczero build --manifest-path crates/aggregation/guest/set-builder/Cargo.toml\` to build elf binaries from sources. This command should output correct ImageID.
    `,
  },
  '989994135429182905628199499137734285064642484443466268071170571058909750176':
    {
      title:
        'Applicative bootloader Cairo program (StarkWare_GpsStatementVerifier_2026_13)',
      description:
        'Cairo program that verifies the correct aggregation of several proofs of a base program.',
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/56407b69f3f19f69302a8623baa8c5f71f967eed/src/starkware/cairo/bootloaders/applicative_bootloader',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'successful',
      verificationSteps: `
The steps below are supposed to be run on linux OS. They could also be run on macOS, but several tweaks need to be made: update from \`lru-dict==1.1.8\` to \`lru-dict==1.3.0\` in \`scripts/requirements.txt\` and update \`python_interpreter\` in \`bazel_utils/python/stub.sh\` to the correct location.

1. Install [bazel](https://bazel.build) version 7.4.1 and \`gmp\` library using [brew](https://brew.sh):
\`\`\`
brew install bazelisk
USE_BAZEL_VERSION=7.4.1 bazelisk version
brew install gmp  # or sudo apt-get install libgmp-dev
\`\`\`

2. On linux, install JDK if you don't have it: \`sudo apt install openjdk-21-jre\`.

3. Check out the correct commit of <https://github.com/starkware-libs/cairo-lang/tree/master> repo:
\`\`\`
git clone https://github.com/starkware-libs/cairo-lang.git
cd cairo-lang
git checkout 56407b69f3f19f69302a8623baa8c5f71f967eed
\`\`\`

4. Update \`cairo-lang/src/starkware/cairo/bootloaders/BUILD\` file by appending [this snippet](/files/BUILD_ADDITION) at the end.
5. Copy [this hash_bootloaders.py script](/files/hash_bootloaders.py) that computes bootloader hashes into \`cairo-lang/src/starkware/cairo/bootloaders/\`.
6. Execute the script above by \`USE_BAZEL_VERSION=7.4.1 bazel run //src/starkware/cairo/bootloaders:cairo_hash_bootloaders_exe\`. The output of the script should contain the correct hash.
      `,
    },
  '37889379279861089970868356983774360253508326951064758033885675883862334778':
    {
      title:
        'Simple bootloader Cairo program (StarkWare_GpsStatementVerifier_2025_12)',
      description:
        'Cairo program that can sequentially run multiple programs to reduce the size of the public inputs, and recursively verify bootloader proofs.',
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/56407b69f3f19f69302a8623baa8c5f71f967eed/src/starkware/cairo/bootloaders/simple_bootloader',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'successful',
      verificationSteps: `
The steps below are supposed to be run on linux OS. They could also be run on macOS, but several tweaks need to be made: update from \`lru-dict==1.1.8\` to \`lru-dict==1.3.0\` in \`scripts/requirements.txt\` and update \`python_interpreter\` in \`bazel_utils/python/stub.sh\` to the correct location.

1. Install [bazel](https://bazel.build) version 7.4.1 and \`gmp\` library using [brew](https://brew.sh):
\`\`\`
brew install bazelisk
USE_BAZEL_VERSION=7.4.1 bazelisk version
brew install gmp  # or sudo apt-get install libgmp-dev
\`\`\`

2. On linux, install JDK if you don't have it: \`sudo apt install openjdk-21-jre\`.

3. Check out the correct commit of <https://github.com/starkware-libs/cairo-lang/tree/master> repo:
\`\`\`
git clone https://github.com/starkware-libs/cairo-lang.git
cd cairo-lang
git checkout 56407b69f3f19f69302a8623baa8c5f71f967eed
\`\`\`

4. Update \`cairo-lang/src/starkware/cairo/bootloaders/BUILD\` file by appending [this snippet](/files/BUILD_ADDITION) at the end.
5. Copy [this hash_bootloaders.py script](/files/hash_bootloaders.py) that computes bootloader hashes into \`cairo-lang/src/starkware/cairo/bootloaders/\`.
6. Execute the script above by \`USE_BAZEL_VERSION=7.4.1 bazel run //src/starkware/cairo/bootloaders:cairo_hash_bootloaders_exe\`. The output of the script should contain the correct hash.
      `,
    },
  '3035974089339935040143966034750116008615662951603253398063766337728525196711':
    {
      title:
        'Simple bootloader Cairo program (StarkWare_GpsStatementVerifier_2025_11)',
      description:
        'Cairo program that can sequentially run multiple programs to reduce the size of the public inputs, and recursively verify bootloader proofs.',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'notVerified',
    },
  '160268921359133235574810995023520895391777547407923205700393332203861498631':
    {
      title:
        'Simple bootloader Cairo program (StarkWare_GpsStatementVerifier_2024_10)',
      description:
        'Cairo program that can sequentially run multiple programs to reduce the size of the public inputs, and recursively verify bootloader proofs.',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'notVerified',
    },

  '3585039955034622347908243360088523999417661979601115750324841620224559981237':
    {
      title:
        'Applicative bootloader Cairo program (StarkWare_GpsStatementVerifier_2025_11)',
      description:
        'Cairo program that verifies the correct aggregation of several proofs of a base program.',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'notVerified',
    },
  '1104316318711847786071125527957082259001554753246760931396914052122269757907':
    {
      title:
        'Applicative bootloader Cairo program (StarkWare_GpsStatementVerifier_2024_10)',
      description:
        'Cairo program that verifies the correct aggregation of several proofs of a base program.',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'notVerified',
    },
  '3480185788024326007166778030599498673382667448173974782477620863541158415714':
    {
      title:
        'Applicative bootloader Cairo program (StarkWare_GpsStatementVerifier_2025_12)',
      description:
        'Cairo program that verifies the correct aggregation of several proofs of a base program.',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'notVerified',
    },
  '1701025211190912681772481128523426351562426117847395998223683709327746845867':
    {
      title: 'Aggregation program for SHARP prover',
      description:
        'Cairo program that squashes the state diffs of several blocks.',
      programUrl:
        'https://github.com/starkware-libs/sequencer/blob/9b4f27df41e8c45aeeb155d4fe84a1df18a8358a/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/aggregator/main.cairo#L15',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'successful',
      verificationSteps: `
1. Install python and pip.
2. Install rust: \`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\`.
3. Checkout the correct version of [https://github.com/starkware-libs/sequencer/tree/main](https://github.com/starkware-libs/sequencer/tree/main): \`git checkout 9b4f27df41e8c45aeeb155d4fe84a1df18a8358a\`.
4. Install required python dependencies: \`python3 -m venv sequencer_venv\`, then \`. sequencer_venv/bin/activate && pip install -r scripts/requirements.txt\`.
5. Run \`UPDATE_EXPECT=1 cargo test -p apollo_starknet_os_program test_program_hashes\` to regenerate program hashes in \`crates/apollo_starknet_os_program/src/program_hash.json\`. The \`"aggregator_with_prefix"\` value of this file will be equivalent to dec value of the hash.
      `,
    },
  '760308386675154762009993173725077399730170358078020153308029499928875469870':
    {
      title: 'Aggregation program for SHARP prover',
      description:
        'Cairo program that squashes the state diffs of several blocks.',
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.14.0.1/src/starkware/starknet/core/aggregator',
      proverSystemProject: ProjectId('stwo'),
      verificationStatus: 'successful',
      verificationSteps: `
Steps:

1. Install python and pip.
2. Checkout the correct branch in [cairo-lang](https://github.com/starkware-libs/cairo-lang) repo: \`git checkout tag: v0.14.0.1\`. Commit hash should be \`66355d7d99f1962ff9ccba8d0dbacbce3bd79bf8\`.
3. Install the correct version of Cairo-lang toolkit: \`pip install cairo-lang==0.14.0.1\`.
4. From the root dir of the repo, compile the aggregation program sources into JSON using the installed cairo-compile: \`cairo-compile src/starkware/starknet/core/aggregator/main.cairo --cairo_path=src --output agg_compiled.json\`.
5. From the same dir, call the installed cairo-hash-program to compute program hash of the compiled aggregation program JSON: \`cairo-hash-program --program agg_compiled.json\`.
6. Convert the hex output into dec, e.g. by running \`python -c 'print(int("0x181...", 16))'\`  (you can replace \`0x181...\` with your output of \`cairo-hash-program\`).
7. Aggregator prefix must be added to the computed dec hash (see [here](https://github.com/starkware-libs/cairo-lang/blob/66355d7d99f1962ff9ccba8d0dbacbce3bd79bf8/src/starkware/cairo/bootloaders/aggregator_utils.py#L4)). You can do this by executing the following python script: 
\`from starkware.cairo.lang.vm.crypto import pedersen_hash
from starkware.python.utils import from_bytes
program_hash = {use the value obtained in step 6}
print(pedersen_hash(from_bytes(b"AGGREGATOR"), program_hash))\`
The output should be the aggregation program hash in dec.
      `,
    },
  '918745833886511857768061986591752808672496300091957204265383861063635175685':
    {
      title: 'Starknet OS',
      proverSystemProject: ProjectId('stwo'),
      description:
        'Proves correct state transition for a range of consecutive Starknet transactions.',
      programUrl:
        'https://github.com/starkware-libs/sequencer/blob/9b4f27df41e8c45aeeb155d4fe84a1df18a8358a/crates/apollo_starknet_os_program/src/cairo/starkware/starknet/core/os/os.cairo#L69',
      verificationStatus: 'successful',
      verificationSteps: `
1. Install python and pip.
2. Install rust: \`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\`.
3. Checkout the correct version of [https://github.com/starkware-libs/sequencer/tree/main](https://github.com/starkware-libs/sequencer/tree/main): \`git checkout 9b4f27df41e8c45aeeb155d4fe84a1df18a8358a\`.
4. Install required python dependencies: \`python3 -m venv sequencer_venv\`, then \`. sequencer_venv/bin/activate && pip install -r scripts/requirements.txt\`.
5. Run \`UPDATE_EXPECT=1 cargo test -p apollo_starknet_os_program test_program_hashes\` to regenerate program hashes in \`crates/apollo_starknet_os_program/src/program_hash.json\`. The \`"os"\` value of this file will be equivalent to dec value of the hash.
      `,
    },
  '793595346346724189681221050719974054861327641387231526786912662354259445535':
    {
      title: 'StarkNet OS',
      proverSystemProject: ProjectId('stwo'),
      description:
        'Proves correct state transition for a range of consecutive Starknet transactions.',
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.14.0.1/src/starkware/starknet/core/os',
      verificationStatus: 'successful',
      verificationSteps: `
Steps: 

1. Install python and pip.
2. Checkout the correct branch in [cairo-lang](https://github.com/starkware-libs/cairo-lang) repo: \`git checkout tag: v0.14.0.1\`. Commit hash should be \`66355d7d99f1962ff9ccba8d0dbacbce3bd79bf8\`.
3. Install the correct version of Cairo-lang toolkit: \`pip install cairo-lang==0.14.0.1\`.
4. From the root dir of the repo, compile the StarkNet OS sources into JSON using the installed cairo-compile: \`cairo-compile src/starkware/starknet/core/os/os.cairo --cairo_path=src --output os_compiled.json\`.
5. From the same dir, call the installed cairo-hash-program to compute program hash of the compiled StarkNet OS JSON: \`cairo-hash-program --program os_compiled.json\`.
6. Convert the hex output into dec, e.g. by running \`python -c 'print(int("0x1c...", 16))'\`  (you can replace \`0x1c...\` with your output of \`cairo-hash-program\`).
      `,
    },
  '2530337539466159944237001094809327283009177793361359619481044346150483328860':
    {
      title: 'StarkEx program used by ApeX and EdgeX',
      description:
        'Cairo program that implements an application-specific L2 with spot and perpetual trading functionality.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '273279642033703284306509103355536170486431195329675679055627933497997642494':
    {
      title: 'Aggregation program for SHARP prover',
      description:
        'Aggregates proofs of correct execution for several consecutive transaction ranges generated by StarkNet OS.',
      programUrl:
        'https://github.com/starkware-libs/cairo-lang/tree/v0.13.5/src/starkware/starknet/core/aggregator',
      proverSystemProject: ProjectId('stone'),
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
      title: 'StarkEx Spot v3.0 program',
      description:
        'Cairo program that implements application-specific L2 with spot and perpetual trading functionality.',
      programUrl:
        'https://github.com/starkware-libs/starkex-for-spot-trading/tree/bf49fb5a7411b71bf7b24ebcb13cd1b2282bfb48/src/starkware/cairo/dex',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '3174901404014912024702042974619036870715605532092680335571201877913899936957':
    {
      title: 'StarkEx Spot v4.0 program',
      description:
        'Cairo program that implements application-specific L2 with spot and perpetual trading functionality.',
      proverSystemProject: ProjectId('stone'),
      verificationStatus: 'notVerified',
    },
  '16830627573509542901909952446321116535677491650708854009406762893086223513':
    {
      title: 'StarkEx Spot v4.5 program',
      description:
        'Cairo program that implements application-specific L2 with spot and perpetual trading functionality.',
      proverSystemProject: ProjectId('stone'),
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
    title: 'Executable of the Scroll bundle program',
    description:
      'Proves the correct execution of a bundle of Scroll L2 blocks, which is the unit of L2 state finalisation from L1’s perspective.',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'notVerified',
  },
  '0x0038553adf417a6a3df35d2fdfd14b892f1e49ba18937ece7960c1e7cee6e3dc': {
    title: 'Config of the Scroll bundle program',
    description:
      'This is not a ZK program, but a commitment to the config of Scroll bundle program (bundle leaf commitment). It also needs to be checked to verify the expected ZK verification.',
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/v0.2.0/crates/circuits/bundle-circuit',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'notVerified',
  },
  '0x003ac2e012d8a7fb1495d94839fe36559b52fd6d60a532884c7558de2b88bf72': {
    title: 'Executable of the Scroll bundle program',
    description:
      'Proves the correct execution of a bundle of Scroll L2 blocks, which is the unit of L2 state finalisation from L1’s perspective.',
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/0.5.2/crates/circuits/bundle-circuit',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'successful',
    verificationSteps: `
Steps due to the guide here: [https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174](https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running \`docker ps\`.
2. Checkout the correct branch in [zkvm-prover](https://github.com/scroll-tech/zkvm-prover/tree/master) repo: \`git checkout 0.5.2\` Commit hash should be \`8f29f60cc73495e8586338a67433a812097427c4\`.
3. Build the guest programs from the root repo dir: \`make build-guest\`. It will regenerate \`bundle_exe_commit.rs\`. 
4. Run \`compress_commitment\` function from [https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174](https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174) on the \`COMMIT\` array from the previous step to generate \`digest_2\` value. A sample rust implementation is: 
    \`\`\`
use openvm_stark_sdk::p3_baby_bear::BabyBear;
use openvm_stark_sdk::p3_bn254_fr::Bn254Fr;
use openvm_stark_sdk::openvm_stark_backend::p3_field::FieldAlgebra;
use openvm_stark_sdk::openvm_stark_backend::p3_field::PrimeField32;

fn compress_commitment(commitment: &[u32; 8]) -> Bn254Fr {
    let order = Bn254Fr::from_canonical_u64(BabyBear::ORDER_U32 as u64);

    let mut base = Bn254Fr::ONE;      // from PrimeCharacteristicRing
    let mut compressed = Bn254Fr::ZERO; // from PrimeCharacteristicRing

    for val in commitment {
        compressed += Bn254Fr::from_canonical_u64(*val as u64) * base;
        base *= order;
    }

    compressed
} 
\`\`\`
    `,
  },
  '0x0062333dc88631be7af046cc8d3c24f346de172aa2030a28b445ab500889d297': {
    title: 'Executable of the Scroll bundle program',
    description:
      "Proves the correct execution of a bundle of Scroll L2 blocks, which is the unit of L2 state finalisation from L1's perspective.",
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/v0.7.1/crates/circuits/bundle-circuit',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'successful',
    verificationSteps: `
Steps due to the guide here: [https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174](https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174).

Although the guide below uses docker for reproducable builds, we failed to obtain the correct program hash on a MacOS machine. 
The steps below work only for a Linux OS (e.g. Ubuntu).

1. On a Linux machine, install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running \`docker ps\`.
2. Checkout the correct branch in [zkvm-prover](https://github.com/scroll-tech/zkvm-prover/tree/master) repo: \`git checkout 0.7.1\` Commit hash should be \`85dc6bc56728b8eef22281fdb215c136d7b5bbda\`.
3. Build the guest programs from the root repo dir: \`make build-guest\`. It will regenerate \`circuits/bundle-circuit/bundle_leaf_commit.rs\`. 
4. Run \`compress_commitment\` function from [https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174](https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174) on the \`COMMIT\` array from the previous step to generate \`digest_2\` value. A sample rust implementation is: 
    \`\`\`
use openvm_stark_sdk::p3_baby_bear::BabyBear;
use openvm_stark_sdk::p3_bn254_fr::Bn254Fr;
use openvm_stark_sdk::openvm_stark_backend::p3_field::FieldAlgebra;
use openvm_stark_sdk::openvm_stark_backend::p3_field::PrimeField32;

fn compress_commitment(commitment: &[u32; 8]) -> Bn254Fr {
    let order = Bn254Fr::from_canonical_u64(BabyBear::ORDER_U32 as u64);

    let mut base = Bn254Fr::ONE;      // from PrimeCharacteristicRing
    let mut compressed = Bn254Fr::ZERO; // from PrimeCharacteristicRing

    for val in commitment {
        compressed += Bn254Fr::from_canonical_u64(*val as u64) * base;
        base *= order;
    }

    compressed
} 
\`\`\`
    `,
  },
  '0x009305f0762291e3cdd805ff6d6e81f1d135dbfdeb3ecf30ad82c3855dde7909': {
    title: 'Config of the Scroll bundle program',
    description:
      'This is not a ZK program, but a commitment to the config of Scroll bundle program (bundle leaf commitment). It also needs to be checked to verify the expected ZK verification.',
    programUrl:
      'https://github.com/scroll-tech/zkvm-prover/tree/0.5.2/crates/circuits/bundle-circuit',
    proverSystemProject: ProjectId('openvmprover'),
    verificationStatus: 'successful',
    verificationSteps: `
Steps due to the guide here: [https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174](https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running \`docker ps\`.
2. Checkout the correct branch in [zkvm-prover](https://github.com/scroll-tech/zkvm-prover/tree/master) repo: \`git checkout 0.5.2\` Commit hash should be \`8f29f60cc73495e8586338a67433a812097427c4\`.
3. Build the guest programs from the root repo dir: \`make build-guest\`. It will regenerate \`circuits/bundle-circuit/bundle_leaf_commit.rs\`. 
4. Run \`compress_commitment\` function from [https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174](https://scrollzkp.notion.site/Prover-Architecture-Post-Euclid-1de7792d22af80e3a8ecdd03b5f02174) on the \`COMMIT\` array from the previous step to generate \`digest_2\` value. A sample rust implementation is: 
    \`\`\`
use openvm_stark_sdk::p3_baby_bear::BabyBear;
use openvm_stark_sdk::p3_bn254_fr::Bn254Fr;
use openvm_stark_sdk::openvm_stark_backend::p3_field::FieldAlgebra;
use openvm_stark_sdk::openvm_stark_backend::p3_field::PrimeField32;

fn compress_commitment(commitment: &[u32; 8]) -> Bn254Fr {
    let order = Bn254Fr::from_canonical_u64(BabyBear::ORDER_U32 as u64);

    let mut base = Bn254Fr::ONE;      // from PrimeCharacteristicRing
    let mut compressed = Bn254Fr::ZERO; // from PrimeCharacteristicRing

    for val in commitment {
        compressed += Bn254Fr::from_canonical_u64(*val as u64) * base;
        base *= order;
    }

    compressed
} 
\`\`\`
    `,
  },
  '0x0100085f9382a7928dd83bfc529121827b5f29f18b9aa10d18aa68e1be7ddc35': {
    title: 'Boojum L2 Bootloader program',
    description:
      'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
    programUrl:
      'https://github.com/matter-labs/era-contracts/blob/v0.28.0/system-contracts/bootloader/bootloader.yul',
    proverSystemProject: ProjectId('boojum'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install npm and yarn: \`npm install --global yarn\`
2. Install hardhat: \`npm install -g hardhat\`
3. Install foundry-zksync: \`curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash\`  from [here](https://foundry-book.zksync.io/introduction/installation/).

Verify:

1. Checkout the correct branch in [era-contracts](https://github.com/matter-labs/era-contracts) repo: \`git checkout v0.28.0\`. Commit hash should be \`cfd77cb6bc9ab3d751d42c6161f1b393a9c51647\`.
2. Execute recompute_hashes.sh script: \`chmod +x recompute_hashes.sh\`  and \`./recompute_hashes.sh\`. Note that the script may require a specific version of \`foundryup-zksync\` and it will suggest the command to install it. However you might need to manually clear git working tree in the repo foundry-zksync (probably in ~/.foundry/matter-labs/foundry-zksync) to change versions.
    `,
  },
  '0x0100088580465d88420e6369230ee94a32ff356dbcdd407a4be49fc8009b2a81': {
    title: 'Boojum L2 Bootloader program',
    description:
      'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
    programUrl:
      'https://github.com/matter-labs/era-contracts/blob/release-v26/system-contracts/bootloader/bootloader.yul',
    proverSystemProject: ProjectId('boojum'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install npm and yarn: \`npm install --global yarn\`
2. Install hardhat: \`npm install -g hardhat\`
3. Install foundry-zksync: \`curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash\`  from [here](https://foundry-book.zksync.io/introduction/installation/).

Verify:

1. Checkout the correct branch in [era-contracts](https://github.com/matter-labs/era-contracts) repo: \`git checkout release-v26\`. Commit hash should be \`f7ecdb91f7941a3be01ce08bf6a2e4a5fb02a8d5\`.
2. Execute \`pushd da-contracts && forge clean && popd && pushd l1-contracts && yarn clean && forge clean && popd && pushd l2-contracts && yarn clean && forge clean && popd && pushd system-contracts && yarn clean && forge clean && popd && pushd da-contracts && yarn build:foundry && popd && pushd l1-contracts && yarn build:foundry && popd && pushd l2-contracts && yarn build:foundry && popd && pushd system-contracts && yarn build:foundry && popd && yarn calculate-hashes:fix\`  to recompile all contracts and compare their hashes with the ones recorded in \`AllContractsHashes.json\` (note that script output calls this file \`SystemContractsHashes.json\`).
    `,
  },
  // v29 upgrade, added by basti without knowing what he is doing https://www.tally.xyz/gov/zksync/proposal/40562439712311128665286075271414168289029475306445402072499591795343687723101?govId=eip155:324:0x76705327e682F2d96943280D99464Ab61219e34f
  // Turned out to be exactly correct
  '0x01000911c4db4fe62c98e180cfa7e9b3a22fb15f505905d4bf36192f481551e6': {
    title: 'Boojum L2 Bootloader program',
    description:
      'EraVM program that proves the correct execution of a batch of ZK Stack L2 blocks.',
    programUrl:
      'https://github.com/matter-labs/era-contracts/blob/v0.29.2/system-contracts/bootloader/bootloader.yul',
    proverSystemProject: ProjectId('boojum'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install npm and yarn: \`npm install --global yarn\`
2. Install hardhat: \`npm install -g hardhat\`
3. Install foundry-zksync: \`curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash\`  from [here](https://foundry-book.zksync.io/introduction/installation/).

Verify:

1. Checkout the correct branch in [era-contracts](https://github.com/matter-labs/era-contracts) repo: \`git checkout v0.29.2\`. Commit hash should be \`dbfc9b5a40d68007dc405a9b669230104c1646e4\`.
2. Execute recompute_hashes.sh script: \`chmod +x recompute_hashes.sh\`  and \`./recompute_hashes.sh\`. Note that the script may require a specific version of \`foundryup-zksync\` and it will suggest the command to install it. However you might need to manually clear git working tree in the repo foundry-zksync (probably in ~/.foundry/matter-labs/foundry-zksync) to change versions.
    `,
  },
  '0x0059b74a8fd03c44462de3916b45ebeedb9f1158e3037e8c40b8941cbe438d7e': {
    title: 'Morph Guest Program (zkEVM Executor)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0x001d6dd65980c80ef8496f4a0bd9b2ccc1c9e66aeb122f841e0b90e322bbacdd': {
    title: 'Aggregation program of Ethscriptions ZK Fault Proofs',
    description:
      'Aggregates proofs of correct execution for several consecutive block ranges of the Ethscriptions L2 client.',
    programUrl:
      'https://github.com/0xFacet/ethscriptions-zk-fault-proofs/tree/251c5248cf92b544a3e6b1b4c0b98b0146dab1c6/programs/aggregation',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [ethscriptions-zk-fault-proofs](https://github.com/0xFacet/ethscriptions-zk-fault-proofs) repo:  \`git checkout ethscriptions\` . Commit hash should be  \`251c5248cf92b544a3e6b1b4c0b98b0146dab1c6\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the root dir:  \`cargo run --bin config --release\` to build the SP1 programs and generate and print verification key hashes.
  `,
  },
  '0x5a02c6f96d93f5ff1bfe8f5f2f7f158a3bc6ab7e294d3f7824507a1c67edf594': {
    title: 'Range program of Ethscriptions ZK Fault Proofs',
    description:
      'Proves correct state transition function within the Ethscriptions L2 client over a range of consecutive L2 blocks.',
    programUrl:
      'https://github.com/0xFacet/ethscriptions-zk-fault-proofs/tree/251c5248cf92b544a3e6b1b4c0b98b0146dab1c6/programs/range/ethereum',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
Prepare:

1. Install cargo make: \`cargo install --debug --locked cargo-make\`
2. Install sp1 toolchain: \`curl -L https://sp1up.succinct.xyz/ | bash\`, then \`sp1up\`
3. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/)

Verify:

1. Checkout the correct branch in [ethscriptions-zk-fault-proofs](https://github.com/0xFacet/ethscriptions-zk-fault-proofs) repo:  \`git checkout ethscriptions\` . Commit hash should be  \`251c5248cf92b544a3e6b1b4c0b98b0146dab1c6\`.
2. Make sure docker is running by running  \`docker ps\`
3. From the root dir:  \`cargo run --bin config --release\` to build the SP1 programs and generate and print verification key hashes.
  `,
  },
  '0x00ad538a51c761c06f5075d11f3ee64d5d00c272a741ccf098e1d9f062fee13d': {
    title: 'Morph Guest program (v0.4.9 release)',
    description:
      'Proves the correct execution of the Morph L2 state transition function (based on the Geth EVM) for a batch of blocks using the SP1 zkVM.',
    programUrl:
      'https://github.com/morph-l2/morph/tree/v0.4.9/prover/bin/client',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'notVerified',
  },
  '0xdb698a2576298f25448bc092e52cf13b1e24141c997135d70f217d674bbeb69a': {
    title: 'ArbOS v40 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    verificationStatus: 'successful',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v40/arbos',
    verificationSteps: `
L2BEAT team was able to independently regenerate this program hash. However currently the following steps for hash regeneration produce an error, so the process could not be independently verified.

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/).
2. Checkout the correct branch in [nitro](https://github.com/OffchainLabs/nitro) repo:  \`git checkout consensus-v40\` . Commit hash should be  \`37ae61f20f8efdbc7e2f6af7f21c309bc09086a1\`.
3. Update git submodules \`git submodule update --init --recursive --force\`.
4. Generate wasm module root in docker: \`docker buildx build --target nitro-node-dev -t nitro-node-dev .\`. Currently this step fails with an error.
5. Export the value from the docker: \`docker run --rm --entrypoint cat nitro-node-dev /home/user/target/machines/latest/module-root.txt\`.
      `,
  },
  '0x8a7513bf7bb3e3db04b0d982d0e973bcf57bf8b88aef7c6d03dba3a81a56a499': {
    title: 'ArbOS v51 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    verificationStatus: 'successful',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v51/arbos',
    verificationSteps: `
Even though the program is compiled in docker for reproducibility reasons, it gives the correct results only on linux OS. Steps below were done on Ubuntu 22.04 OS. The steps below consume ~35 GiB disk space.

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/).
2. Checkout the correct branch in [nitro](https://github.com/OffchainLabs/nitro) repo:  \`git checkout consensus-v51\` . Commit hash should be  \`03949e76071f048c850d721c7a378a2e4b3fbd09\`.
3. Update git submodules \`git submodule update --init --recursive --force\`.
4. Generate wasm module root in docker: \`docker buildx build --target nitro-node-dev -t nitro-node-dev .\`.
5. Export the value from the docker: \`docker run --rm --entrypoint cat nitro-node-dev /home/user/target/machines/latest/module-root.txt\`.
    `,
  },
  '0x184884e1eb9fefdc158f6c8ac912bb183bf3cf83f0090317e0bc4ac5860baa39': {
    title: 'ArbOS v32 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v32/arbos',
    verificationStatus: 'notVerified',
  },
  '0x8b104a2e80ac6165dc58b9048de12f301d70b02a0ab51396c22b4b4b802a16a4': {
    title: 'ArbOS v20 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v20/arbos',
    verificationStatus: 'notVerified',
  },
  '0x58a9512cf4096461f866446387e845c6573856ef603bba4e24cb1d89630a675c': {
    title: 'ArbOS Kinto wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    verificationStatus: 'notVerified',
  },
  '0x260f5fa5c3176a856893642e149cf128b5a8de9f828afec8d11184415dd8dc69': {
    title: 'ArbOS v31 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v31/arbos',
    verificationStatus: 'notVerified',
  },
  '0x5b82aa008989d331bf6f3cf75b85a04c9ee809447c19b85fecaf3b7d749a6576': {
    title: 'ArbOS Apechain wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    verificationStatus: 'notVerified',
  },
  '0xa18d6266cef250802c3cb2bfefe947ea1aa9a32dd30a8d1dfc4568a8714d3a7a': {
    title: 'ArbOS v41 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games.',
    programUrl:
      'https://github.com/OffchainLabs/nitro/tree/consensus-v41/arbos',
    verificationStatus: 'successful',
    verificationSteps: `
Even though the program is compiled in docker for reproducibility reasons, it gives the correct results only on linux OS. Steps below were done on Ubuntu 22.04 OS. The steps below consume ~35 GiB disk space.

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/).
2. Checkout the correct branch in [nitro](https://github.com/OffchainLabs/nitro) repo:  \`git checkout consensus-v41\` . Commit hash should be  \`2a9b15285b422e83f7a1faad0722990baa779971\`.
3. Update git submodules \`git submodule update --init --recursive --force\`.
4. Generate wasm module root in docker: \`docker buildx build --target nitro-node-dev -t nitro-node-dev .\`.
5. Export the value from the docker: \`docker run --rm --entrypoint cat nitro-node-dev /home/user/target/machines/latest/module-root.txt\`.
    `,
  },
  '0xe81f986823a85105c5fd91bb53b4493d38c0c26652d23f76a7405ac889908287': {
    title: 'Celestia Nitro 3.2.1 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games, which uses Celestia DA.',
    verificationStatus: 'notVerified',
  },
  '0xaf1dbdfceb871c00bfbb1675983133df04f0ed04e89647812513c091e3a982b3': {
    title: 'Celestia Nitro 3.2.2 wasmModuleRoot',
    description:
      'A commitment to the exact WASM binary version used for Orbit stack optimistic dispute games, which uses Celestia DA.',
    verificationStatus: 'notVerified',
  },
  '0x0323914d3050e80c3d09da528be54794fde60cd26849cd3410dde0da7cd7d4fa': {
    title: 'OP Kona absolute prestate v1.2.7 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program of Kona client.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/d181d5b197665df9b5efd66e4f76f09adf5c697f/kona',
    verificationStatus: 'successful',
    verificationSteps: `
1. Install [just](https://just.systems).
2. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running.
3. Check out the correct branch of [optimism](https://github.com/ethereum-optimism/optimism) repo: \`git checkout d181d5b197665df9b5efd66e4f76f09adf5c697f\`.
4. Got to kona dir \`cd kona\` and run \`just build-cannon-prestate\`. This script will regenerate kona absolute prestate and create \`kona/prestates/<hash>.bin.gz\` file, where \`<hash>\` is the resulting absolute prestate.
    `,
  },
  '0x033c000916b4a88cfffeceddd6cf0f4be3897a89195941e5a7c3f8209b4dbb6e': {
    title: 'OP absolute prestate v1.9.0 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.9.0/op-program',
    verificationStatus: 'successful',
    verificationSteps: `
Steps are based on [this guide](https://docs.optimism.io/chain-operators/tutorials/absolute-prestate).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running.
2. Check out the correct branch of [optimism](https://github.com/ethereum-optimism/optimism) repo: \`git checkout op-program/v1.9.0-rc.1\` . Commit hash should be  \`a0c621361db5b5a6dcb60fd8943d485672a076b0\`.
3. Regenerate the absolute prestate: \`make reproducible-prestate\`. This script will print out the correct hash.
    `,
  },
  '0x03682932cec7ce0a3874b19675a6bbc923054a7b321efc7d3835187b172494b6': {
    title: 'OP absolute prestate v1.6.0 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.6.0/op-program',
    verificationStatus: 'successful',
    verificationSteps: `
Steps are based on [this guide](https://docs.optimism.io/chain-operators/tutorials/absolute-prestate).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running.
2. Check out the correct branch of [optimism](https://github.com/ethereum-optimism/optimism) repo: \`git checkout op-program/v1.6.0\` . Commit hash should be  \`d6fb90dd489e39efa206b55200766ccc075c1d9b\`.
3. Regenerate the absolute prestate: \`make reproducible-prestate\`. This script will print out the correct hash.
    `,
  },
  '0x03caa1871bb9fe7f9b11217c245c16e4ded33367df5b3ccb2c6d0a847a217d1b': {
    title: 'OP absolute prestate v1.8.0-rc.4 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.8.0-rc.4/op-program',
    verificationStatus: 'successful',
    verificationSteps: `
Steps are based on [this guide](https://docs.optimism.io/chain-operators/tutorials/absolute-prestate).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running.
2. Check out the correct branch of [optimism](https://github.com/ethereum-optimism/optimism) repo: \`git checkout op-program/v1.8.0-rc.4\` . Commit hash should be  \`94706ec5072b13030600d1b45ae10b673b660c0d\`.
3. Regenerate the absolute prestate: \`make reproducible-prestate\`. This script will print out the correct hash.
    `,
  },
  '0x03ddcb9294fef6dd477b4e911fd777fda0832fdd10aa594ac941540ea62a2aa0': {
    title: 'OP absolute prestate Boba',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    verificationStatus: 'notVerified',
  },
  '0x03c7ae758795765c6664a5d39bf63841c71ff191e9189522bad8ebff5d4eca98': {
    title: 'OP absolute prestate Cyber',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    verificationStatus: 'notVerified',
  },
  '0x038512e02c4c3f7bdaec27d00edf55b7155e0905301e1a88083e4e0a6764d54c': {
    title: 'OP absolute prestate v1.3.1',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-node/v1.3.1/op-program',
    verificationStatus: 'successful',
    verificationSteps: `
Steps are based on [this guide](https://docs.optimism.io/chain-operators/tutorials/absolute-prestate).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running.
2. Check out the correct branch of [optimism](https://github.com/ethereum-optimism/optimism) repo: \`git checkout op-program/v1.3.1\` . Commit hash should be  \`e3c2f046c2d7103c765cbd47e949a284e511a47d\`.
3. Regenerate the absolute prestate: \`make reproducible-prestate\`. This script will print out the correct hash.
    `,
  },
  '0x03cb5216c8cf2902c66127db119ba03a1296205736addc39cfeafc7c14d0bd14': {
    title: 'OP absolute prestate Lisk',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    verificationStatus: 'notVerified',
  },
  '0x03eb07101fbdeaf3f04d9fb76526362c1eea2824e4c6e970bdb19675b72e4fc8': {
    title: 'OP absolute prestate v1.6.1 (cannon64)',
    description:
      'A commitment to the initial state of the OP stack fault proof program.',
    programUrl:
      'https://github.com/ethereum-optimism/optimism/tree/op-program/v1.6.1/op-program',
    verificationStatus: 'successful',
    verificationSteps: `
Steps are based on [this guide](https://docs.optimism.io/chain-operators/tutorials/absolute-prestate).

1. Install docker [https://docs.docker.com/get-started/get-docker/](https://docs.docker.com/get-started/get-docker/) and make sure it is running.
2. Check out the correct branch of [optimism](https://github.com/ethereum-optimism/optimism) repo: \`git checkout op-program/v1.6.1\` . Commit hash should be  \`a094d016092e3355642d00be6d7943c4529ef008\`.
3. Regenerate the absolute prestate: \`make reproducible-prestate\`. This script will print out the correct hash.
    `,
  },
  '0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609': {
    title: 'Cartesi Honeypot v2 template hash',
    description:
      'The hash of the initial Cartesi machine state that is used in Dave dispute games of Cartesi Honeypot v2.',
    programUrl:
      'https://github.com/cartesi/honeypot/blob/699c2b12745f1f7da708cb497106e657e3a67e49/honeypot.cpp',
    verificationStatus: 'successful',
    verificationSteps: `
The verification process is based on [this guide](https://github.com/cartesi/honeypot/blob/699c2b12745f1f7da708cb497106e657e3a67e49/README.md#building-and-running).

1. Install all required dependencies: Docker, GNU Make, Lua 5.4, [cartesi/machine-emulator](https://github.com/cartesi/machine-emulator) 0.19.x and [cartesi/xgenext2fs](https://github.com/cartesi/genext2fs). 
In our experience, cartesi-machine could not be installed from cartesi APT package repository because the \`dist.cartesi.io\` URL was not accessible, the homebrew installation worked successfully on an ubuntu machine.
2. Check out the correct commit version of the [honeypot repo](https://github.com/cartesi/honeypot): \`git checkout 699c2b12745f1f7da708cb497106e657e3a67e49\`.
3. On x86 architecture, configure docker to work with riscv64 architecture via emulation: \`docker run --privileged --rm tonistiigi/binfmt --install riscv64\`.
4. Build the application by running: \`make HONEYPOT_CONFIG=mainnet\`. This build script will output the correct program hash on successful execution.
    `,
  },
  '0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14': {
    title: 'Cartesi Honeypot v1 template hash',
    description:
      'The hash of the initial Cartesi machine state that is used in Dave dispute games of Cartesi Honeypot v1.',
    verificationStatus: 'notVerified',
  },
}
