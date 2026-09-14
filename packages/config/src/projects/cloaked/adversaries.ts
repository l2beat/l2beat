import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const STEALTH =
  'https://github.com/cloakedxyz/clkd-stealth/blob/9eb359efdd4ea31f5504bf81e57dcfe6f966dc14/src/'
const RECOVERY =
  'https://github.com/cloakedxyz/clkd-recovery/blob/b432a33873e2cfa4769807f8c95ed20a67234eed/src/'
const HOW_IT_WORKS = 'https://clkd.xyz/docs/how-it-works'
const API = 'https://clkd.xyz/openapi.json'
const PRIVACY = 'https://clkd.xyz/docs/privacy'

export const cloakedAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides the link between a receiving address and the recipient account from the public. The payer knows the address it was given. Sender, asset, amount and subsequent fund movements remain public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'A fresh receiving address has no public derivation linking it to the recipient account, but anyone can follow its funds through later sends and change outputs. Combining addresses exposes their joint use, while EIP-7702 delegation reveals the chosen account implementation without proving who owns the address or that only Cloaked uses that implementation.',
      advice:
        'Generate a fresh address for each receive, select separate address-held balances with Advanced Control when sending, and use destinations that have no public link to you.',
      sources: [
        {
          title: 'Address derivation from server-held ephemeral material',
          url: STEALTH + 'shared/genStealthAddress.ts#L17-L58',
        },
        {
          title: 'Input selection, visible change and EIP-7702 execution',
          url: HOW_IT_WORKS + '#sending-funds',
        },
        {
          title:
            'Quote API: spendableAddresses and reusable singleAddress mode',
          url: API,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        'No public recipient registry or announcement supplies an account-to-address mapping, but timing, distinctive amounts, recurring counterparties and consolidation can identify or cluster recipients.',
      advice:
        'Space out related payments and check whether amounts or recurring payment patterns identify you. Follow change outputs when assessing what a counterparty can trace.',
      sources: [
        {
          title: 'Documented transaction links and change handling',
          url: HOW_IT_WORKS + '#what-is-visible-onchain',
        },
        {
          title: 'Deterministic ephemeral keys stay offchain',
          url: STEALTH + 'shared/deriveDeterministicEphemeralKey.ts#L35-L68',
        },
        {
          title:
            'API permits repeated use; receive-once/spend-once is not enforced',
          url: API,
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      exposure:
        'Privacy against outside service providers remains unverified because the hosted client and backend are closed source, while the privacy policy lists RPC, hosting and analytics providers.',
      advice:
        'For independent recovery, derive keys locally and use your own node for address-specific reads, with Tor for broadcasts. A wallet RPC setting alone does not control hosted-service requests.',
      sources: [
        {
          contract: 'OffchainResolver',
          title:
            'CCIP-Read forwards the ENS query and verifies the returned answer',
        },
        {
          title:
            'Disclosed metadata, relay data and external service providers',
          url: PRIVACY,
        },
        {
          title:
            'Recovery derives address keys locally without Cloaked API calls',
          url: RECOVERY + 'lib/deriveKeys.ts#L31-L68',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'Cloaked receives the viewing capability and public spending key needed to regenerate past and future addresses within the shared derivation branch, associates quotes and activity with an account identifier, and states that its Incognito relay retains deposit-to-withdrawal associations. Users of the hosted wallet must trust its code with their client-side spending secrets.',
      advice:
        'Use an inspected local client to verify receiving-address derivations and transaction contents before signing. This protects the spending-key boundary but does not hide the shared address history from Cloaked.',
      sources: [
        {
          title:
            'Viewing branch and public spending key shared with the server',
          url: STEALTH + 'client/deriveServerBoundKeys.ts#L16-L53',
        },
        {
          title: 'Account-scoped addresses, quotes, submissions and pool state',
          url: API,
        },
        {
          title: 'Privacy policy: retained pool associations and account data',
          url: PRIVACY,
        },
        {
          contract: 'OffchainResolver',
          title: 'Signature and expiry checks do not prove recipient control',
        },
        {
          section: 'permissions',
          title: 'Owner can replace gateway and signer',
        },
        {
          section: 'upgrades-and-governance',
          title: 'Hosted-client trust boundary',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'The public chain lacks the ephemeral announcements needed to replay every address derivation, so breaking an individual stealth signing key does not by itself identify its parent account. Retained operator viewing material or address mappings still expose that history. Where account creation uses a deterministic wallet signature, recovering the login wallet key from an exposed public key permits reproducing signatures and trying all four-digit PINs, whereas independent passkey PRF secrets do not follow from breaking the passkey authentication public key.',
      advice:
        'Use the passkey PRF setup to avoid the wallet-signature dependency, while treating the address history shared with Cloaked as permanently disclosed to the service.',
      sources: [
        {
          title:
            'Stealth signing keys mix the spending key with a hashed secret',
          url: STEALTH + 'client/genStealthPrivateKey.ts#L17-L34',
        },
        {
          title:
            'Four-digit PIN and wallet address determine the signed message',
          url: STEALTH + 'client/genCloakedMessage.ts#L15-L48',
        },
        {
          title: 'Signature components are hashed into the account keys',
          url: STEALTH + 'client/genKeysFromSignature.ts#L23-L42',
        },
        {
          title: 'Independent secrets, including two WebAuthn PRF outputs',
          url: STEALTH + 'client/genKeys.ts#L7-L67',
        },
        {
          title: 'FIDO hmac-secret uses a separate random credential secret',
          url: 'https://fidoalliance.org/specs/fido-v2.1-ps-20210615/fido-client-to-authenticator-protocol-v2.1-ps-20210615.html#sctn-hmac-secret-extension',
        },
        { title: 'Operator data and retention', url: PRIVACY },
      ],
    },
  },
})
