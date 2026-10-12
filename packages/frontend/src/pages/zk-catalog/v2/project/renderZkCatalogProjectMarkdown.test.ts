import type { ZkCatalogTag } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { renderZkCatalogProjectMarkdown } from './renderZkCatalogProjectMarkdown'

// Method: render one hand-built ZK catalog entry (the same shape the HTML page
// receives) and read the markdown the way an agent would: split it into H2
// sections and check each one for the values it must carry, including the
// text the HTML page hides in tooltips, collapsed rows and dialogs. Expected
// values are literals from the fixture.
describe(renderZkCatalogProjectMarkdown.name, () => {
  it('opens with the project name and a link to the HTML page', () => {
    const markdown = renderZkCatalogProjectMarkdown(ENTRY)

    expect(markdown).toMatchRegex(
      /^# SP1 Turbo\n\nMarkdown version of https:\/\/l2beat\.com\/zk-catalog\/sp1turbo\n\n/,
    )
  })

  it('summarizes creator, TVS, tech stack and description', () => {
    const summary = getSection(renderZkCatalogProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Creator: Succinct',
      '- Total Value Secured: $1.50 B (+2.50% compared to seven days ago)',
      '- zkVM: Plonky3 (STARK), RISC-V (ISA)',
      '- Final wrap: Gnark (Groth16)',
      '### About\n\nSP1 Turbo is a zkVM for RISC-V programs.',
    )
  })

  it('summarizes each proof system with its setup risk, users and verifiers', () => {
    const summary = getSection(renderZkCatalogProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      [
        '- Trusted setups for Gnark (Groth16):',
        '  - SP1 Groth16 setup, risk red (highest risk) per the [Trusted Setups Risk Framework](https://forum.l2beat.com/t/the-trusted-setups-framework-for-zk-catalog/381): Run among 7 contributors.',
        '  - Used in: [Katana](https://l2beat.com/layer2s/projects/katana)',
        '  - Verifiers: 2 successful (verified by [L2BEAT](https://l2beat.com)), 1 not verified',
      ].join('\n'),
    )
  })

  it('tells apart proof systems of the same type by their name', () => {
    const groth16 = ENTRY.header.trustedSetupsByProofSystem['Groth16-Gnark']!
    const otherGroth16 = tag('Groth16', 'SP1 v6.1.0')
    const summary = getSection(
      renderZkCatalogProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          trustedSetupsByProofSystem: {
            'Groth16-Gnark': groth16,
            'Groth16-SP1 v6.1.0': {
              ...groth16,
              trustedSetups: groth16.trustedSetups.map((setup) => ({
                ...setup,
                proofSystem: otherGroth16,
              })),
            },
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Trusted setups for Gnark (Groth16):',
      '- Trusted setups for SP1 v6.1.0 (Groth16):',
    )
  })

  it('does not say an unverified verifier was verified by its attester', () => {
    const summary = getSection(
      renderZkCatalogProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          trustedSetupsByProofSystem: {
            'Groth16-Gnark': {
              ...ENTRY.header.trustedSetupsByProofSystem['Groth16-Gnark']!,
              verifiers: {
                notVerified: { count: 1, attesters: [L2BEAT_ATTESTER] },
                unsuccessful: { count: 1, attesters: [L2BEAT_ATTESTER] },
              },
            },
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '  - Verifiers: 1 not verified (status reported by [L2BEAT](https://l2beat.com)), 1 unsuccessful (checked by [L2BEAT](https://l2beat.com))',
    )
  })

  it('leaves out TVS when the page shows no data for it', () => {
    const summary = getSection(
      renderZkCatalogProjectMarkdown({
        ...ENTRY,
        header: { ...ENTRY.header, tvs: { ...ENTRY.header.tvs, value: 0 } },
      }),
      'Summary',
    )

    expect(summary.includes('Total Value Secured')).toEqual(false)
  })

  it('surfaces project warnings before the facts', () => {
    const summary = getSection(
      renderZkCatalogProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          redWarning: { text: 'The verifier is unverified.' },
        },
      }),
      'Summary',
    )

    expect(
      summary.indexOf('**Warning:** The verifier is unverified.'),
    ).toBeLessThan(summary.indexOf('- Creator:'))
  })

  it('leads the warnings with the archived and under review banners', () => {
    const summary = getSection(
      renderZkCatalogProjectMarkdown({
        ...ENTRY,
        archivedAt: UnixTime(1700000000),
        underReviewStatus: 'config',
        header: {
          ...ENTRY.header,
          redWarning: { text: 'The verifier is unverified.' },
        },
      }),
      'Summary',
    )

    expect(summary).toMatchRegex(
      /^\n\*\*Warning:\*\* [^\n]*archived[^\n]*\n\n\*\*Warning:\*\* [^\n]*under review[^\n]*\n\n\*\*Warning:\*\* The verifier is unverified\./,
    )
  })

  it('follows the HTML page outline with one H2 per section', () => {
    const headings = renderZkCatalogProjectMarkdown(ENTRY)
      .split('\n')
      .filter((line) => line.startsWith('## '))

    expect(headings).toEqual([
      '## Summary',
      '## Value Secured',
      '## Proof System',
      '## Trusted Setups',
      '## Verifier IDs',
      '## Program Hashes',
    ])
  })

  it('points the TVS chart to the HTML page', () => {
    expect(
      getSection(renderZkCatalogProjectMarkdown(ENTRY), 'Value Secured'),
    ).toInclude('https://l2beat.com/zk-catalog/sp1turbo#tvs')
  })

  it('describes each trusted setup with its risk and proof systems', () => {
    const trustedSetups = getSection(
      renderZkCatalogProjectMarkdown(ENTRY),
      'Trusted Setups',
    )

    expect(trustedSetups).toInclude(
      '### SP1 Groth16 setup\n\n- Risk: red (highest risk)\n- Proof systems: Gnark (Groth16)\n\nRun among 7 contributors.\n\n#### Artifacts\n\nDownload the transcript.',
    )
  })

  it('explains the risk levels before the setups, citing the framework', () => {
    const trustedSetups = getSection(
      renderZkCatalogProjectMarkdown(ENTRY),
      'Trusted Setups',
    )

    expect(trustedSetups).toMatchRegex(
      /^\nRisk levels follow the \[Trusted Setups Risk Framework\]\(https:\/\/forum\.l2beat\.com\/[^)]+\)\. Yellow \(medium risk\): [^\n]*at least 30 contributions[^\n]*Green \(lowest risk\): [^\n]*150 contributions[^\n]*\n\n### SP1 Groth16 setup/,
    )
  })

  it('groups verifiers by proof system with IDs, deployments and verification steps', () => {
    const verifiers = getSection(
      renderZkCatalogProjectMarkdown(ENTRY),
      'Verifier IDs',
    )

    expect(verifiers).toInclude(
      '### Groth16: Gnark\n\nConsensys implementation of Groth16.',
      '#### SP1 Groth16 v5\n\nWraps the STARK proof.\n\n- Verifier ID: `0xa4594c59`\n- Source: https://github.com/succinctlabs/sp1\n- Verification: successful (verified by [L2BEAT](https://l2beat.com))\n- Used in: [Katana](https://l2beat.com/layer2s/projects/katana)',
      '**Known deployments**\n\n- [0x1111111111111111111111111111111111111111](https://etherscan.io/address/0x1111111111111111111111111111111111111111#code) on Ethereum, used in: [Katana](https://l2beat.com/layer2s/projects/katana)\n- 0x2222222222222222222222222222222222222222 on Arbitrum One, used in: none',
      '##### Verification steps\n\nRun `make build-circuits`.',
    )
  })

  it('lists program hashes with repository, verification and users', () => {
    const programHashes = getSection(
      renderZkCatalogProjectMarkdown(ENTRY),
      'Program Hashes',
    )

    expect(programHashes).toInclude(
      '### Range program of OP Succinct\n\nProves an L2 block range.\n\n- Hash: `0x00aa`\n- Repository: https://github.com/succinctlabs/op-succinct\n- Verification: not verified\n- Used in: [Katana](https://l2beat.com/layer2s/projects/katana)\n\n#### Verification steps\n\nRebuild the ELF.',
      '### Unknown program\n\n- Hash: `0x00bb`\n- Repository: code unknown\n- Verification: unsuccessful\n- Used in: none',
    )
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

// A ZK catalog entry shaped like the one the HTML page renders, with one
// section of every kind the page shows.

function tag(type: ZkCatalogTag['type'], name: string): ZkCatalogTag {
  return { id: name, type, name, description: `${name} description.` }
}

const GROTH16 = {
  ...tag('Groth16', 'Gnark'),
  description: 'Consensys implementation of Groth16.',
}

const KATANA: UsedInProjectWithIcon = {
  id: ProjectId('katana'),
  name: 'Katana',
  slug: 'katana',
  icon: '/icons/katana.png',
  url: '/layer2s/projects/katana',
}

const L2BEAT_ATTESTER = {
  id: 'l2beat',
  name: 'L2BEAT',
  link: 'https://l2beat.com',
  icon: '/icons/l2beat.png',
}

const SECTIONS: ProjectDetailsSection[] = [
  {
    type: 'ZkCatalogTvsSection',
    props: {
      id: 'tvs',
      title: 'Value Secured',
      project: {
        id: ProjectId('sp1turbo'),
        name: 'SP1 Turbo',
        shortName: undefined,
        iconUrl: '/icons/sp1turbo.png',
      },
      milestones: [],
      tvsInfo: undefined,
      defaultRange: [null, 0],
      projectsForTvs: [],
    },
  },
  {
    type: 'MarkdownSection',
    props: {
      id: 'proof-system',
      title: 'Proof System',
      content: 'SP1 proves RISC-V execution with Plonky3.',
    },
  },
  {
    type: 'TrustedSetupSection',
    props: {
      id: 'trusted-setups',
      title: 'Trusted Setups',
      trustedSetups: [
        {
          name: 'SP1 Groth16 setup',
          risk: 'red',
          description:
            'Run among 7 contributors.\n\n## Artifacts\n\nDownload the transcript.',
          proofSystems: [GROTH16],
        },
      ],
    },
  },
  {
    type: 'VerifiersSection',
    props: {
      id: 'verifiers',
      title: 'Verifier IDs',
      variant: 'zkCatalog',
      proofSystemVerifiers: [
        {
          proofSystem: GROTH16,
          verifierHashes: [
            {
              name: 'SP1 Groth16 v5',
              description: 'Wraps the STARK proof.',
              hash: '0xa4594c59',
              sourceLink: 'https://github.com/succinctlabs/sp1',
              verificationStatus: 'successful',
              verificationSteps: 'Run `make build-circuits`.',
              attesters: [L2BEAT_ATTESTER],
              projectsUsedIn: [KATANA],
              knownDeployments: [
                {
                  address: '0x1111111111111111111111111111111111111111',
                  url: 'https://etherscan.io/address/0x1111111111111111111111111111111111111111#code',
                  chain: 'Ethereum',
                  projectsUsedIn: [KATANA],
                },
                {
                  address: '0x2222222222222222222222222222222222222222',
                  chain: 'Arbitrum One',
                  projectsUsedIn: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    type: 'ProgramHashesSection',
    props: {
      id: 'program-hashes',
      title: 'Program Hashes',
      programHashes: [
        {
          title: 'Range program of OP Succinct',
          description: 'Proves an L2 block range.',
          hash: '0x00aa',
          programUrl: 'https://github.com/succinctlabs/op-succinct',
          verificationStatus: 'notVerified',
          verificationSteps: 'Rebuild the ELF.',
          usedIn: [KATANA],
        },
        {
          title: 'Unknown program',
          hash: '0x00bb',
          verificationStatus: 'unsuccessful',
          usedIn: [],
        },
      ],
    },
  },
]

const ENTRY: ProjectZkCatalogEntry = {
  name: 'SP1 Turbo',
  shortName: undefined,
  creator: 'Succinct',
  slug: 'sp1turbo',
  icon: '/icons/sp1turbo.png',
  archivedAt: undefined,
  underReviewStatus: undefined,
  header: {
    description: 'SP1 Turbo is a zkVM for RISC-V programs.',
    links: [],
    techStack: {
      zkVM: [tag('STARK', 'Plonky3'), tag('ISA', 'RISC-V')],
      finalWrap: [GROTH16],
    },
    trustedSetupsByProofSystem: {
      'Groth16-Gnark': {
        trustedSetups: [
          {
            id: 'SP1Groth16',
            name: 'SP1 Groth16 setup',
            risk: 'red',
            shortDescription: 'Run among 7 contributors.',
            proofSystem: GROTH16,
          },
        ],
        projectsUsedIn: [KATANA],
        verifiers: {
          successful: { count: 2, attesters: [L2BEAT_ATTESTER] },
          notVerified: { count: 1, attesters: [] },
        },
        projectsUsedInByStatus: {},
      },
    },
    tvs: { value: 1_500_000_000, change: 0.025, changePeriod: '7D' },
  },
  sections: SECTIONS,
}
