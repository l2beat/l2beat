import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'
import { DA_BRIDGES, DA_LAYERS, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { CustomDa, Layer2 } from '../../types'
import { Badge } from '../badges'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaUpgradeabilityRisk,
} from '../da-beat/common'
import { DaRelayerFailureRisk } from '../da-beat/common/DaRelayerFailureRisk'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('mantle')

const committeeMembers = discovery.getContractValue<number>(
  'BLSRegistry',
  'numOperators',
)

const threshold =
  discovery.getContractValue<number>(
    'DataLayrServiceManager',
    'quorumThresholdBasisPoints',
  ) / 1000 // Quorum threshold is in basis points, but stake is equal for all members (100k MNT)

const totalStakeArray = discovery.getContractValue<number[]>(
  'BLSRegistry',
  'totalStake',
)
const totalStake = BigNumber.from(totalStakeArray[0])

const requiredStake = totalStake.div(committeeMembers)

const requiredStakeFormatted = parseFloat(
  utils.formatEther(requiredStake),
).toLocaleString()

const mantleDa: CustomDa = {
  type: 'Data Availability Committee',
  name: 'Mantle DA',
  description:
    'Mantle DA is a data availability solution built on EigenDA contracts, which have been forked and significantly modified.',
  technology: {
    description: `
## Architecture
![MantleDA architecture](/images/da-layer-technology/mantleda/architecture.png#center)
Mantle DA is an independent DA module that is built on top of an early version of EigenDA smart contracts.
The system is made up of two main component: onchain smart contracts for storing and verifying data commitments, and an offchain network of permissioned nodes storing the data.
The permissioned set of nodes is tasked with providing data availability to the Mantle network. 
They receive Mantle network transaction data, sign it using a BLS signature scheme, and send back signatures to the sequencer to post commitments to the DataLayrServiceManager (DA Bridge) contract on Ethereum.
The DA DataLayrServiceManager acts as a verifier smart contract,  verifying that the signatures provided by the sequencer are indeed from node operators who have agreed to be in the quorum.
To become members of the DA network, node operators are required to stake ${requiredStakeFormatted} MNT tokens, and can only be registered by an authorized entity. There is no slashing mechanism in place for misbehaving nodes.

## DA Bridge
![MantleDA bridge](/images/da-bridge-technology/mantleda/architecture.png#center)

The DA bridge contract is used for storing transaction data headers and confirming the data store by verifying operators signatures.
The Mantle sequencer posts the data hash as a commitment to the DataLayrServiceManager contract on Ethereum through an InitDataStore() transaction.
Once the commitment is posted, the sequencer sends the data to the permissioned set of nodes, who sign the data and send back the signatures to the sequencer.
The sequencer then posts the signatures to the DataLayrServiceManager contract on Ethereum through a confirmDataStore() transaction.
The confirmDataStore() function verify the signatures and if the quorum is reached, the data is considered available.
      `,
  },
  dac: {
    requiredMembers: threshold,
    membersCount: committeeMembers,
  },
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('MNT'),
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    committeeSecurity: DaCommitteeSecurityRisk.NoDiversityCommitteeSecurity(
      `${threshold}/${committeeMembers}`,
    ),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
}

export const mantle: Layer2 = opStackL2({
  addedAt: new UnixTime(1680782525), // 2023-04-06T12:02:05Z
  daProvider: {
    layer: DA_LAYERS.MANTLE_DA,
    bridge: DA_BRIDGES.STAKED_OPERATORS({
      requiredSignatures: threshold,
      membersCount: committeeMembers,
    }),
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. Mantle DA contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions. DA fraud proof mechanism is not live yet.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. The sequencer posts the transactions data batch root, and then propagates the data to off-chain permissioned nodes to sign. It subsequently posts the nodes signatures on chain to verify they belong to the specified members of the quorum, and that the minimum stake threshold is met.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'DataLayrServiceManager.sol#L389 - Etherscan source code, confirmDataStore function',
          url: 'https://etherscan.io/address/0xab42127980a3bff124e6465e097a5fc97228827e#code#F1#L389',
        },
        {
          title:
            'DataLayrServiceManager.sol#L404 - Etherscan source code, signature verification check ',
          url: 'https://etherscan.io/address/0xab42127980a3bff124e6465e097a5fc97228827e#code#F1#L404',
        },
      ],
    },
    badge: Badge.DA.CustomDA,
  },
  associatedTokens: ['MNT'],
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'FBTC'],
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Mantle',
    slug: 'mantle',
    architectureImage: 'mantle',
    description:
      'Mantle is an under development EVM compatible Optimium, based on the OP Stack.',
    links: {
      websites: ['https://mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs-v2.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/', 'https://mantlescan.info'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
  },
  rpcUrl: 'https://rpc.mantle.xyz',
  genesisTimestamp: new UnixTime(1688428800),
  chainConfig: {
    name: 'mantle',
    chainId: 5000,
    explorerUrl: 'https://explorer.mantle.xyz',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/5000/etherscan/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1688314886),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 304717,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mantle',
  },
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
      type: 'general',
    },
    {
      title: 'Mainnet v2 Tectonic Upgrade',
      url: 'https://www.mantle.xyz/blog/announcements/mantle-completes-mainnet-v2-tectonic-upgrade',
      date: '2024-03-15T00:00:00.00Z',
      description: 'Mantle completes Mainnet v2 Tectonic Upgrade.',
      type: 'general',
    },
    {
      title: 'MNT token migration begins',
      url: 'https://www.mantle.xyz/blog/announcements/bit-to-mnt-user-guide',
      date: '2023-07-11T00:00:00.00Z',
      description: 'User can exchange their BIT tokens to MNT tokens.',
      type: 'general',
    },
  ],
  nonTemplateOptimismPortalEscrowTokens: ['MNT'],
  customDa: mantleDa,
})
