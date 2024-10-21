import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../discovery/starkware'
import { reddioex } from '../../../layer2s/reddioex'
import { DAC } from '../templates/dac-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('reddioex')
const committee = getCommittee(discovery)

export const redsonicDac = DAC({
  project: reddioex,
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
    membersCount: committee.accounts.length,
    transactionDataType: DacTransactionDataType.StateDiffs,
  },
})
