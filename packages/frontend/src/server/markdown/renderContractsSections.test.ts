import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '~/components/projects/sections/ContractEntry'

import type { UsedInProject } from '~/components/projects/sections/permissions/UsedInProject'
import { PROGRAM_HASHES_SECTION_INTRO } from '~/pages/zk-catalog/v2/components/zkCatalogUi'
import { absolutizeLinks } from './markdown'
import {
  renderContractsSection,
  renderPermissionsSection,
} from './renderContractsSections'

// Method: render hand-built section props (the shape the HTML components
// receive) and check the markdown for the lines an agent needs, compared
// literally. Each case sets only the fields it is about, so the expected text
// shows which input produced it.
describe(renderContractsSection.name, () => {
  it('spells out what the HTML entry hides behind badges, icons and dialogs', () => {
    const markdown = renderContracts([
      {
        ...contract('Bridge', A1),
        addresses: [address(A1), address(A2, 'Implementation (Upgradable)')],
        escrow: { tokens: ['ETH', 'USDC'], tokenIcons: [], isCustom: true },
        upgradeConsiderations: 'Upgrades go through the ## Timelock.',
        usedInProjects: [
          usedIn('Base', 'proxy'),
          usedIn('Base', 'implementation'),
          usedIn('Zora', 'implementation'),
        ],
      },
    ])

    expect(markdown).toInclude(
      '#### Bridge (custom escrow)',
      `Addresses: [${A1}](https://etherscan.io/address/${A1}), [${A2}](https://etherscan.io/address/${A2}) (Implementation (Upgradable))`,
      'The following tokens are included in the value secured calculation: ETH, USDC',
      'Proxy used in: [Base](https://l2beat.com/scaling/projects/base#Bridge)',
      'Implementation used in: [Zora](https://l2beat.com/scaling/projects/zora#Bridge)',
      '**Upgrade details**\n\nUpgrades go through the ## Timelock.',
    )
    expect(markdown).not.toInclude('Implementation used in: [Base]')
  })

  // A link destination cannot hold spaces or unbalanced brackets: left raw,
  // markdown readers show the whole link as plain text.
  it('encodes the entry name in a used-in link', () => {
    const markdown = renderContracts([
      {
        ...contract('Bridge', A1),
        usedInProjects: [usedIn('Base', 'proxy', 'Security Council (old)')],
      },
    ])

    expect(markdown).toInclude(
      'Proxy used in: [Base](https://l2beat.com/scaling/projects/base#Security%20Council%20%28old%29)',
    )
  })

  it('links Disco like the banner above the HTML section', () => {
    const markdown = resolveLinks(
      renderContractsSection(
        {
          contracts: {},
          risks: [],
          discoUi: { href: 'https://disco.l2beat.com/ui/p/blobstream' },
        } as unknown as Parameters<typeof renderContractsSection>[0],
        3,
      ),
    )

    expect(markdown).toInclude(
      "Explore these contracts and permissions in Disco, L2BEAT's contract explorer: https://disco.l2beat.com/ui/p/blobstream",
    )
  })

  it('words an escrow of all tokens as the HTML does', () => {
    const markdown = renderContracts([
      {
        ...contract('Generic escrow', A1),
        escrow: { tokens: '*', tokenIcons: [] },
      },
    ])

    expect(markdown).toInclude(
      '#### Generic escrow (escrow)',
      'All supported tokens in this escrow are included in the value secured calculation.',
    )
  })

  it('lists past upgrades newest first with their stats, transactions and diffs', () => {
    const markdown = renderContracts([
      {
        ...contract('Rollup', A1),
        pastUpgrades: {
          stats: { count: 1, lastInterval: 86400 * 5, avgInterval: null },
          upgrades: [
            {
              isInitialDeployment: false,
              timestamp: UnixTime(1709294400),
              transactionHash: { hash: '0xbb', href: 'https://tx/0xbb' },
              implementations: [
                {
                  address: A3,
                  href: 'https://impl/3',
                  diffUrl: 'https://disco/diff',
                },
              ],
            },
            {
              isInitialDeployment: true,
              timestamp: UnixTime(1672531200),
              transactionHash: { hash: '0xaa', href: 'https://tx/0xaa' },
              implementations: [{ address: A2, href: 'https://impl/2' }],
            },
          ],
        },
      },
    ])

    expect(markdown).toInclude(
      '**Past upgrades** (Count of upgrades: 1, Last upgrade: 5d ago, Avg upgrade interval: N/A)\n\n' +
        `- 2024-03-01 12:00 UTC, upgrade: transaction [0xbb](https://tx/0xbb), implementations: [${A3}](https://impl/3) ([diff](https://disco/diff))\n` +
        `- 2023-01-01 00:00 UTC, deployment: transaction [0xaa](https://tx/0xaa), implementations: [${A2}](https://impl/2)`,
    )
  })

  it('tells apart entries sharing a name and counts grouped instances', () => {
    const markdown = renderContracts([
      contract('ProxyAdmin', A1),
      contract('ProxyAdmin', A2),
      { ...contract('Verifier', A3), groupCount: 3 },
    ])

    expect(markdown).toInclude(
      '#### ProxyAdmin (0x1111…1111)',
      '#### ProxyAdmin (0x2222…2222)',
      '#### Verifier (3 instances)',
    )
  })

  it('warns about impactful changes and lists changed contracts last', () => {
    const markdown = renderContracts([
      { ...contract('Changed', A1), impactfulChange: true },
      contract('Unchanged', A2),
    ])

    expect(markdown).toMatchRegex(
      /^\*\*Note:\*\* Contracts presented in this section had their implementations updated since the last time our team looked at this project\. The information presented may be inaccurate\./,
    )
    expect(markdown).toInclude(
      '#### Unchanged',
      '**Warning:** There are impactful changes to the following contracts, and part of the information might be outdated.\n\n#### Changed (impactful change)',
    )
    expect(markdown.indexOf('#### Unchanged')).toBeLessThan(
      markdown.indexOf('#### Changed'),
    )
  })

  it('links the architecture diagram by its absolute URL, captioned', () => {
    const markdown = resolveLinks(
      renderContractsSection(
        {
          contracts: {},
          risks: [],
          diagram: {
            caption: 'A diagram of the smart contract architecture',
            src: {
              light: {
                src: '/images/architecture/arbitrum.png',
                width: 1,
                height: 1,
              },
            },
          },
        },
        3,
      ),
    )

    expect(markdown).toEqual(
      '![A diagram of the smart contract architecture](https://l2beat.com/images/architecture/arbitrum.png)',
    )
  })

  it('lists program hashes and their description without the ZK catalog intro', () => {
    const markdown = resolveLinks(
      renderContractsSection(
        {
          contracts: {},
          risks: [],
          programHashes: [
            {
              title: 'Aggregation program',
              hash: '0xabc',
              verificationStatus: 'successful',
              usedIn: [],
            },
          ],
          programHashesDescription: 'Hashes are checked by the verifier.',
        },
        3,
      ),
    )

    expect(markdown).toInclude(
      '### Program Hashes\n\n#### Aggregation program',
      '- Hash: `0xabc`',
      'Hashes are checked by the verifier.',
    )
    expect(markdown).not.toInclude(PROGRAM_HASHES_SECTION_INTRO)
  })
})

