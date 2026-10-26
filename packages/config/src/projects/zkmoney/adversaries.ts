import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

// zk.money Desktop v0.5.0, the reference client. vendor/oxide holds Oxide
// 20fcd8093, while the DAI portal runs Oxide a534df2f. The linked Oxide lines
// are identical in both.
const ZKMONEY_REPO =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/00e54087526d6d89f1755958eb027e077184cd9a/'
const OXIDE = `${ZKMONEY_REPO}vendor/oxide/`
const HANDSHAKE_REGISTRY =
  'https://github.com/AztecProtocol/aztec-packages/blob/v5.2.0/noir-projects/noir-contracts/contracts/standard/handshake_registry_contract/src/main.nr#L82-L96'

const INTERIOR: PrivacyExposureMap = {
  sender: {
    verdict: 'atRisk',
    note: "Public for the user's first sponsored transaction after registration.",
  },
  recipient: {
    verdict: 'exposed',
    note: 'Revealed by the first payment to each new contact.',
  },
  amount: 'private',
  asset: {
    verdict: 'exposed',
    note: 'DAI and sUSDS use separate portals and token contracts.',
  },
  linkage: {
    verdict: 'atRisk',
    note: "Exposed when the user's first sponsored transaction after registration withdraws or pays a new contact.",
  },
}

export const zkMoneyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides senders, amounts and the link between deposits and withdrawals inside the ledger. Names, deposits and withdrawals are public.',
  },
  cells: {
    // Green rests on advice the wallet never surfaces: make the first sponsored
    // transaction after registration a deposit. Revisit if hidden advice stops
    // earning a colour. Wallet fix to propose: an empty subscribe right after
    // registration, the SDK's subscribe[registration,authorize_intents].
    publicObserver: {
      sentiment: 'good',
      exposureShort: 'Private payments publish encrypted notes.',
      exposureContinued:
        "Claiming a name ties it and its Aztec address to the wallet that funds the registration. The first payment to a new contact reveals the recipient through a handshake, and L2 logs mark every transaction of the shared token smart contract. The user's first sponsored transaction after registration is tied to their account, with the payment, deposit address or withdrawal it carries.",
      advice:
        "Claim the user's name from a wallet without a public link to them, then make the first transaction after registration a deposit from that wallet. Fund each deposit address once and let it be swept/relayed.",
      interior: INTERIOR,
      sources: [
        {
          title: 'Fixed log tags on every token transaction',
          url: `${OXIDE}noir-projects/oxide_lib/src/constants.nr#L82-L86`,
        },
        {
          title: 'First delivery to a new contact opens a handshake',
          url: `${ZKMONEY_REPO}packages/sdk/src/feePaymentMethod/claimFpcGasModel.ts#L232-L237`,
        },
        {
          title: 'First sponsored transaction nullifies the L1 account',
          url: `${ZKMONEY_REPO}packages/contracts/contracts/fee_paying/claim_fpc/src/main.nr#L205-L217`,
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
        'The first payment to a name from outside zk.money is publicly tied to that name. A payee can tell which payments come from the same payer, since each pair shares one secret for tagging notes. Moving a whole savings position out republishes the share amount it went in with.',
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
        { contract: 'RegistrationSIPA' },
        {
          title: 'Resolver notifies the recipient of each deposit address',
          url: `${OXIDE}noir-projects/oxide_token_contract/src/main.nr#L236-L251`,
        },
        {
          title:
            'The notification and the sweep request share one Aztec transaction',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaIntents.ts#L174-L189`,
        },
        {
          title:
            'Handshake announcements are tagged with the recipient address',
          url: HANDSHAKE_REGISTRY,
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
        'Set your own Ethereum node as the L1 endpoint, and run Desktop on a system that sends all traffic through Tor and blocks UDP, such as Whonix.',
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
          title: 'Endpoint settings: Aztec node, L1 RPC and enclave only',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/config/endpointOverrides.ts#L1-L16`,
        },
        {
          title: 'XMTP identity is the account bootstrap address',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/platform/xmtp/WebXmtpClient.ts#L95-L109`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'warning',
      exposureShort:
        'An AWS Nitro enclave reads payments, withdrawals and deposit claims inside.',
      exposureContinued:
        "The portal admits only enclaves whose attestation it verifies onchain and approved enclave images are immutable. The sUSDS portal's approved image is unpublished, as is its source. Aztec Labs' default Aztec node, like Alchemy under its key, sees an account's deposit addresses and withdrawals in one session. The resolver operator, Aztec Labs today, derives each deposit address paid through a name, so it knows the recipient.",
      advice:
        'Set your own Aztec node and Ethereum node in the endpoint settings, and keep funds out of savings.',
      interior: {
        ...INTERIOR,
        sender: {
          verdict: 'atRisk',
          note: 'Private only after the first sponsored transaction, and while the attested enclave keeps what it reads.',
        },
        amount: {
          verdict: 'atRisk',
          note: 'Private only while the attested enclave keeps what it reads.',
        },
        linkage: {
          verdict: 'atRisk',
          note: "Private only with the user's own nodes, and while the attested enclave keeps what it reads.",
        },
      },
      sources: [
        {
          title: 'Saved endpoints replace the default Aztec node and L1 RPC',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/config/env.ts#L407-L412`,
        },
        {
          title: 'The resolver derives addresses paid through a name',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaStealth.ts#L88-L109`,
        },
        {
          title: 'Wallets encrypt to the enclave key registered in the portal',
          url: `${OXIDE}yarn-project/oxide-client/src/fleet_signer.ts#L172-L202`,
        },
        {
          title: 'The image list has no download for the sUSDS image',
          url: 'https://docs.zk.money/docs/run-an-enclave',
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
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaStealth.ts#L88-L109`,
        },
        {
          title: 'Enclave channel uses P-256 HPKE',
          url: `${OXIDE}yarn-project/oxide-lib/src/encryption.ts#L1-L5`,
        },
      ],
    },
  },
})
