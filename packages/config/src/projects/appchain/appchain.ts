import { assert, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('appchain')

const sequencerInbox = discovery.getContract('SequencerInbox')
const outbox = discovery.getContract('Outbox')
assert(
  sequencerInbox.sinceTimestamp !== undefined &&
    outbox.sinceTimestamp !== undefined,
)
const genesisTimestamp = UnixTime(
  Math.min(sequencerInbox.sinceTimestamp, outbox.sinceTimestamp),
)

export const appchain: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  additionalBadges: [BADGES.RaaS.Caldera],
  display: {
    name: 'Appchain',
    slug: 'appchain',
    description:
      'AppChain is an incentivized Layer 2 that allows developers to capture the value their dApps create, enabling sustainable economic models.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://appchain.xyz/'],
      documentation: ['https://docs.appchain.xyz/'],
      explorers: ['https://explorer.appchain.xyz/'],
      bridges: ['https://bridge.appchain.xyz/'],
      socialMedia: [
        'https://x.com/onappchain',
        'https://warpcast.com/onappchain',
        'https://discord.com/invite/kntTtZXM4M',
      ],
    },
  },
  nonTemplateTechnology: {
    sequencing: {
      name: 'Espresso CAS certificates',
      description:
        "The sequencer provides regular pre-confirmations, and the Chain Adjacent Service (CAS) publishes its blocks to the Espresso Network. Before a batch is posted, CAS checks it against the blocks finalized by the Espresso Network and signs a certificate over the batch's message range, Espresso block and DA certificate. CAS runs inside a Trusted Execution Environment (TEE). Its signing key is registered permissionlessly with a ZK-proven attestation of an approved enclave image, checked by the NitroEnclaveVerifier. The SequencerInbox contract on the host chain verifies the certificate through the EspressoTEEVerifier for every non-empty batch from a batch poster and reverts unless the signer's enclave hash is still approved. A batch can also carry such a signer's signature over the full batch data instead. Empty batches need no certificate and can include pending delayed messages. The rollup owner can remove the certificate requirement or replace the verifier with any contract.",
      references: [
        {
          title: 'Chain Adjacent Service',
          url: 'https://github.com/EspressoSystems/chain-adjacent-service',
        },
      ],
      risks: [
        // Liveness attack, but there is forced inclusion to bypass it
        {
          category: 'Withdrawals can be delayed if',
          text: 'the EspressoTEEVerifier owner disables the CAS enclave hash or replaces the verifier contracts, so that CAS certificates no longer verify.',
        },
        {
          category: 'Withdrawals can be delayed if',
          text: 'CAS stops issuing certificates, for example during an Espresso Network outage.',
        },
      ],
    },
  },
  chainConfig: {
    name: 'appchain',
    chainId: 466,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.appchain.xyz/http',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox,
  additionalTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(sequencerInbox.address),
        selector: '0x37501551',
        functionSignature:
          'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber, bytes data, uint256 afterDelayedMessagesRead, address gasRefunder, uint256 prevMessageCount, uint256 newMessageCount, bytes quote)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
})
