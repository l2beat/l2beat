import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../discovery/starkware'
import { StarkexDAC } from '../templates/starkex-template'
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

export const apexDac = StarkexDAC({
  project: 'apex',
  bridge: {
    createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
    requiredMembers: dacConfig.requiredSignatures,
    membersCount: dacConfig.membersCount,
    transactionDataType: DacTransactionDataType.StateDiffs,
  },
})
