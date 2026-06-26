import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('across')

const bondAmountFmt = discovery.getContractValue('HubPool', 'bondAmountFmt')
const finalizationDelayFmt = discovery.getContractValue(
  'HubPool',
  'finalizationDelayFmt',
)

export const across: BaseProject = {
  id: ProjectId('across'),
  slug: 'across',
  name: 'Across',
  shortName: undefined,
  addedAt: UnixTime(1712746402),
  interopConfig: {
    description:
      'Intent framework specialised on popular chains and assets, speed and security.',
    detailedDescription: `
    # Crosschain transfer flow
    The user initiates a transfer (sometimes called an intent) by depositing into the local chain "SpokePool" contract. The deposit specifies the recipient, the destination chain, the amount, the input token, the output token, a fill deadline by which the destination chain transfer must complete, and an optional exclusivity window during which only a chosen relayer can fill. User funds remain in the SpokePool; the deposit's parameters are not persisted in contract storage but only captured in a FundsDeposited event log, which relayers index offchain to learn about deposits.

    Relayers fill a crosschain request by calling the destination chain's SpokePool. During the exclusivity window only the chosen relayer can fill; after it expires anyone can. No fill is accepted past the fill deadline. Funds go to the user and the relay hash is marked Filled in the SpokePool's fillStatuses mapping to prevent double-fills.

    # Relayer repayments
    When a crosschain transfer is fulfilled, the relayer specifies on which chain and to which address they want to be repaid. A whitelisted proposer periodically posts a "root bundle" to the HubPool containing how much the protocol owes to each relayer (relayer refunds) and the pool rebalances needed so that there is enough liquidity on each chain for the refunds to be paid. The correctness of these roots is crucial; otherwise relayers could lie about filling a transfer and capture user funds.

    Root bundles settle in two levels:
    1. Optimistic (Across-native): the proposer bonds ${bondAmountFmt} ABT (a simple ETH wrapper, not to be confused with the ACX governance token) and the root sits in a challenge period of ${finalizationDelayFmt}. If unchallenged, the bundle executes; UMA is not involved in this happy path.
    2. Dispute escalation (UMA): anyone can call disputeRootBundle() within the challenge period by posting an equal counter-bond. The disputed bundle is discarded immediately so a new proposal can be submitted, while the dispute itself is escalated to UMA's optimistic oracle, which resolves via UMA token voting; the losing party loses their bond.

    For chains with a canonical L1↔L2 messenger, tokens and admin / refund messages move from the HubPool to each SpokePool through that chain's canonical bridge via a per-chain adapter. For chains without one (BNB Smart Chain, HyperEVM, Plasma, Tempo, Tron, ...), Across uses universal adapters: the HubPool writes the message calldata into the HubPoolStore on Ethereum, and the destination chain's SpokePool reads it via an Ethereum zk light client. Tokens travel via LayerZero OFT, or via Circle CCTP for USDC.

    LPs can provide single-token liquidity to the HubPool to front relayer refunds across chains, earning yield from an LP fee captured on every transfer.
    `,
    plugins: [
      {
        plugin: 'across',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
    permissions: generateDiscoveryDrivenPermissions([discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([discovery]),
      risks: [],
    },
  },
}
