import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const DOCS = 'https://docs.zk.money/docs/'
// TODO: both repositories are private until launch, check that these links
// resolve before publishing.
const OX =
  'https://github.com/aztec-labs-eng/oxide/blob/a534df2ff35b22d11bf38ed06c0c22ed6b3a2cd9/'
const OW =
  'https://github.com/aztec-labs-eng/obsidion-wallet/blob/fcc6424c9492b3b6103c36ae3bab9d77ac30b2bf/'

export const zkMoneyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides senders, amounts and the link between deposit and withdrawal inside the ledger. Tags, deposits and withdrawals are public, and the first payment to a new contact reveals the recipient.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure: `Payments inside publish only encrypted notes, but fixed log tags mark every zk.money transaction on Aztec. The first payment to a new contact publishes a handshake tagged with the recipient's Aztec address, which the registry on Ethereum maps to a tag. ${S.entryExitPublic()} The deposit that claims a tag ties the funding L1 wallet to the tag and its Aztec address.`,
      advice:
        'Claim your tag from a wallet with no public link to you and fund every deposit address only once. Leave funds in a deposit address until they are swept, since recovering them publishes the link to your account.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Your first sponsored transaction on Aztec is publicly tied to your account.',
        },
        recipient: {
          verdict: 'exposed',
          note: "The first payment to a new contact publishes the recipient's Aztec address.",
        },
        amount: 'private',
        asset: {
          verdict: 'exposed',
          note: 'zk.money only holds DAI.',
        },
        linkage: {
          verdict: 'atRisk',
          note: 'Reusing or recovering a deposit address links it to your account.',
        },
      },
      sources: [
        {
          title: 'Fixed log tags on every zk.money transaction',
          url: `${OX}noir-projects/oxide_lib/src/constants.nr#L77-L81`,
        },
        {
          title: 'First delivery to a new contact opens a handshake',
          url: `${OW}packages/sdk/src/feePaymentMethod/claimFpcGasModel.ts#L232-L237`,
        },
        {
          title: 'First sponsored transaction nullifies the L1 account',
          url: `${OW}packages/contracts/contracts/fee_paying/claim_fpc/src/main.nr#L205-L217`,
        },
        {
          title: 'Withdrawals publish their L1 payload',
          url: `${OX}noir-projects/oxide_token_contract/src/withdrawal.nr#L32-L42`,
        },
        { contract: 'RegistrationController' },
        { contract: 'AccountMetadataRegistry' },
        { contract: 'DepositSIPA' },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'The anonymity set is limited to zk.money users. The first payment to a tag from outside zk.money is publicly tied to that tag.',
      advice: `Watch the anonymity set in this early stage. Give outside payers a deposit address your wallet created instead of your tag. ${S.commonAmounts} ${S.freshExit}`,
      interior: {
        sender: 'atRisk',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by the public deposits into an account.',
        },
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'The anonymity set is too small for care to hide the link.',
        },
      },
      sources: [
        { contract: 'ZkMoneyPortal' },
        { contract: 'RegistrationSIPA' },
        { contract: 'PlainWithdrawalExecutor' },
        {
          title:
            'Resolver notifies the recipient and requests the sweep in one transaction',
          url: `${OX}yarn-project/resolver-service/src/sipa_broadcaster.ts#L138-L148`,
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
        'Keys, proving and note discovery stay on your device, and zk.money Desktop can use your own Aztec node, Ethereum RPC and enclave. Payment requests and contact links travel over XMTP under your public account address, which shows XMTP nodes who asks whom for money.',
      advice:
        'Use zk.money Desktop with your own Aztec node and Ethereum RPC and route its traffic through Tor. Settle payments with counterparties that must stay private without payment requests or contact links.',
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
          title: 'Desktop endpoint settings',
          url: `${OW}packages/web-wallet-desktop/src/config.js#L54-L61`,
        },
        {
          title: 'XMTP identity is the account bootstrap address',
          url: `${OW}packages/web-wallet/src/platform/xmtp/WebXmtpClient.ts#L95-L109`,
        },
        { title: 'Using the desktop app', url: `${DOCS}desktop` },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'Every payment, withdrawal and deposit claim reaches an enclave in plaintext, so privacy against its operator rests on AWS Nitro and on the approved enclave code. The resolver operator can re-derive every deposit address, including those your wallet creates itself, and so ties each deposit from L1 to its recipient on L2.',
      advice:
        'Use zk.money Desktop, started from its baked contract list and pointed at your own Aztec node and Ethereum RPC, instead of the hosted web wallet. Nothing you do hides your operations from the enclave or your deposits from the resolver operator. Registering a TEE yourself depends only on AWS as a counterparty, the onchain step is permissionless.',
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
          url: `${OX}yarn-project/oxide-lib/src/types.ts#L336-L392`,
        },
        {
          title: 'Deposit address secrets derive from the resolver key',
          url: `${OW}packages/sdk/src/services/sipaStealth.ts#L80-L100`,
        },
        {
          title: 'Self-made deposit addresses use predictable nonces',
          url: `${OW}packages/sdk/src/services/sipaSelfResolve.ts#L47-L53`,
        },
        {
          title: 'Addresses are sent to Predicate for screening',
          url: `${OW}packages/front-core/src/core/services/screening/PredicateScreeningService.ts#L86-L97`,
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
        "Notes and payment events are encrypted with elliptic-curve key exchange and published to Ethereum, and every user's Aztec address is registered on Ethereum, so a quantum computer decrypts the whole ledger history. Deposit address secrets and the channel to the enclave also rely on elliptic-curve key exchange.",
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
          url: `${OW}packages/sdk/src/services/sipaStealth.ts#L80-L100`,
        },
        {
          title: 'Enclave channel uses P-256 HPKE',
          url: `${OX}yarn-project/oxide-lib/src/encryption.ts#L1-L5`,
        },
      ],
    },
  },
})
