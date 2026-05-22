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
    The user initiates a transfer (sometimes called intent) by depositing into the local chain "SpokePool" contract. The deposit specifies the recipient, the destination chain, the amount, the input token, the output token, a deadline for the crosschain transfer to be filled, and whether exclusivity to a specific relayer is requested. User funds end up in the SpokePool contract. Only an event is emitted, no info is saved onchain.

    Relayers fill a crosschain request on the destination chain's SpokePool. Fills within the exclusivity deadline can only be performed by the chosen relayer, and no one can fill if the deadline has passed. Funds are sent to the user, and the request is marked as filled using an appropriate identifier.

    # Relayer repayments
    When a crosschain transfer is fulfilled, the relayer specifies which chain and which address they want to receive the funds at. A single whitelisted actor can propose a "root bundle", which contains the information on filled transfers and pool rebalances. The correctness of these roots is crucial to guarantee the safety of the protocol, otherwise relayers could lie about filling a transfer and get users funds for it. Such proposal are therefore staked and go through a challenge period where other bonded players can challenge. If a dispute is raised, the resolution is delegated to the UMA protocol, which resolves using token voting and slashes the losing party. The protocol uses "Across Bond Token" (ABT) as the stake token, which is a simple ETH wrapper, which should not be confused with ACX token. The current bond size is ${bondAmountFmt} ABT (ultimately ETH) and the challenge period is ${finalizationDelayFmt}. If a root bundle passes the challenge period without being disputed, it can be executed.
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
