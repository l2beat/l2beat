import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../discovery/starkware'
import { apex } from '../../../layer2s/apex'
import { starkexDAC } from '../templates/starkex-template'
import { DacTransactionDataType } from '../types/DacTransactionDataType'

const discovery = new ProjectDiscovery('apex')

const usdcCommittee = getCommittee(
  discovery,
  'CommitteeUSDC',
  'Data Availability Committee for USDC StarkEx',
)
const usdtCommittee = getCommittee(
  discovery,
  'CommitteeUSDT',
  'Data Availability Committee for USDT StarkEx',
)

const usdcDacConfig =
  usdcCommittee.minAssumedHonestMembers / usdcCommittee.accounts.length
const usdtDacConfig =
  usdtCommittee.minAssumedHonestMembers / usdtCommittee.accounts.length

const dacConfig =
  usdcDacConfig < usdtDacConfig
    ? {
        requiredSignatures: usdcCommittee.minSigners,
        membersCount: usdcCommittee.accounts.length,
      }
    : {
        requiredSignatures: usdtCommittee.minSigners,
        membersCount: usdtCommittee.accounts.length,
      }

export const apexDac = starkexDAC({
  project: apex,
  bridge: {
    chain: ChainId.ETHEREUM,
    requiredMembers: dacConfig.requiredSignatures,
    membersCount: dacConfig.membersCount,
    transactionDataType: DacTransactionDataType.StateDiffs,
    contracts: {
      addresses: [
        discovery.getContractDetails(
          'CommitteeUSDC',
          'Data Availability Committee (DAC) contract for USDC StarkEx instance, verifying data availability claim from DAC Members (via multisig check).',
        ),
        discovery.getContractDetails(
          'CommitteeUSDT',
          'Data Availability Committee (DAC) contract for USDT StarkEx instance, verifying data availability claim from DAC Members (via multisig check).',
        ),
      ],
      risks: [],
    },
    permissions: [
      {
        name: 'USDC Committee Members',
        description: `List of addresses authorized to sign data commitments for the DA bridge.`,
        accounts: usdcCommittee.accounts.map((operator) => ({
          address: operator.address,
          type: 'EOA',
        })),
      },
      {
        name: 'USDT Committee Members',
        description: `List of addresses authorized to sign data commitments for the DA bridge.`,
        accounts: usdtCommittee.accounts.map((operator) => ({
          address: operator.address,
          type: 'EOA',
        })),
      },
    ],
  },
})
