import {
  ADVICE_SNIPPETS as A,
  adviceLink,
  definePrivacyAdversaries,
  toolLink,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

// zk.money Desktop v0.10.0, the reference client. vendor/oxide holds Oxide
// 3b5e1f7c8, the commit the approved enclave image builds from. The manifest
// names Oxide 3d8e29dc, with the portals, registry and PCR0 unchanged.
const ZKMONEY_REPO =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/f90b3f24ad4dbe936070c6abc38bffea047006ba/'
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
        "A DAI withdrawal hides among the DAI portal's depositors, an sUSDS one among the sUSDS portal's.",
      exposureContinued:
        "Each payment shows the payee the payer's Aztec address, and with it any name the payer claimed. The anonymity set is still small.",
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
          contract: 'OxidePortal',
          title:
            '371 depositors to 2026-11-10: 110 traced funders and 261 v5 migrations',
        },
        { contract: 'RegistrationSIPA' },
        {
          title: "Each payment's Transfer event names the payer to the payee",
          url: `${OXIDE}noir-projects/oxide_token_contract/src/main.nr#L155-L157`,
        },
        {
          contract: 'AccountMetadataRegistry',
          title: 'Names map to Aztec addresses',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort: `Alchemy, called under Aztec Labs' key, sees an account's deposit addresses and withdrawals in one session unless the user sets their own ${toolLink('ethereumNode')}.`,
      exposureContinued: `PublicNode receives each withdrawal recipient as it is entered, through an Optimism endpoint the settings do not replace. Desktop has no Tor setting, and Chrome's WalletConnect traffic uses UDP, which bypasses a ${adviceLink('Tor route', 'routes')} unless UDP is blocked.`,
      interior: {
        ...INTERIOR,
        sender: {
          verdict: 'atRisk',
          note: 'XMTP shows who asks whom for payment.',
        },
        linkage: {
          verdict: 'atRisk',
          note: "Private only with the user's own Ethereum node and all traffic through an IP-hiding route.",
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
          url: `${ZKMONEY_REPO}packages/web-wallet/src/config/env.ts#L666-L672`,
        },
        {
          title: 'Withdrawal recipients are checked on a fixed Optimism RPC',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/features/withdraw/etherfiCheck.ts#L91-L116`,
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
        'An AWS Nitro enclave reads payments, withdrawals and deposit claims, and wallets accept only one registered with an attestation of the approved image.',
      exposureContinued: `Aztec Labs' unsigned contract lists name the portal, and a new portal can approve another image. Aztec Labs' default ${toolLink('aztecNode', 'Aztec nodes')}, like Alchemy under its key, see an account's deposit addresses and withdrawals in one session. The resolver operator, Aztec Labs today, derives each deposit address paid through a name, so it knows the recipient.`,
      interior: {
        ...INTERIOR,
        sender: {
          verdict: 'atRisk',
          note: 'Private only while the attested enclave keeps what it reads.',
        },
        amount: {
          verdict: 'atRisk',
          note: 'Private only while the attested enclave keeps what it reads.',
        },
        linkage: {
          verdict: 'atRisk',
          note: "Private only with the user's own Aztec node, and while the attested enclave keeps what it reads.",
        },
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
          title: "Deposit claims ask the Aztec node for the deposit's message",
          url: `${ZKMONEY_REPO}packages/front-core/src/oxide/sipaClaim.ts#L133`,
        },
        {
          title: 'The resolver derives addresses paid through a name',
          url: `${ZKMONEY_REPO}packages/front-core/src/oxide/resolverPayments.ts#L164`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        "Whoever breaks elliptic-curve cryptography can decrypt the notes and events published to Ethereum, since each Aztec address is its owner's encryption key.",
      exposureContinued:
        "Each withdrawal publishes a record encrypted to its account, so it links to the account's registration deposit and to deposits paid through its name.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: "Messages are encrypted to the recipient's address",
          url: 'https://github.com/aztec-labs-eng/aztec-node/blob/v6.0.0/noir-projects/aztec-nr/aztec/src/messages/encryption/aes128.nr#L235-L266',
        },
        {
          contract: 'AccountMetadataRegistry',
          title: 'Names map to Aztec addresses',
        },
        {
          title: 'Each withdrawal emits a recovery record to its account',
          url: `${OXIDE}noir-projects/oxide_token_contract/src/main.nr#L317-L330`,
        },
        {
          title: 'Deposits paid through a name are announced to the recipient',
          url: `${OXIDE}noir-projects/oxide_token_contract/src/main.nr#L241-L252`,
        },
      ],
    },
  },
  advice: [
    {
      name: 'Set up',
      text: `Set your own ${toolLink('ethereumNode')} as the L1 endpoint. Send all traffic through ${toolLink('nymVpn')} with the Random profile, an IP-hiding route that carries UDP, under which contacts and payment requests fail. A system on Tor with UDP blocked, like ${toolLink('torSystems', 'Whonix')}, keeps them but must reach your node.`,
      against: ['networkObserver', 'privilegedInsider'],
      outside: true,
    },
    {
      name: 'Run a node',
      text: `Set your own ${toolLink('aztecNode')} in the endpoint settings.`,
      against: ['privilegedInsider'],
      outside: true,
    },
    {
      name: 'Register',
      text: 'Claim your name from a wallet without a public link to you.',
      against: ['publicObserver'],
    },
    {
      name: 'Deposit',
      text: 'Fund each deposit address once and let it be swept. Give outside payers a deposit address your wallet created.',
      against: ['publicObserver', 'privilegedInsider'],
    },
    {
      name: 'Wait',
      text: A.wait,
      against: ['chainAnalyst'],
      randomWait: true,
    },
    {
      name: 'Withdraw',
      text: `${A.commonAmounts} ${A.freshAddress}`,
      against: ['chainAnalyst'],
    },
  ],
})
