import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

// zk.money Desktop v0.8.0, the reference client. vendor/oxide holds Oxide
// 3b5e1f7c8, between the portals' deployment commit bd000cc and the manifest's
// 9178280. The core contracts and the enclave app are identical in all three.
const ZKMONEY_REPO =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/8fd198412a956f214639b5782d3a86e3d47ca60e/'
const OXIDE = `${ZKMONEY_REPO}vendor/oxide/`
const HANDSHAKE_REGISTRY =
  'https://github.com/aztec-labs-eng/aztec-node/blob/v6.0.0/noir-projects/noir-contracts/contracts/standard/handshake_registry_contract/src/main.nr#L75-L94'

const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: {
    verdict: 'exposed',
    note: 'Revealed by the first payment to each new contact.',
  },
  amount: 'private',
  asset: {
    verdict: 'exposed',
    note: 'DAI and sUSDS use separate portals and token contracts.',
  },
  linkage: 'private',
}

export const zkMoneyV6Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides senders, amounts and the link between deposits and withdrawals inside the ledger. Names, deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort: 'Private payments publish encrypted notes.',
      exposureContinued:
        'Claiming a name ties it, its Aztec address and its registration deposit address to the wallet that funds the claim. The first payment to a new contact reveals the recipient through a handshake. L2 logs mark every transaction of the shared token contract.',
      advice:
        'Claim the name from a wallet without a public link to the user. Fund each deposit address once and let it be swept.',
      interior: INTERIOR,
      sources: [
        {
          title: 'Fixed log tags on every token transaction',
          url: `${OXIDE}noir-projects/oxide_lib/src/constants.nr#L78-L82`,
        },
        {
          title:
            'Handshake announcements are tagged with the recipient address',
          url: HANDSHAKE_REGISTRY,
        },
        {
          contract: 'NameRegistry',
          title: 'Name claims publish the claiming account',
        },
        {
          contract: 'AccountMetadataRegistry',
          title: 'Names map to Aztec addresses',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        "In practice the anonymity set is zk.money's users on Aztec, although the L2 contract is permissionless.",
      exposureContinued:
        'The first payment to a name from outside zk.money is publicly tied to that name. A migrated v5 balance arrives as one deposit of its full amount, in the same transaction as its v5 refund. A payee can tell which payments come from the same payer, since each pair shares one secret for tagging notes.',
      advice: `Give outside payers a deposit address the user's wallet created. ${S.commonAmounts} ${S.freshExit}`,
      interior: {
        ...INTERIOR,
        amount: {
          verdict: 'atRisk',
          note: 'Inferable when a payment sits between a matching public deposit and withdrawal.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'Registration deposits are publicly tied to their name.',
        },
      },
      sources: [
        {
          contract: 'MigrationExecutor',
          title: 'Each v5 refund is deposited into the v6 portal',
        },
        { contract: 'RegistrationSIPA' },
        {
          title: 'Resolver notifies the recipient of each deposit address',
          url: `${OXIDE}noir-projects/oxide_token_contract/src/main.nr#L237-L251`,
        },
        {
          title:
            'The notification and the sweep request share one Aztec transaction',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaIntents.ts#L343-L358`,
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        "Alchemy, called under Aztec Labs' key, sees an account's deposit addresses and withdrawals in one session unless the user sets their own Ethereum node.",
      exposureContinued:
        "Desktop has no Tor setting. Routing all of the computer's traffic through Tor works, but Chrome's QUIC traffic to WalletConnect bypasses Tor unless UDP is blocked.",
      advice:
        "Set the user's own Ethereum node as the L1 endpoint. Run Desktop on a system that sends all traffic through Tor and blocks UDP, such as Whonix.",
      interior: {
        ...INTERIOR,
        sender: {
          verdict: 'atRisk',
          note: 'XMTP shows who asks whom for payment.',
        },
        linkage: {
          verdict: 'atRisk',
          note: "Private only with the user's own Ethereum node and all traffic through Tor.",
        },
      },
      sources: [
        {
          title:
            'Endpoint settings: Aztec node, old-network node, L1 RPC and enclave',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/config/endpointOverrides.ts#L17`,
        },
        {
          title: 'Every L1 client reads the configured L1 RPC',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/config/env.ts#L405-L445`,
        },
        {
          title: 'XMTP identity is the account bootstrap address',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/platform/xmtp/WebXmtpClient.ts#L95-L109`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        'An AWS Nitro enclave reads payments, withdrawals and deposit claims, and the image it runs is unpublished.',
      exposureContinued:
        "Wallets accept only an enclave registered for the approved image, but nobody outside Aztec Labs can obtain or rebuild that image. Aztec Labs' default Aztec nodes, like Alchemy under its key, see an account's deposit addresses and withdrawals in one session. The resolver operator, Aztec Labs today, derives each deposit address paid through a name, so it knows the recipient.",
      interior: {
        ...INTERIOR,
        sender: 'exposed',
        amount: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Wallets accept only enclaves whose keys the registry holds',
          url: `${OXIDE}yarn-project/oxide-client/src/fleet_signer.ts#L165-L191`,
        },
        {
          contract: 'TeeRegistry',
          title: 'One approved image for both portals',
        },
        {
          title: 'The image list has no download for the approved image',
          url: 'https://docs.zk.money/docs/run-an-enclave',
        },
        {
          title: 'The resolver derives addresses paid through a name',
          url: `${ZKMONEY_REPO}packages/front-core/src/oxide/resolverPayments.ts#L171`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'Whoever breaks elliptic-curve cryptography can decrypt historical notes and payment events published to Ethereum.',
      exposureContinued:
        'Registered Aztec addresses identify the accounts. Deposit addresses paid through a name and enclave communication use the same class of cryptography.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'AccountMetadataRegistry',
          title: 'Registered Aztec addresses',
        },
        {
          title: 'Addresses paid through a name use secp256k1 key exchange',
          url: `${ZKMONEY_REPO}packages/front-core/src/oxide/resolverPayments.ts#L171`,
        },
        {
          title: 'Enclave channel uses P-256 HPKE',
          url: `${OXIDE}yarn-project/oxide-lib-tee/src/encryption.ts#L1-L3`,
        },
      ],
    },
  },
})
