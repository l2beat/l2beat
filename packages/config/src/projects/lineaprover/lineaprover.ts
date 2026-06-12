import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const lineaprover: BaseProject = {
  id: ProjectId('lineaprover'),
  slug: 'lineaprover',
  name: 'Linea',
  shortName: undefined,
  aliases: ['ConsenSys'],
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
      'Linea proving system is designed for proving EVM code execution and mainly used for proving Linea L2 state transitions.',
    links: {
      websites: ['https://linea.build/blog/the-linea-prover-explained'],
      documentation: [
        'https://eprint.iacr.org/2022/1633.pdf',
        'https://docs.linea.build/technology/prover',
      ],
      repositories: [
        'https://github.com/Consensys/linea-monorepo/tree/main/prover',
        'https://github.com/Consensys/gnark?tab=readme-ov-file',
      ],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Consensys',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Plonk.linea,
        ZK_CATALOG_TAGS.ISA.EVM,
        ZK_CATALOG_TAGS.curve['BLS12-377'],
        ZK_CATALOG_TAGS.curve['BW6-761'],
        ZK_CATALOG_TAGS.Field.KoalaBear,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Gnark,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: readProjectMarkdown('lineaprover', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.Aleo,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        ...TRUSTED_SETUPS.CeloPlumo,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('linea'),
        sinceTimestamp: UnixTime(1689112800),
      },
    ],
    verifierHashes: [
      {
        hash: '0x29483dd4b0cd0a98968ab25795ae2363ed422fe575a20f55ac331519c3e846e1',
        name: 'Linea Plonk Type 0',
        sourceLink:
          'https://github.com/Consensys/linea-monorepo/tree/b90a3c0b6735ba39dc19356628c09c03e42c016d/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x218C3339ff3fea595c02Ac31Ca8A782f5028C4dc',
            ),
          },
        ],
        verificationStatus: 'successful',
        verificationSteps: `
The regeneration process requires approximately 1 TiB of memory and approximately 400 GiB of disk space for trusted setup files and generated artifacts. It takes around 2 hours, excluding fetching 132 GiB of trusted setup assets.
We have verified the steps below on an Ubuntu machine.

1. Install build prerequesits: \`build-essential\` and the latest version of go.
2. Optionally, set up additional swap RAM. We used:
\`\`\`
sudo apt install zram-tools
vim /etc/default/zramswap   # set algo to zstd, % to 20 and priority to 100
sudo systemctl stop zramswap
sudo systemctl start zramswap
\`\`\`
3. Check out the correct version of [linea-monorepo](https://github.com/Consensys/linea-monorepo):
\`\`\`
git clone https://github.com/Consensys/linea-monorepo.git
cd linea-monorepo
git checkout b90a3c0b6735ba39dc19356628c09c03e42c016d
\`\`\`
4. Download trusted setup files (132 GiB) from the L2BEAT hosting server into the \`prover/prover-assets/kzgsrs\` dir:
\`\`\`
cd prover/prover-assets/kzgsrs
wget -r -np -nH --cut-dirs=1 -R "index.html*" https://trusted-setup-hosting.l2beat.com/files/
\`\`\`
5. Build the circuits and the verifier contract, this step takes several hours:
\`\`\`
# from the linea-monorepo/provers dir
make setup
\`\`\`
The build artifacts will be places into \`prover/prover-assets/6.2.1/\` dir, the generated verifier smart contract could be found in \`prover/prover-assets/6.2.1/emulation/Verifier.sol\`.
        `,
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
      {
        hash: '0xd92b8281296cbfe1963093c23f9fb7fef6f9debfa9115622ca412c32b848aa52',
        name: 'Linea Plonk Type 1',
        sourceLink:
          'https://github.com/Consensys/linea-monorepo/tree/988bbce27b61a5e5a29913468d06d0a124dea8e4/prover',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x0D0f070386edC441A63fB8FAe8FB937Bbd88c5Cb',
            ),
          },
        ],
        verificationStatus: 'successful',
        verificationSteps: `
The regeneration process requires approximately 1 TiB of memory and approximately 400 GiB of disk space for trusted setup files and generated artifacts. It takes around 2 hours, excluding fetching 132 GiB of trusted setup assets.
We have verified the steps below on an Ubuntu machine.

1. Install build prerequesits: \`build-essential\` and the latest version of go.
2. Optionally, set up additional swap RAM. We used:
\`\`\`
sudo apt install zram-tools
vim /etc/default/zramswap   # set algo to zstd, % to 20 and priority to 100
sudo systemctl stop zramswap
sudo systemctl start zramswap
\`\`\`
3. Check out the correct version of [linea-monorepo](https://github.com/Consensys/linea-monorepo):
\`\`\`
git clone https://github.com/Consensys/linea-monorepo.git
cd linea-monorepo
git checkout 988bbce27b61a5e5a29913468d06d0a124dea8e4
\`\`\`
4. Download trusted setup files (132 GiB) from the L2BEAT hosting server into the \`prover/prover-assets/kzgsrs\` dir:
\`\`\`
cd prover/prover-assets/kzgsrs
wget -r -np -nH --cut-dirs=1 -R "index.html*" https://trusted-setup-hosting.l2beat.com/files/
\`\`\`
5. Build the circuits and the verifier contract, this step takes several hours:
\`\`\`
# from the linea-monorepo/provers dir
make setup
\`\`\`
The build artifacts will be places into \`prover/prover-assets/7.0.1/\` dir, the generated verifier smart contract could be found in \`prover/prover-assets/7.0.1/emulation/Verifier.sol\`.
        `,
        description:
          'Custom verifier ID: SHA256 hash of all VK_... values from the smart contract, abi packed in the same order they are defined.',
      },
    ],
  },
}
