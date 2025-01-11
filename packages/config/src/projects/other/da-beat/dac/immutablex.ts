import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../discovery/starkware'
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
  project: 'immutablex',
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
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
