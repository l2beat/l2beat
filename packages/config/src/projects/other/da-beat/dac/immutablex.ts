import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../discovery/starkware'
import { immutablex } from '../../../layer2s/immutablex'
import { DAC } from '../templates/dac-template'
import { DaAttestationSecurityRisk } from '../types'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('immutablex')
const committee = getCommittee(discovery)

export const immutableXDac = DAC({
  project: immutablex,
  links: {
    websites: ['https://immutablex.xyz/'],
    documentation: ['https://docs.immutablex.xyz/'],
    repositories: ['https://github.com/Immutable'],
    apps: ['https://app.immutable.com/'],
    explorers: ['https://explorer.immutable.com/'],
  },
  bridge: {
    contracts: {
      addresses: [
        discovery.getContractDetails(
          'Committee',
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
        ),
      ],
      risks: [],
    },
    permissions: [
      {
        name: 'Committee Members',
        description: `List of addresses authorized to sign data commitments for the DA bridge.`,
        accounts: committee.accounts.map((operator) => ({
          address: operator.address,
          type: 'EOA',
        })),
      },
    ],
    chain: ChainId.ETHEREUM,
    requiredMembers: committee.minSigners,
    totalMembers: committee.accounts.length,
    transactionDataType: DacTransactionDataType.StateDiffs,
    members: {
      type: 'public',
      list: [
        {
          name: 'Immutable',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'StarkWare',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'Deversifi',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'Consensys',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'Nethermind',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'Iqlusion',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'Infura',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          name: 'Cephalopod',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
      ],
    },
  },
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
  },
})
