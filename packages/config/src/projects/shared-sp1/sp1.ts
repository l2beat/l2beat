import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import type { BaseProject } from '../../types'

export const sp1: BaseProject = {
  id: ProjectId('sp1'),
  slug: 'sp1',
  name: 'SP1',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-08')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'SP1 is a zk proving system for RISC-V programs built by Succinct.',
    links: {
      websites: ['https://www.succinct.xyz'],
      documentation: ['https://docs.succinct.xyz/docs/sp1/introduction'],
      repositories: ['https://github.com/succinctlabs/sp1'],
      socialMedia: ['https://x.com/SuccinctLabs'],
    },
    badges: [],
  },
  proofSystem: {
    creator: 'Succinct',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Plonky3,
        ZK_CATALOG_TAGS.ISA.RISCV,
        ZK_CATALOG_TAGS.Field.BabyBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.Groth16.Gnark,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
        
        ## Description

        SP1 is a RISC-V ZKVM using the Plonky3 stack. ZKVM execution is proven recursively and is wrapped into a SNARK for final verification. 
        It provides tools to generate onchain Groth16 or Plonk verifiers.

        ## Proof system

        SP1 proves execution of a RISC-V VM using several ZK circuits connected by lookup arguments, as implemented in Plonky3. 
        VM execution trace is split into several chunks that could be proven in parallel with a STARK proving system. 
        The parallelized proofs are recursively checked by the next layer of STARK circuits. The correctness of the final STARK proof 
        is verified with the final wrap SNARK program, the wrap SNARK proof is verified onchain.

        ### Top-level proof system

        Verifies execution of a RISC-V program in a ZKVM. Uses [Plonky3](https://github.com/Plonky3/Plonky3) STARK toolkit with 
        AIR arithmetization and FRI-based polynomial commitment scheme. ([link](https://github.com/succinctlabs/sp1/tree/dev?tab=readme-ov-file#acknowledgements))

        ### Recursion circuits

        Verifies execution of a RISC-V program in a ZKVM. Uses the same toolkit as top-level proof system, but proves the correct 
        verification of all proofs generated on the previous step. ([link](https://docs.succinct.xyz/docs/sp1/writing-programs/proof-aggregation))

        ### Final wrap

        SP1 supports Plonk (with KZG polynomial commitments) or Groth16 final SNARK wrap of the STARK proof for performant onchain proof 
        verification ([link](https://docs.succinct.xyz/docs/sp1/generating-proofs/proof-types#compressed)). The [gnark](https://github.com/Consensys/gnark) 
        implementation of these proof systems is used.

        ## Trusted setup

        SP1 allows to generate final verifiers either using the Groth16 or the Plonk proof system for the final wrap, with different setup trust assumptions.

        ### Groth16

        See Groth16 circuit-specific trusted setup [here](https://docs.succinct.xyz/docs/sp1/security/security-model)).

        ### Plonk

        Plonk proving system used by Succinct utilizes Aztec Ignition universal Plonk setup files. 
        The setup data is downloaded from URL [https://aztec-ignition.s3.amazonaws.com/](https://aztec-ignition.s3.amazonaws.com/) in the 
        [DownloadAndSaveAztecIgnitionSrs](https://github.com/succinctlabs/sp1/blob/ad212dd52bdf8f630ea47f2b58aa94d5b6e79904/crates/recursion/gnark-ffi/go/sp1/trusted_setup/trusted_setup.go#L69) function.
        `,
    trustedSetup: {
      risk: 'green',
      shortDescription: 'Aztec Ignition universal setup for KZG commitments',
      longDescription: `
            
            ## Aztec Ignition 

            Aztec Ignition is a trusted setup ceremony that was run by Aztec for KZG commitment over BN254 curve in 2019. 
            It included 176 participants and was open for participation.
            
            - Github repo to download and verify the ceremony artifacts: https://github.com/AztecProtocol/ignition-verification.
            - Github repo with instructions for ceremony participants: https://github.com/AztecProtocol/Setup.
            - Ceremony announcement with a call to participate: https://aztec.network/blog/announcing-ignition.
            `,
    },
    verifierHashes: [
      {
        hash: '0xd4e8ecd2357dd882209800acd6abb443d231cf287d77ba62b732ce937c8b56e7',
        explorerLink:
          'https://etherscan.io/address/0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459',
        verificationStatus: 'notVerified',
        usedBy: [
          ProjectId('vector'),
          ProjectId('blobstream'),
          ProjectId('astarzkevm'),
          ProjectId('gpt'),
          ProjectId('katana'),
          ProjectId('kroma'),
          ProjectId('lumia'),
          ProjectId('polygonzkevm'),
          ProjectId('silicon'),
          ProjectId('ternoa'),
          ProjectId('wirex'),
          ProjectId('witness'),
          ProjectId('xlayer'),
          ProjectId('taiko'),
        ],
      },
      {
        hash: '0x1b34fe11a637737f0c75c88241669dcf9ca3c03713659265b8241f398a2d286d',
        explorerLink:
          'https://etherscan.io/address/0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63',
        verificationStatus: 'successful',
        usedBy: [],
        verificationSteps: `
                - Check out [sp1 repo](https://github.com/succinctlabs/sp1) at commit \`76c28bf986ba102127788ce081c21fa09cf93b18\`.
                - Set an environment variable by calling \`export SP1_ALLOW_DEPRECATED_HOOKS=true\`. It is needed for the correct execution of circuit building.
                - Make sure that you have [go lang installed](https://go.dev/doc/install).
                - From \`crates/prover\` call \`make build-circuits\`. Note that the execution could take a while.
                `,
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
      },
    ],
  },
}
