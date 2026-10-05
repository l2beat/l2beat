import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const DOCS = 'https://docs.zk.money/docs/'
// Public source of the zk.money desktop release. vendor/oxide holds the Oxide
// sources, which match the deployed Oxide commit a534df2f.
const ZKMONEY_REPO =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/fc37a3e25440bc4bd7a9de81a7f4830ec753a4d4/'
const OXIDE = `${ZKMONEY_REPO}vendor/oxide/`
// The resolver circuit was vendored after the pinned desktop release.
const RESOLVER_CIRCUIT =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/68425f9cf408ac803eade04d10318fcf345444a0/vendor/oxide/noir-projects/resolver_circuit/'

export const zkMoneyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides senders, amounts and links between deposits and withdrawals within the ledger. Tags, deposits and withdrawals are public. The first payment to a new contact reveals the recipient, and the first sponsored transaction after registration reveals the sender’s account.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure: `Private payments publish encrypted notes. Fixed log tags identify zk.money transactions on Aztec, and the first payment to a new contact reveals the recipient's Aztec address through a handshake. The Ethereum registry maps that address to a tag. The first sponsored transaction after registration also identifies the sender's account. ${S.entryExitPublic()} Claiming a tag links it and the Aztec address to the funding L1 wallet.`,
      advice:
        'Claim your tag from a wallet with no public link to you and fund each deposit address once. Wait for deposits to be swept. Recovering them reveals the link to your account.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Your first sponsored transaction after registration is publicly tied to your account.',
        },
        recipient: {
          verdict: 'exposed',
          note: "The first payment to a new contact reveals the recipient's Aztec address.",
        },
        amount: 'private',
        asset: {
          verdict: 'exposed',
          note: 'zk.money only holds DAI.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'If your first sponsored transaction after registration is a payment to a new contact, it shows both ends.',
        },
      },
      sources: [
        {
          title: 'Fixed log tags on every zk.money transaction',
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
          title: 'Withdrawals publish their L1 payload',
          url: `${OXIDE}noir-projects/oxide_token_contract/src/withdrawal.nr#L32-L42`,
        },
        { contract: 'RegistrationController' },
        { contract: 'AccountMetadataRegistry' },
        { contract: 'DepositSIPA' },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'The anonymity set is limited to zk.money users. The first payment to a tag from outside zk.money is publicly tied to that tag. Anyone who records Aztec transactions can also tie the first deposit address your wallet creates after registration to your account.',
      advice: `Watch the anonymity set in this early stage. Give outside payers a deposit address your wallet created instead of your tag. Fund your first deposit address after registration from the wallet that claimed your tag. ${S.commonAmounts} ${S.freshExit}`,
      interior: {
        sender: 'atRisk',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Inferable when a payment sits between a matching public deposit and withdrawal.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Registration deposits are publicly tied to their tag.',
        },
      },
      sources: [
        { contract: 'ZkMoneyPortal' },
        { contract: 'RegistrationSIPA' },
        { contract: 'PlainWithdrawalExecutor' },
        {
          title: 'Private transfers credit the recipient with new notes',
          url: `${OXIDE}noir-projects/oxide_token_contract/src/main.nr#L133-L167`,
        },
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
          url: 'https://github.com/AztecProtocol/aztec-packages/blob/v5.2.0/noir-projects/noir-contracts/contracts/standard/handshake_registry_contract/src/main.nr#L82-L96',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'Keys and proving stay on your device. Note discovery reveals your account address to the Aztec node. Ethereum RPC requests reveal funding wallets, deposit addresses and L1 transaction senders. XMTP carries payment requests and contact links under public account addresses, exposing who asks whom for money. Both wallets support custom Aztec, Ethereum and enclave endpoints.',
      advice:
        'Use zk.money Desktop with your own Aztec and Ethereum nodes. Send L1 transactions from your Ethereum wallet over a public RPC. Route all computer traffic through a VPN or Tor. Avoid payment requests and contact links with counterparties that must stay private.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Payment requests over XMTP show who asks whom.',
        },
        recipient: 'exposed',
        amount: 'private',
        asset: 'exposed',
        linkage: 'atRisk',
      },
      sources: [
        {
          title: 'Desktop endpoint overrides',
          url: `${ZKMONEY_REPO}packages/web-wallet-desktop/src/config.js#L36-L47`,
        },
        {
          title: 'Handshakes are found by a tag derived from your address',
          url: 'https://github.com/AztecProtocol/aztec-packages/blob/v5.2.0/noir-projects/noir-contracts/contracts/standard/handshake_registry_contract/src/main.nr#L82-L96',
        },
        {
          title: 'L1 gas estimates over the wallet RPC carry your address',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/features/deposit/sipaRecovery.ts#L166-L193`,
        },
        {
          title: 'Desktop sends screening to zk.money from its own process',
          url: `${ZKMONEY_REPO}packages/web-wallet-desktop/scripts/compose-config.js#L15-L20`,
        },
        {
          title: 'XMTP identity is the account bootstrap address',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/platform/xmtp/WebXmtpClient.ts#L95-L109`,
        },
        {
          title: 'Pointing the wallet at a different service',
          url: `${DOCS}desktop`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'Wallets encrypt payments, withdrawals and deposit claims to an enclave key registered in the portal. The approved code decrypts them inside the enclave. Privacy against the operator depends on AWS Nitro and that code, whose binary has not been reproduced. The resolver operator can re-derive all deposit addresses, including those created by your wallet, linking L1 deposits to L2 recipients.',
      advice:
        "Run your own enclave, which is permissionless onchain but still depends on AWS. Running your own resolver operator is also permissionless, but its service is unpublished and the released wallets only use Aztec Labs' operator.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Enclave requests carry notes and the nullifier hiding key',
          url: `${OXIDE}yarn-project/oxide-lib/src/types.ts#L336-L392`,
        },
        {
          title: 'Wallets encrypt to the enclave key registered in the portal',
          url: `${OXIDE}yarn-project/oxide-client/src/fleet_signer.ts#L172-L202`,
        },
        {
          title: 'Deposit address secrets derive from the resolver key',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaStealth.ts#L80-L100`,
        },
        {
          title:
            'The resolver circuit derives each secret from the operator key',
          url: `${RESOLVER_CIRCUIT}src/main.nr#L23-L79`,
        },
        {
          title: 'Self-made deposit addresses use predictable nonces',
          url: `${ZKMONEY_REPO}packages/sdk/src/services/sipaSelfResolve.ts#L47-L53`,
        },
        {
          title: 'Addresses are sent to Predicate for screening',
          url: `${ZKMONEY_REPO}packages/front-core/src/core/services/screening/PredicateScreeningService.ts#L86-L97`,
        },
        { contract: 'ZkMoneyPortal', title: 'Registered TEE signers' },
        { contract: 'Resolver' },
        { contract: 'AccountMetadataRegistry', title: 'Resolver operators' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'A quantum computer that breaks elliptic-curve key exchange can decrypt historical notes and payment events published to Ethereum. Registered Aztec addresses identify the accounts. Deposit address secrets and enclave communication use the same class of cryptography.',
      advice: S.permanentlyDisclosed('every payment and every deposit link'),
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
