import { ChainId } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { getCommittee } from '../../../../../discovery/starkware'
import { apex } from '../../../../layer2s/apex'
import {
  DaAccessibilityRisk,
  DaAttestationSecurityRisk,
  DaExitWindowRisk,
} from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

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

export const apexDac = {
  id: 'apex-dac-bridge',
  type: 'DAC',
  display: {
    name: 'Apex DAC',
    slug: 'dac',
    description: 'apex DAC on Ethereum.',
    links: {
      websites: ['https://apex.exchange/'],
      apps: ['https://pro.apex.exchange/'],
      documentation: ['https://apex-pro.gitbook.io/apex-pro?lang=en-US'],
      explorers: [],
      repositories: ['https://github.com/ApeX-Protocol/core'],
      socialMedia: [
        'https://twitter.com/OfficialApeXdex',
        'https://apexdex.medium.com/',
        'https://t.me/ApeXdex',
        'https://discord.com/invite/apexprotocol',
        'https://youtube.com/@apexprotocol',
      ],
    },
  },
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
  technology: `## Simple DA Bridge
    The DA bridge is a smart contract verifying a data availability claim from DAC Members via signature verification.
    The bridge requires a ${dacConfig.requiredSignatures}/${dacConfig.membersCount} threshold of signatures to be met before the data commitment is accepted.
  `,
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
  chain: ChainId.ETHEREUM,
  requiredMembers: dacConfig.requiredSignatures,
  totalMembers: dacConfig.membersCount,
  transactionDataType: DacTransactionDataType.StateDiffs,
  members: {
    type: 'unknown',
  },
  usedIn: toUsedInProject([apex]),
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerified(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
