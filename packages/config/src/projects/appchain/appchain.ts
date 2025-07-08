import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('appchain')

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
    stack: ['Arbitrum'],
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
      name: 'Espresso TEE sequencer',
      description: `Appchain integrates with Espresso sequencing. 
        In addition to providing regular pre-confirmations, the sequencer publishes blocks to the Espresso Network.
        The integration expects the transaction batch poster to run inside a Trusted Execution Environment (TEE), and it is programmed to verify batch inclusion in a Espresso Network block before publishing it to the host chain.
        However, the confirmations provided by Espresso Network are additive, and the batch poster can skip Espresso inclusion checks should the Espresso Network be down or unavailable.
        To ensure the batch poster is running inside a TEE, the sequencer inbox contract on the host chain was updated so that the data posting function also includes a TEE attestation as input, a "quote", that is verified onchain by the EspressoTEEVerifier for each batch transaction. 
        The verifier checks the quote signature originates from inside the TEE and reverts if unsuccessful.`,
      references: [
        {
          url: 'https://github.com/EspressoSystems/nitro-espresso-integration/blob/7ddcc6c036fa05cc47560552c85f30b5adedf32c/arbnode/batch_poster.go#L574',
          title: 'Nitro Espresso Integration',
        },
        {
          url: 'https://gramine.readthedocs.io/en/stable/sgx-intro.html#:~:text=The%20SGX%20quote%20is%20a%20signed%20report%20that%20contains%20the%20enclave%20measurement%20and%20the%20signer%20measurement%20of%20the%20enclave%20and%20the%20signer%20of%20the%20signer%20process%20that%20created%20the%20report.',
          title: 'SGX Quote',
        },
      ],
      risks: [
        // Liveness attack, but there is forced inclusion to bypass it
        {
          category: 'Withdrawals can be delayed if',
          text: 'the owner of EspressoTEEVerifier updates the contract verification values (mrEnclave, mrSigner) and it is no longer possible to verify the TEE quote.',
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
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  customDa: AnytrustDAC({ discovery }),
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
})
