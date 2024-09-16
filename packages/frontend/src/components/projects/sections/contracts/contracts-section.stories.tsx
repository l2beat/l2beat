import { ProjectId } from '@l2beat/shared-pure'
import { type Meta, type StoryObj } from '@storybook/react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { ContractsSection } from './contracts-section'

const meta = {
  title: 'Components/Projects/Sections/Contracts',
  component: ContractsSection,
  args: {
    title: 'Contracts',
    sectionOrder: 1,
    chainName: 'Ethereum',
    id: 'contracts',
  },
  decorators: [
    (Story) => (
      <HighlightableLinkContextProvider>
        <Story />
      </HighlightableLinkContextProvider>
    ),
  ],
} satisfies Meta<typeof ContractsSection>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sectionOrder: 13,
    chainName: 'Ethereum',
    nativeContracts: {
      'Arbitrum One': [
        {
          name: 'CoreGovernor',
          addresses: [
            {
              name: '0xf07D…95B9',
              address: '0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'Governance contract accepting and managing constitutional Arbitrum Improvement Proposals (AIPs, core proposals) and, among other formal parameters, enforcing the 5% quorum for proposals.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2Timelock',
          addresses: [
            {
              name: '0x34d4…98f0',
              address: '0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x41740588b86B4e0629b83A4e28786FF94361c3A3',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x41740588b86B4e0629b83A4e28786FF94361c3A3#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'Delays constitutional AIPs from the CoreGovernor by 3d.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'TreasuryGovernor',
          addresses: [
            {
              name: '0x789f…e5a4',
              address: '0x789fC99093B09aD01C34DC7251D0C89ce743e5a4',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x789fC99093B09aD01C34DC7251D0C89ce743e5a4#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x065620d99E1785Ccf56Fa95462d3012Eb844FDC9#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'Governance contract used for creating non-constitutional AIPs, or "treasury proposals", e.g., transferring founds out of the DAO Treasury. Also enforces the 3% quorum for proposals.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'TreasuryTimelock',
          addresses: [
            {
              name: '0xbFc1…EF58',
              address: '0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xbFc1FECa8B09A5c5D3EFfE7429eBE24b9c09EF58#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x41740588b86B4e0629b83A4e28786FF94361c3A3',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x41740588b86B4e0629b83A4e28786FF94361c3A3#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'Delays treasury proposals from the TreasuryGovernor by 3d.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2UpgradeExecutor',
          addresses: [
            {
              name: '0xCF57…A827',
              address: '0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xCF57572261c7c2BCF21ffD220ea7d1a27D40A827#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x7A013834D54e9B22d1978aAe3aaDDC909Aa79115#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            "This contract can upgrade the L2 system's contracts through the L2ProxyAdmin. The upgrades can be done either by the Security Council or by the L1Timelock (via its alias on L2).",
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'SecurityCouncilManager',
          addresses: [
            {
              name: '0xD509…eDFC',
              address: '0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xD509E5f5aEe2A205F554f36E8a7d56094494eDFC#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x468dA0eE5570Bdb1Dd81bFd925BAf028A93Dce64#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'This contract enforces the rules for changing members and cohorts of the SecurityCouncil and creates crosschain messages to Ethereum and Arbitrum Nova to keep the configuration in sync.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'ConstitutionHash',
          addresses: [
            {
              name: '0x1D62…0417',
              address: '0x1D62fFeB72e4c360CcBbacf7c965153b00260417',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x1D62fFeB72e4c360CcBbacf7c965153b00260417#code',
              isAdmin: false,
            },
          ],
          description:
            'Keeps the current hash of the ArbitrumDAO Constitution. Settable by the L2UpgradeExecutor.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
        {
          name: 'L2ProxyAdmin',
          addresses: [
            {
              name: '0xdb21…961e',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: false,
            },
          ],
          description:
            "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 system contracts through this contract.",
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
        {
          name: 'L2GatewaysProxyAdmin',
          addresses: [
            {
              name: '0xd570…2a86',
              address: '0xd570aCE65C43af47101fC6250FD6fC63D1c22a86',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xd570aCE65C43af47101fC6250FD6fC63D1c22a86#code',
              isAdmin: false,
            },
          ],
          description:
            "The owner (UpgradeExecutor) can upgrade proxies' implementations of all L2 bridging gateway contracts through this contract.",
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
        {
          name: 'L2BaseFee',
          addresses: [
            {
              name: '0xbF50…b649',
              address: '0xbF5041Fc07E1c866D15c749156657B8eEd0fb649',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xbF5041Fc07E1c866D15c749156657B8eEd0fb649#code',
              isAdmin: false,
            },
          ],
          description:
            'This contract receives all BaseFees: The transaction fee component that covers the minimum cost of Arbitrum transaction execution. They are withdrawable to a configurable set of recipients.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
        {
          name: 'L2SurplusFee',
          addresses: [
            {
              name: '0x32e7…6b1d',
              address: '0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d#code',
              isAdmin: false,
            },
          ],
          description:
            'This contract receives all SurplusFees: Transaction fee component that covers the cost beyond that covered by the L2 Base Fee during chain congestion. They are withdrawable to a configurable set of recipients.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
        {
          name: 'L2ArbitrumToken',
          addresses: [
            {
              name: '0x912C…6548',
              address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x912CE59144191C1204E64559FE8253a0e49E6548#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xC4ed0A9Ea70d5bCC69f748547650d32cC219D882#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'The ARB token contract. Supply can be increased by the owner once per year by a maximum of 2%.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2GatewayRouter',
          addresses: [
            {
              name: '0x5288…F933',
              address: '0x5288c571Fd7aD117beA99bF60FE0846C4E84F933',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x5288c571Fd7aD117beA99bF60FE0846C4E84F933#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0xe80eb0238029333e368e0bDDB7acDf1b9cb28278',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xe80eb0238029333e368e0bDDB7acDf1b9cb28278#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xd570aCE65C43af47101fC6250FD6fC63D1c22a86',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xd570aCE65C43af47101fC6250FD6fC63D1c22a86#code',
              isAdmin: true,
            },
          ],
          description: 'Router managing token <--> gateway mapping on L2.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2ERC20Gateway',
          addresses: [
            {
              name: '0x09e9…1EEe',
              address: '0x09e9222E96E7B4AE2a407B98d48e330053351EEe',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x09e9222E96E7B4AE2a407B98d48e330053351EEe#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x1DCf7D03574fbC7C205F41f2e116eE094a652e93',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x1DCf7D03574fbC7C205F41f2e116eE094a652e93#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xd570aCE65C43af47101fC6250FD6fC63D1c22a86',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xd570aCE65C43af47101fC6250FD6fC63D1c22a86#code',
              isAdmin: true,
            },
          ],
          description:
            'Counterpart to the L1ERC20Gateway. Can mint (deposit to L2) and burn (withdraw to L1) ERC20 tokens on L2.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2WethGateway',
          addresses: [
            {
              name: '0x6c41…623B',
              address: '0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x806421D09cDb253aa9d128a658e60c0B95eFFA01',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x806421D09cDb253aa9d128a658e60c0B95eFFA01#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xd570aCE65C43af47101fC6250FD6fC63D1c22a86',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xd570aCE65C43af47101fC6250FD6fC63D1c22a86#code',
              isAdmin: true,
            },
          ],
          description:
            'Counterpart to the Bridge on L1. Mints and burns WETH on L2.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2ARBGateway',
          addresses: [
            {
              name: '0xCaD7…4D8E',
              address: '0xCaD7828a19b363A2B44717AFB1786B5196974D8E',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xCaD7828a19b363A2B44717AFB1786B5196974D8E#code',
              isAdmin: false,
            },
            {
              name: 'Implementation (Upgradable)',
              address: '0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x5D96786d3Eb13CAd05c9Fd7d0f7bb9560b4E5056#code',
              isAdmin: false,
            },
            {
              name: 'Admin',
              address: '0xdb216562328215E010F819B5aBe947bad4ca961e',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0xdb216562328215E010F819B5aBe947bad4ca961e#code',
              isAdmin: true,
            },
          ],
          description:
            'ARB sent from L2 to L1 is escrowed in this contract and minted on L1.',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
          upgradeableBy: [
            'SecurityCouncilEmergency',
            'SecurityCouncilPropose',
            'L1Timelock',
          ],
          upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
          upgradeConsiderations:
            'An upgrade initiated by the DAO can be vetoed by the Security Council.',
        },
        {
          name: 'L2DAIGateway',
          addresses: [
            {
              name: '0x4671…6C65',
              address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65#code',
              isAdmin: false,
            },
          ],
          description:
            'Counterpart to the L1DaiGateway. Can mint (deposit to L2) and burn (withdraw to L1) DAI tokens on L2',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
        {
          name: 'L2LPTGateway',
          addresses: [
            {
              name: '0x6D24…D318',
              address: '0x6D2457a4ad276000A615295f7A80F79E48CcD318',
              verificationStatus: 'not-verifiable',
              href: 'https://arbiscan.io/address/0x6D2457a4ad276000A615295f7A80F79E48CcD318#code',
              isAdmin: false,
            },
          ],
          description:
            'Counterpart to the L1LPTGateway. Can mint (deposit to L2) and burn (withdraw to L1) LPT on L2',
          usedInProjects: [],
          references: [],
          chain: 'arbitrum',
          implementationHasChanged: false,
        },
      ],
    },
    contracts: [
      {
        name: 'RollupProxy',
        addresses: [
          {
            name: '0x5eF0…Ba35',
            address: '0x5eF0D09d1E6204141B4d37530808eD19f60FBa35',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x5eF0D09d1E6204141B4d37530808eD19f60FBa35#code',
            isAdmin: false,
          },
          {
            name: 'Implementation #1 (Upgradable)',
            address: '0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f#code',
            isAdmin: false,
          },
          {
            name: 'Implementation #2 (Upgradable)',
            address: '0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x3ffFbAdAF827559da092217e474760E2b2c3CeDd',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x3ffFbAdAF827559da092217e474760E2b2c3CeDd#code',
            isAdmin: true,
          },
        ],
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'RollupProxy',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'UpgradeExecutor',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'Bridge',
        addresses: [
          {
            name: '0x8315…ed3a',
            address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x1066CEcC8880948FE55e427E94F1FF221d626591',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x1066CEcC8880948FE55e427E94F1FF221d626591#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD#code',
            isAdmin: true,
          },
        ],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2. This contract stores the following tokens: ETH.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'Bridge',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'Bridge',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'SequencerInbox',
        addresses: [
          {
            name: '0x1c47…82B6',
            address: '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x31DA64D19Cd31A19CD09F4070366Fe2144792cf7#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD#code',
            isAdmin: true,
          },
        ],
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup. Sequencers can be changed here through the UpgradeExecutor or the BatchPosterManager.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'SequencerInbox',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'SequencerInbox',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'Inbox',
        addresses: [
          {
            name: '0x4Dbd…AB3f',
            address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD#code',
            isAdmin: true,
          },
        ],
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'Outbox',
        addresses: [
          {
            name: '0x0B98…4840',
            address: '0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x0eA7372338a589e7f0b00E463a53AA464ef04e17',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x0eA7372338a589e7f0b00E463a53AA464ef04e17#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD#code',
            isAdmin: true,
          },
        ],
        description:
          "Arbitrum's Outbox system allows for arbitrary L2 to L1 contract calls; i.e., messages initiated from L2 which eventually resolve in execution on L1.",
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'UpgradeExecutor',
        addresses: [
          {
            name: '0x3ffF…CeDd',
            address: '0x3ffFbAdAF827559da092217e474760E2b2c3CeDd',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x3ffFbAdAF827559da092217e474760E2b2c3CeDd#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x86f0cf42Ad673B3D666d103E009EC142D1298a17',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x86f0cf42Ad673B3D666d103E009EC142D1298a17#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x5613AF0474EB9c528A34701A5b1662E3C8FA0678',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x5613AF0474EB9c528A34701A5b1662E3C8FA0678#code',
            isAdmin: true,
          },
        ],
        description:
          "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1Timelock.",
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'UpgradeExecutor',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'UpgradeExecutor',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'L1Timelock',
        addresses: [
          {
            name: '0xE684…7f49',
            address: '0xE6841D92B0C345144506576eC13ECf5103aC7f49',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xE6841D92B0C345144506576eC13ECf5103aC7f49#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x61dC65001A8De4138DAD5167e43FF0FB0AB8D3B3#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x5613AF0474EB9c528A34701A5b1662E3C8FA0678',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x5613AF0474EB9c528A34701A5b1662E3C8FA0678#code',
            isAdmin: true,
          },
        ],
        description:
          'Timelock contract for Arbitrum Governance transactions. Scheduled transactions from Arbitrum One L2 (by the DAO or the Security Council) are delayed here and can be canceled by the Security Council or executed to upgrade and change system contracts on Ethereum, Arbitrum One and -Nova.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'L1Timelock',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'L1Timelock',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'L1GatewayRouter',
        addresses: [
          {
            name: '0x72Ce…31ef',
            address: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x52595021fA01B3E14EC6C88953AFc8E35dFf423c',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x52595021fA01B3E14EC6C88953AFc8E35dFf423c#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa#code',
            isAdmin: true,
          },
        ],
        description: 'Router managing token <--> gateway mapping.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'L1GatewayRouter',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'L1GatewayRouter',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'ChallengeManager',
        addresses: [
          {
            name: '0xe589…6f58',
            address: '0xe5896783a2F463446E1f624e64Aa6836BE4C6f58',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xe5896783a2F463446E1f624e64Aa6836BE4C6f58#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xE129b8Aa61dF65cBDbAE4345eE3fb40168DfD566#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD#code',
            isAdmin: true,
          },
        ],
        description:
          'Contract that allows challenging invalid state roots. Can be called through the RollupProxy by Validators or the UpgradeExecutor.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'ChallengeManager',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'ChallengeManager',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: true,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
        upgradeConsiderations:
          'An upgrade initiated by the DAO can be vetoed by the Security Council.',
      },
      {
        name: 'OneStepProofEntry',
        addresses: [
          {
            name: '0xC6E1…4F7e',
            address: '0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xC6E1E6dB03c3F475bC760FE20ed93401EC5c4F7e#code',
            isAdmin: false,
          },
        ],
        description: 'Contract used to perform the last step of a fraud proof.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProofEntry',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProofEntry',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
      {
        name: 'OneStepProverMemory',
        addresses: [
          {
            name: '0xb602…D3ED',
            address: '0xb602D056BD6BA78c3A320660d1a45D1cc8bbD3ED',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xb602D056BD6BA78c3A320660d1a45D1cc8bbD3ED#code',
            isAdmin: false,
          },
        ],
        description: 'Contract used to perform the last step of a fraud proof.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProverMemory',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProverMemory',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
      {
        name: 'OneStepProverMath',
        addresses: [
          {
            name: '0x221C…DCAa',
            address: '0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x221CCc45985Fdd24e33c3f19c6b7D48C02d5DCAa#code',
            isAdmin: false,
          },
        ],
        description: 'Contract used to perform the last step of a fraud proof.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProverMath',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProverMath',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
      {
        name: 'OneStepProverHostIo',
        addresses: [
          {
            name: '0xd7f1…A63e',
            address: '0xd7f12E7418B007Ad7A5c7ACBbF460D3Cfe92A63e',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xd7f12E7418B007Ad7A5c7ACBbF460D3Cfe92A63e#code',
            isAdmin: false,
          },
        ],
        description: 'Contract used to perform the last step of a fraud proof.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProverHostIo',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProverHostIo',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
      {
        name: 'OneStepProver0',
        addresses: [
          {
            name: '0xA174…A58C',
            address: '0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xA174e12Ff8C6b18B37fecA77d6d350D89379A58C#code',
            isAdmin: false,
          },
        ],
        description: 'Contract used to perform the last step of a fraud proof.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProver0',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'OneStepProver0',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
    ],
    escrows: [
      {
        name: 'Generic escrow',
        addresses: [
          {
            name: '0xcEe2…180d',
            address: '0xcEe284F754E854890e311e3280b767F80797180d',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xcEe284F754E854890e311e3280b767F80797180d#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa#code',
            isAdmin: true,
          },
        ],
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
      },
      {
        name: 'Generic escrow',
        addresses: [
          {
            name: '0xa3A7…0EeC',
            address: '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xa3A7B6F88361F48403514059F1F16C8E78d60EeC#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0xb4299A1F5f26fF6a98B7BA35572290C359fde900',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xb4299A1F5f26fF6a98B7BA35572290C359fde900#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa#code',
            isAdmin: true,
          },
        ],
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['SecurityCouncil', 'L1Timelock'],
        upgradeDelay: '12d 8h or 0 if overridden by the Security Council',
      },
      {
        name: 'Escrow for ETH',
        addresses: [
          {
            name: '0x8315…ed3a',
            address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0x1066CEcC8880948FE55e427E94F1FF221d626591',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x1066CEcC8880948FE55e427E94F1FF221d626591#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
            verificationStatus: 'not-verifiable',
            href: 'https://etherscan.io/address/0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD#code',
            isAdmin: true,
          },
        ],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        usedInProjects: [
          {
            type: 'proxy',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'Bridge',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
          {
            type: 'implementation',
            id: ProjectId('nova'),
            name: 'Arbitrum Nova',
            slug: 'nova',
            targetName: 'Bridge',
            iconPath: '/icons/nova.png',
            hrefRoot: 'scaling',
          },
        ],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
        upgradeableBy: ['ProxyAdmin'],
        upgradeDelay: 'No delay',
      },
      {
        name: 'Escrow for DAI',
        addresses: [
          {
            name: '0xA10c…9400',
            address: '0xA10c7CE4b876998858b1a9E12b10092229539400',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xA10c7CE4b876998858b1a9E12b10092229539400#code',
            isAdmin: false,
          },
        ],
        description:
          'DAI Vault for custom DAI Gateway. Fully controlled by MakerDAO governance.',
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
      {
        name: 'Escrow for wstETH',
        addresses: [
          {
            name: '0x0F25…8E5a',
            address: '0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a#code',
            isAdmin: false,
          },
          {
            name: 'Implementation (Upgradable)',
            address: '0xc4E3ff0b5B106f88Fc64c43031BE8b076ee9F21C',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0xc4E3ff0b5B106f88Fc64c43031BE8b076ee9F21C#code',
            isAdmin: false,
          },
          {
            name: 'Admin',
            address: '0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c#code',
            isAdmin: true,
          },
        ],
        description:
          'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
      {
        name: 'Escrow for LPT',
        addresses: [
          {
            name: '0x6A23…210A',
            address: '0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A',
            verificationStatus: 'verified',
            href: 'https://etherscan.io/address/0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A#code',
            isAdmin: false,
          },
        ],
        description: 'LPT Vault for custom Livepeer Token Gateway.',
        usedInProjects: [],
        references: [],
        chain: 'ethereum',
        implementationHasChanged: false,
      },
    ],
    risks: [
      {
        text: 'Funds can be stolen if a contract receives a malicious code upgrade. There is a 12 days delay on code upgrades unless upgrade is initiated by the     Security Council in which case there is no delay.',
        isCritical: false,
      },
    ],
    diagram: {
      src: '/images/architecture/arbitrum.png',
      caption: 'A diagram of the smart contract architecture',
    },
    references: [],
  },
}
