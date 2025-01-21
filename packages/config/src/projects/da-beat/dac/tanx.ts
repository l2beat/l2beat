import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../discovery/starkware'
import { tanx } from '../../layer2s/tanx'
import { StarkexDAC } from '../templates/starkex-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('brine')
const committee = getCommittee(discovery)

export const tanxDac = StarkexDAC({
  project: tanx,
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
  },
})
