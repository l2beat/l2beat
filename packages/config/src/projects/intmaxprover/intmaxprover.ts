import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const intmaxprover: BaseProject = {
  id: ProjectId('intmaxprover'),
  slug: 'intmaxprover',
  name: 'INTMAX',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-08-04')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A zk proving system designed by INTMAX for client-side proving of private token transfers on INTMAX L2.',
    links: {
      websites: ['https://intmax.io'],
      documentation: [
        'https://intmax-wallet.gitbook.io/intmax-developers-hub/nodes/provers',
        'https://eprint.iacr.org/2023/1082.pdf',
      ],
      repositories: ['https://github.com/InternetMaximalism/intmax2-zkp'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'INTMAX',
    techStack: {
      snark: [
        ZK_CATALOG_TAGS.Plonk.Plonky2,
        ZK_CATALOG_TAGS.Field.Goldilocks,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
      finalWrap: [ZK_CATALOG_TAGS.Plonk.Gnark, ZK_CATALOG_TAGS.curve.BN254],
    },
    proofSystemInfo: `
    
    ## Description

    INTMAX prover is a zk proving system for privacy-preserving INTMAX L2 based on [Plonky2](https://github.com/0xPolygonZero/plonky2/tree/main) circuits, optimized for client side proving and using not only succinctness, but also zero knowledge properties of Plonky2. INTMAX circuits are proven with a STARK which is wrapped into a Plonk SNARK before settling onchain.

    ## Proof system

    Plonky2 implements a circuit aritmetization based on TurboPlonk over Goldilocks field, but it replaces KZG polynomial commitment scheme with a FRI-based polynomial testing scheme. In this way proving Plonky2 circuits requires no trusted setup, i.e. it is a STARK. However the circuit design is different from zkVM STARKs, so INTMAX custom logic is implemented as custom circuits rather than a zkVM program.

    ### Circuits

    INTMAX prover works with [several different circuits](https://github.com/InternetMaximalism/intmax2-zkp/blob/main/README.md) that could be proven by different entities in the network (e.g. [users, validity provers, aggregators](https://docs.network.intmax.io/developers-hub/intmax-nodes/provers)). This design support local proving and enables private transactions on the L2.

    Available circuits are: [validity](https://github.com/InternetMaximalism/intmax2-zkp/tree/main/src/circuits/validity) for proving public state transition, [balance](https://github.com/InternetMaximalism/intmax2-zkp/tree/main/src/circuits/balance) for proving correct updates of individual user accounts based on private information, [withdrawal](https://github.com/InternetMaximalism/intmax2-zkp/tree/main/src/circuits/withdrawal) for proving the validity of withdrawing funds from L2 to the host chain, [claim](https://github.com/InternetMaximalism/intmax2-zkp/tree/main/src/circuits/claim) for proving user eligibility for privacy mining program and [proof of innocence](https://github.com/InternetMaximalism/intmax2-zkp/tree/main/src/circuits/proof_of_innocence) for proving certain claims about deposits and withdrawals.

    ### Recursion and final wrap

    INTMAX circuits are based on recursive architecture, where generating a new STARK requires validating a previous STARK proof (e.g. processing a new balance update requires validating all previous balance updates). Several entities are responsible for providing these recursive proofs: users or [balance provers](https://docs.network.intmax.io/developers-hub/intmax-nodes/provers#balance-prover) for balance updates, [validity provers](https://docs.network.intmax.io/developers-hub/intmax-nodes/validity-prover) for validity circuit, [claim](https://docs.network.intmax.io/developers-hub/intmax-nodes/claim-aggregator) and [withdrawal](https://docs.network.intmax.io/developers-hub/intmax-nodes/withdrawal-aggregator) aggregators for processing claim and withdrawal proofs.

    Only claim and withdrawal proofs are posted onchain to be verified, all other proofs are verified only by the nodes in INTMAX network. Onchain proofs are wrapped in a [gnark](https://github.com/Consensys/gnark) implementation of Plonk over BN254 curve, which requires a trusted setup (see [below](#trusted-setups) for more details).
    `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    verifierHashes: [
      {
        hash: '0x664dceea25b57766a5b550cf25cca24a7305f36fd60a5835f9e0505bec14ce8e',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: '0x1d38545a33740Ab3480d9035bB3126914404423d',
            chain: 'scroll',
          },
        ],
        verificationStatus: 'notVerified',
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
