import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

// zk.money Desktop v0.1.0, the reference client. vendor/oxide holds the Oxide
// sources, which match the deployed Oxide commit a534df2f.
const ZKMONEY_REPO =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/f04743f5d57d1b89f9190cad0f6affd28b0793f2/'
const OXIDE = `${ZKMONEY_REPO}vendor/oxide/`
const HANDSHAKE_REGISTRY =
  'https://github.com/AztecProtocol/aztec-packages/blob/v5.2.0/noir-projects/noir-contracts/contracts/standard/handshake_registry_contract/src/main.nr#L82-L96'

const INTERIOR: PrivacyExposureMap = {
  sender: {
    verdict: 'atRisk',
    note: 'Public for your first sponsored transaction after registration.',
  },
  recipient: {
    verdict: 'exposed',
    note: 'Revealed by the first payment to each new contact.',
  },
  amount: 'private',
  asset: { verdict: 'exposed', note: 'Only DAI.' },
  linkage: {
    verdict: 'atRisk',
    note: 'Exposed when your first sponsored transaction after registration withdraws or pays a new contact.',
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
        'Claiming a name ties it and its Aztec address to the wallet that funds the registration. The first payment to a new contact reveals the recipient through a handshake, and L2 logs mark every transaction of the shared token smart contract. Your first sponsored transaction after registration is tied to your account, with the payment, deposit address or withdrawal it carries.',
      advice:
        'Claim your name from a wallet with no public link to you, and make your first transaction after registration a deposit from that wallet. Fund each deposit address once and let it be swept/relayed.',
      interior: INTERIOR,
      sources: [
        {
          title: 'Fixed log tags on every token transaction',
          url: `${OXIDE}noir-projects/oxide_lib/src/constants.nr#L77-L81`,
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
        'The first payment to a name from outside zk.money is publicly tied to that name.',
      advice: `Give outside payers a deposit address your wallet created. ${S.commonAmounts} ${S.freshExit}`,
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
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaIntents.ts#L171-L186`,
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
        'Anyone on your network path sees when you send Aztec transactions and can match your deposit and withdrawal to the blocks they land in.',
      exposureContinued: 'Desktop has no Tor or proxy setting.',
      advice: 'Route zk.money Desktop through Tor with system-wide tools.',
      interior: {
        ...INTERIOR,
        sender: {
          verdict: 'atRisk',
          note: 'XMTP shows who asks whom for payment.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'Private only over Tor, which Desktop lacks.',
        },
      },
      sources: [
        {
          title: 'Desktop settings: endpoints only, no proxy',
          url: `${ZKMONEY_REPO}packages/web-wallet-desktop/src/config.js#L36-L47`,
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
        'The wallets derive their own deposit addresses from an ECDH secret shared with the resolver operator, Aztec Labs today.',
      exposureContinued:
        'Matching the derived commitments against public portal deposits lets the operator link L1 deposits to L2 recipients. Payments, withdrawals and deposit claims are encrypted to an enclave admitted with an AWS Nitro attestation, which reads them inside.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Wallets derive deposit addresses against the resolver key',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/features/deposit/sipaGateway.ts#L857-L871`,
        },
        {
          title: 'Their nonces count down a predictable range',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaSelfResolve.ts#L49-L58`,
        },
        {
          title: 'Wallets encrypt to the enclave key registered in the portal',
          url: `${OXIDE}yarn-project/oxide-client/src/fleet_signer.ts#L172-L202`,
        },
        {
          contract: 'ZkMoneyPortal',
          title: 'Deposits publish the recipient commitment',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'Whoever breaks elliptic-curve cryptography can decrypt historical notes and payment events published to Ethereum.',
      exposureContinued:
        'Registered Aztec addresses identify the accounts. Deposit address secrets and enclave communication use the same class of cryptography.',
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
          title: 'Deposit address secrets use secp256k1 key exchange',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaStealth.ts#L80-L100`,
        },
        {
          title: 'Enclave channel uses P-256 HPKE',
          url: `${OXIDE}yarn-project/oxide-lib/src/encryption.ts#L1-L5`,
        },
      ],
    },
  },
})
