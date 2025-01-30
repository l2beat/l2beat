import { ProjectId } from '@l2beat/shared-pure'
import type { Meta, StoryObj } from '@storybook/react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { PermissionsSection } from './permissions-section'

const meta = {
  title: 'Components/Projects/Sections/Permissions',
  component: PermissionsSection,
  args: {
    id: 'permissions',
    sectionOrder: '1',
    includeChildrenIfUnderReview: false,
    isUnderReview: false,
    title: 'Permissions',
    permissionsByChain: {
      Ethereum: {
        roles: [
          {
            name: 'Sequencers (2)',
            highSeverityFieldChanged: false,
            implementationChanged: false,
            addresses: [
              {
                name: '0x0C59…E32D',
                address: '0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D',
                href: 'https://etherscan.io/address/0x0C5911d57B24FCF1DC8B2608eFbAe57C7098E32D#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xC1b6…47cc',
                address: '0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc',
                href: 'https://etherscan.io/address/0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
            ],
            usedInProjects: undefined,
            chain: 'ethereum',
            description:
              'Central actors allowed to submit transaction batches to L1.',
            references: [],
          },
          {
            name: 'Validators/Proposers (14)',
            highSeverityFieldChanged: false,
            implementationChanged: false,
            addresses: [
              {
                name: '0x56D8…2D78',
                address: '0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78',
                href: 'https://etherscan.io/address/0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
              {
                name: '0x758C…c398',
                address: '0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398',
                href: 'https://etherscan.io/address/0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
              {
                name: '0x7CF3…E9d0',
                address: '0x7CF3d537733F6Ba4183A833c9B021265716cE9d0',
                href: 'https://etherscan.io/address/0x7CF3d537733F6Ba4183A833c9B021265716cE9d0#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
              {
                name: '0x8321…3DD5',
                address: '0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5',
                href: 'https://etherscan.io/address/0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
              {
                name: '0xB0CB…34B0',
                address: '0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0',
                href: 'https://etherscan.io/address/0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
              {
                name: '0xf59c…519b',
                address: '0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b',
                href: 'https://etherscan.io/address/0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
              {
                name: '0x0fF8…34B4',
                address: '0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4',
                href: 'https://etherscan.io/address/0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x54c0…840c',
                address: '0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c',
                href: 'https://etherscan.io/address/0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x610A…7974',
                address: '0x610Aa279989F440820e14248BD3879B148717974',
                href: 'https://etherscan.io/address/0x610Aa279989F440820e14248BD3879B148717974#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x6Fb9…2104',
                address: '0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104',
                href: 'https://etherscan.io/address/0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xAB1A…47FF',
                address: '0xAB1A39332e934300eBCc57B5f95cA90631a347FF',
                href: 'https://etherscan.io/address/0xAB1A39332e934300eBCc57B5f95cA90631a347FF#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xB51E…C61d',
                address: '0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d',
                href: 'https://etherscan.io/address/0xB51EDdfc9A945e2B909905e4F242C4796Ac0C61d#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xdDf2…F01E',
                address: '0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E',
                href: 'https://etherscan.io/address/0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xF8D3…6ab5',
                address: '0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5',
                href: 'https://etherscan.io/address/0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
            ],
            usedInProjects: undefined,
            chain: 'ethereum',
            description:
              'They can submit new state roots and challenge state roots. Some of the operators perform their duties through special purpose smart contracts.',
            references: [],
          },
        ],
        actors: [
          {
            name: 'SecurityCouncil',
            highSeverityFieldChanged: false,
            implementationChanged: false,
            addresses: [
              {
                name: '0xF06E…3F85',
                address: '0xF06E95eF589D9c38af242a8AAee8375f14023F85',
                href: 'https://etherscan.io/address/0xF06E95eF589D9c38af242a8AAee8375f14023F85#code',
                isAdmin: false,
                verificationStatus: 'verified',
              },
            ],
            usedInProjects: [
              {
                type: 'permission',
                id: ProjectId('nova'),
                name: 'Arbitrum Nova',
                slug: 'nova',
                targetName: 'SecurityCouncil',
                iconPath: '/icons/nova.png',
                hrefRoot: 'scaling',
              },
            ],
            chain: 'ethereum',
            description:
              'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions and to upgrade the bridge implementation, potentially gaining access to all funds stored in the bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators. This is a Gnosis Safe with 9 / 12 threshold. It uses the following modules: UpgradeExecutor.',
            references: [],
          },
          {
            name: 'SecurityCouncil participants (12)',
            highSeverityFieldChanged: false,
            implementationChanged: false,
            addresses: [
              {
                name: '0x70C0…6C75',
                address: '0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75',
                href: 'https://etherscan.io/address/0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xA821…4422',
                address: '0xA821c8c245d1F3A257e3B0DEC99268cA05144422',
                href: 'https://etherscan.io/address/0xA821c8c245d1F3A257e3B0DEC99268cA05144422#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x5a09…022C',
                address: '0x5a09A94eE8198D3c474d723337aa58023810022C',
                href: 'https://etherscan.io/address/0x5a09A94eE8198D3c474d723337aa58023810022C#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x5DD2…1df1',
                address: '0x5DD2205C3aac13E592F0a3D85188c948D1781df1',
                href: 'https://etherscan.io/address/0x5DD2205C3aac13E592F0a3D85188c948D1781df1#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x8F10…d8E3',
                address: '0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3',
                href: 'https://etherscan.io/address/0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xb71c…44Ed',
                address: '0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed',
                href: 'https://etherscan.io/address/0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x3E28…59AF',
                address: '0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF',
                href: 'https://etherscan.io/address/0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xb07d…5E28',
                address: '0xb07dc9103328A51128bC6Cc1049d1137035f5E28',
                href: 'https://etherscan.io/address/0xb07dc9103328A51128bC6Cc1049d1137035f5E28#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x3Bd8…eF23',
                address: '0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23',
                href: 'https://etherscan.io/address/0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xf8e1…fEfd',
                address: '0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd',
                href: 'https://etherscan.io/address/0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x0275…7Bae',
                address: '0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae',
                href: 'https://etherscan.io/address/0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x4758…Bf09',
                address: '0x475816ca2a31D601B4e336f5c2418A67978aBf09',
                href: 'https://etherscan.io/address/0x475816ca2a31D601B4e336f5c2418A67978aBf09#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
            ],
            chain: 'ethereum',
            description: 'Those are the participants of the SecurityCouncil.',
            references: [
              {
                title: 'Security Council members - Arbitrum Foundation Docs',
                url: 'https://docs.arbitrum.foundation/security-council-members',
              },
            ],
            usedInProjects: undefined,
          },
        ],
      },
      'Arbitrum One': {
        roles: [],
        actors: [
          {
            name: 'L2SecurityCouncilEmergency',
            highSeverityFieldChanged: false,
            implementationChanged: false,
            addresses: [
              {
                name: '0x4235…1641',
                address: '0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641',
                href: 'https://arbiscan.io/address/0x423552c0F05baCCac5Bfa91C6dCF1dc53a0A1641#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
            ],
            usedInProjects: [],
            chain: 'arbitrum',
            description:
              'The elected signers for the Arbitrum SecurityCouncil can act through this multisig on Layer2, permissioned to upgrade all system contracts without delay. This is a Gnosis Safe with 9 / 12 threshold. It uses the following modules: L2UpgradeExecutor.',
            references: [],
          },
          {
            name: 'L2SecurityCouncilEmergency participants (12)',
            highSeverityFieldChanged: false,
            implementationChanged: false,
            addresses: [
              {
                name: '0x70C0…6C75',
                address: '0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75',
                href: 'https://arbiscan.io/address/0x70C006fC86A392c16D7E085cefc0Ad1FF7de6C75#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xA821…4422',
                address: '0xA821c8c245d1F3A257e3B0DEC99268cA05144422',
                href: 'https://arbiscan.io/address/0xA821c8c245d1F3A257e3B0DEC99268cA05144422#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x5a09…022C',
                address: '0x5a09A94eE8198D3c474d723337aa58023810022C',
                href: 'https://arbiscan.io/address/0x5a09A94eE8198D3c474d723337aa58023810022C#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x5DD2…1df1',
                address: '0x5DD2205C3aac13E592F0a3D85188c948D1781df1',
                href: 'https://arbiscan.io/address/0x5DD2205C3aac13E592F0a3D85188c948D1781df1#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x8F10…d8E3',
                address: '0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3',
                href: 'https://arbiscan.io/address/0x8F10e3413586c4a8DCfcE19D009872b19e9cd8E3#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xb71c…44Ed',
                address: '0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed',
                href: 'https://arbiscan.io/address/0xb71ca4FFbB7b58d75Ba29891ab45e9Dc12B444Ed#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x3E28…59AF',
                address: '0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF',
                href: 'https://arbiscan.io/address/0x3E286452b1C66abB08Eb5494c3894F40aB5a59AF#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xb07d…5E28',
                address: '0xb07dc9103328A51128bC6Cc1049d1137035f5E28',
                href: 'https://arbiscan.io/address/0xb07dc9103328A51128bC6Cc1049d1137035f5E28#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x3Bd8…eF23',
                address: '0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23',
                href: 'https://arbiscan.io/address/0x3Bd8e2AC65ad6f0F094BA6766cBd9484AB49eF23#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0xf8e1…fEfd',
                address: '0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd',
                href: 'https://arbiscan.io/address/0xf8e1492255d9428c2Fc20A98A1DeB1215C8ffEfd#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x0275…7Bae',
                address: '0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae',
                href: 'https://arbiscan.io/address/0x0275b3D54a5dDbf8205A75984796eFE8b7357Bae#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
              {
                name: '0x4758…Bf09',
                address: '0x475816ca2a31D601B4e336f5c2418A67978aBf09',
                href: 'https://arbiscan.io/address/0x475816ca2a31D601B4e336f5c2418A67978aBf09#code',
                isAdmin: false,
                verificationStatus: 'not-verifiable',
              },
            ],
            chain: 'arbitrum',
            description:
              'Those are the participants of the L2SecurityCouncilEmergency.',
            references: [],
            usedInProjects: undefined,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <HighlightableLinkContextProvider>
        <Story />
      </HighlightableLinkContextProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof PermissionsSection>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
