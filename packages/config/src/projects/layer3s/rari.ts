import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'

const discovery = new ProjectDiscovery('rari', 'arbitrum')

export const rari: Layer3 = orbitStackL3({
  addedAt: new UnixTime(1706285474), // 2024-01-26T16:11:14Z
  additionalBadges: [
    Badge.DA.CelestiaBlobstream,
    Badge.L3ParentChain.Arbitrum,
    Badge.RaaS.Caldera,
  ],
  additionalPurposes: ['NFT'],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'RARI Chain',
    slug: 'rari',
    description:
      'RARI Chain embeds royalties on the node level to guarantee royalty payments. A secure, low-cost, decentralized Ethereum L3 blockchain powered by Arbitrum.',
    links: {
      websites: ['https://rarichain.org/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=rari-mainnet&sourceChain=arbitrum-one',
      ],
      documentation: ['https://rari.docs.caldera.dev/'],
      explorers: ['https://mainnet.explorer.rarichain.org/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: ['https://twitter.com/RariChain'],
    },
  },
  rpcUrl: 'https://mainnet.rpc.rarichain.org/http',
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start  },
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMod4SqHjry4i0U=',
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x8bE956aB42274056ef4471BEb211b33e258b7324'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'rari',
    chainId: 1380012617,
    explorerUrl: 'https://mainnet.explorer.rarichain.org',
    explorerApi: {
      url: 'https://rari.calderaexplorer.xyz/api',
      type: 'blockscout',
    },
    blockscoutV2ApiUrl: 'https://rari.calderaexplorer.xyz/api/v2',
    minTimestampForTvl: new UnixTime(1705716145),
  },
  nonTemplateTechnology: {
    sequencing: {
      name: 'Espresso TEE sequencer',
      description: `Rari integrates with Espresso sequencing. 
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
  milestones: [
    {
      title: 'RARI Chain Mainnet Launch',
      url: 'https://x.com/RariChain/status/1750157295466824066',
      date: '2024-01-24T00:00:00.00Z',
      description: 'RARI Chain launches on Arbitrum One.',
      type: 'general',
    },
    {
      title: 'RARI integrates Celestia Blobstream',
      url: 'https://x.com/RariChain/status/1871209215324496336',
      date: '2024-12-19T00:00:00.00Z',
      description:
        'RARI is the first chain to integrate Celestia Blobstream DA bridge.',
      type: 'general',
    },
    {
      title: 'RARI integrates Espresso sequencer',
      url: 'https://x.com/EspressoSys/status/1884970716199895376',
      date: '2025-01-30T00:00:00.00Z',
      description:
        'RARI is the first chain to integrate Espresso TEE sequencer.',
      type: 'general',
    },
  ],
})
