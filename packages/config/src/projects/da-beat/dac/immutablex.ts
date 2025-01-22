import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../discovery/starkware'
import { immutablex } from '../../layer2s/immutablex'
import { StarkexDAC } from '../templates/starkex-template'
import { DaCommitteeSecurityRisk, DaEconomicSecurityRisk } from '../types'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('immutablex')
const committee = getCommittee(discovery)
const requiredHonestMembersPercentage = (
  ((committee.accounts.length - committee.minSigners + 1) /
    committee.accounts.length) *
  100
).toFixed(0)

export const immutableXDac = StarkexDAC({
  project: immutablex,
  links: {
    websites: ['https://immutablex.xyz/'],
    documentation: ['https://docs.immutablex.xyz/'],
    repositories: ['https://github.com/Immutable'],
    apps: ['https://app.immutable.com/'],
    explorers: ['https://explorer.immutable.com/'],
  },
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    contracts: {
      addresses: {
        ethereum: [
          discovery.getContractDetails(
            'Committee',
            'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
          ),
        ],
      },
      risks: [],
    },
    permissions: {
      ethereum: [
        {
          name: 'Committee Members',
          description: `List of addresses authorized to sign data commitments for the DA bridge.`,
          accounts: committee.accounts.map((operator) => ({
            address: operator.address,
            type: 'EOA',
          })),
        },
      ],
    },
    chain: ChainId.ETHEREUM,
    requiredMembers: committee.minSigners,
    membersCount: committee.accounts.length,
    transactionDataType: DacTransactionDataType.StateDiffs,
    knownMembers: [
      {
        external: false,
        name: 'Immutable',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'StarkWare',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'Deversifi',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'Consensys',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'Nethermind',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'Iqlusion',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'Infura',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
      {
        external: true,
        name: 'Cephalopod',
        href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
      },
    ],
  },
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
    committeeSecurity: DaCommitteeSecurityRisk.NoHonestMinimumCommitteeSecurity(
      `${committee.minSigners}/${committee.accounts.length}`,
      requiredHonestMembersPercentage,
    ),
  },
})