describe(renderPermissionsSection.name, () => {
  it('lists multisig participants and the projects sharing a permission', () => {
    const markdown = resolveLinks(
      renderPermissionsSection(
        {
          permissionsByChain: {
            ethereum: {
              roles: [],
              actors: [
                {
                  ...contract('Security Council', A1),
                  participants: [
                    { name: 'Alice', address: A2, href: 'https://e/2' },
                    { name: '0x3333…3333', address: A3, href: 'https://e/3' },
                  ],
                  usedInProjects: [usedIn('Base', 'permission')],
                },
              ],
            },
          },
        },
        3,
      ),
    )

    expect(markdown).toInclude(
      '### ethereum\n\n#### Actors\n\n##### Security Council',
      `Participants (2): [${A2}](https://e/2) (Alice), [${A3}](https://e/3)`,
      'Used in: [Base](https://l2beat.com/scaling/projects/base#Bridge)',
    )
  })

  it('warns about impactful changes to permissions without the contracts note', () => {
    const markdown = resolveLinks(
      renderPermissionsSection(
        {
          permissionsByChain: {
            ethereum: {
              roles: [{ ...contract('Proposer', A1), impactfulChange: true }],
              actors: [],
            },
          },
        },
        3,
      ),
    )

    expect(markdown).toInclude(
      '**Warning:** There are impactful changes to the following permissions, and part of the information might be outdated.\n\n##### Proposer (impactful change)',
    )
    expect(markdown).not.toInclude('**Note:**')
  })
})

const A1 = '0x1111111111111111111111111111111111111111'
const A2 = '0x2222222222222222222222222222222222222222'
const A3 = '0x3333333333333333333333333333333333333333'

/** Links resolve against the page once the whole document is assembled, as `renderProjectMarkdown` does. */
function resolveLinks(markdown: string) {
  return absolutizeLinks(
    markdown,
    'https://l2beat.com/scaling/projects/arbitrum',
  )
}

function renderContracts(contracts: TechnologyContract[]) {
  return resolveLinks(
    renderContractsSection(
      { contracts: { ethereum: contracts }, risks: [] },
      3,
    ),
  )
}

function contract(name: string, addr: string): TechnologyContract {
  return {
    id: name,
    name,
    addresses: [address(addr)],
    admins: [],
    chain: 'ethereum',
    references: [],
    impactfulChange: false,
  }
}

function address(addr: string, name?: string): TechnologyContractAddress {
  return {
    name: name ?? `${addr.slice(0, 6)}…${addr.slice(-4)}`,
    address: addr,
    href: `https://etherscan.io/address/${addr}`,
    verificationStatus: 'verified',
  }
}

function usedIn(
  name: string,
  type: UsedInProject['type'],
  targetName = 'Bridge',
): UsedInProject {
  const slug = name.toLowerCase()
  return {
    id: ProjectId(slug),
    name,
    slug,
    url: `/scaling/projects/${slug}`,
    icon: `/icons/${slug}.png`,
    targetName,
    type,
  }
}
