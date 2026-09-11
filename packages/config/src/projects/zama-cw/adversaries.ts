import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by .flat/ConfidentialUSDCWrapper, .flat/ACL, .flat/KMSVerifier,
// .flat/ProtocolConfig, discovered.json (Ethereum + gateway chain), the
// protocol-apps wrapper source (commit 85eef95c), the OpenZeppelin ERC-7984
// implementation (commit 23ba1540), the fhevm host contracts (commit 94f1f3b3),
// the kms repo (commit b5cd5cf4) and the relayer-sdk (commit d06f1e58).
// Measurements as of 2026-09-11, block 25,953,020. USDC wrapper since
// deployment: 2,710 wraps to 1,382 recipients, 1,523 unwraps, 2,573
// confidential transfers between 925 accounts; 645 of 1,552 holders (41.6%)
// never made a confidential transfer, so their balance is exactly public.
// KMS: 13 signers, MPC threshold 4, public decryption 7, user decryption 9.
// InputVerifier: 1 coprocessor signer. No observer or pauser set on any token.
const OZ =
  'https://github.com/OpenZeppelin/openzeppelin-confidential-contracts/blob/23ba15402346027f2416667acbb1e741179f8485/contracts/token/ERC7984/'
const WRAPPER =
  'https://github.com/zama-ai/protocol-apps/blob/85eef95c797da20875fe7eeae7f8d212d760486f/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol'
const FHEVM =
  'https://github.com/zama-ai/fhevm/blob/94f1f3b35c71175dc68bb36887e0525f7c5d80c5/'
const KMS =
  'https://github.com/zama-ai/kms/blob/b5cd5cf465dc488ff04ac8c19f3ef12877abffa0/'
const RELAYER_SDK =
  'https://github.com/zama-ai/relayer-sdk/blob/d06f1e585a78181135cb602109e5fa3da523b48d/src/'

export const zamaCwAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'amount',
    text: 'Hides transfer amounts. Who pays whom, and every wrap and unwrap amount, is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Only the amount of a confidential transfer is hidden. The history of who pays whom, every wrap and unwrap amount and the ciphertext handles and timestamps are public. Either party to a transfer can later publish its amount onchain.',
      advice:
        'Treat every counterparty as able to disclose the amount they paid or received.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { contract: 'ConfidentialUSDCWrapper' },
        {
          title: 'Failed transfer moves an encrypted zero',
          url: OZ + 'ERC7984.sol#L336-L352',
        },
        {
          title: 'Unwrap makes the burned amount publicly decryptable',
          url: OZ + 'extensions/ERC7984ERC20Wrapper.sol#L262-L268',
        },
        {
          title: 'Either party can request disclosure of a transfer amount',
          url: OZ + 'ERC7984.sol#L202-L209',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        "Since all wraps and unwraps are public, an account's balance is bounded by what went in and out, and exact for any account that never made a confidential transfer. Transfer partners and timing are public, so a wrap, a transfer and an unwrap in a row pair up by amount.",
      advice:
        'Keep funds wrapped and transfer often, even just for zero amounts. Do not unwrap right after receiving, and do not unwrap an amount that matches a recent wrap or a known payment. An adversary more powerful than the public observer is not effectively countered by this protocol.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by public wrap and unwrap totals; exact for accounts without confidential transfers.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { contract: 'ConfidentialUSDCWrapper' },
        {
          title: 'Wrap event carries the clear rounded amount',
          url: OZ + 'extensions/ERC7984ERC20Wrapper.sol#L256',
        },
        {
          title: 'ERC-7984: public sender, recipient and handle per transfer',
          url: 'https://eips.ethereum.org/EIPS/eip-7984',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'Amounts are encrypted on your device and never leave it in clear. The default hosted relayer, which needs an API key from the operator, receives your address and the token contract with every encrypted input and every balance view, so it learns who transacts and when, plus your IP. The amount stays hidden from it.',
      advice: 'Route the relayer requests through Tor or a VPN.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Hosted relayer URL',
          url: RELAYER_SDK + 'configs.ts#L7',
        },
        {
          title: 'Encrypted input bound to user and contract address',
          url: RELAYER_SDK + 'relayer/sendEncryption.ts#L136-L145',
        },
        {
          title: 'Balance view request carries user address and handles',
          url: RELAYER_SDK + 'relayer/userDecrypt.ts#L288-L297',
        },
        {
          title: 'Mainnet relayer needs an API key',
          url: 'https://docs.zama.org/protocol/sdk/guides/relayer-api-keys',
        },
        {
          title: 'Self-hosting a relayer',
          url: FHEVM + 'relayer/docs/SELF_HOSTING.md',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'KMS operators share one FHE key with a threshold, so they can collude and decrypt every balance and transfer ever made. Each token owner can appoint an observer with a wildcard, never-expiring view of all balances and amounts of that token, with no delay. The same owner can upgrade the tokens and the ACL without delay, and the KMS decrypts whatever the ACL permits. The coprocessor and the relayer compute on and forward ciphertexts only.',
      advice:
        'Watch for ObserverAdded events and upgrades on your token, there is no delay to react. Nothing you do prevents a KMS collusion.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'exposed',
          note: 'To colluding KMS operators, to the token owner via upgrade, or to any owner-appointed observer.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'ConfidentialUSDCWrapper',
          title: 'Wrapper (addObserver, blockUser, upgrade)',
        },
        { contract: 'ProtocolConfig', title: 'KMS signers and thresholds' },
        { contract: 'ACL', title: 'Access control the KMS honors' },
        { section: 'permissions' },
        {
          title: 'Observer gets a wildcard delegation without expiration',
          url: WRAPPER + '#L395-L403',
        },
        {
          title: 'Wrapper upgrade authorized by the owner alone',
          url: WRAPPER + '#L497',
        },
        {
          title: 'ACL upgrade authorized by the owner alone',
          url: FHEVM + 'host-contracts/contracts/ACL.sol#L654',
        },
        {
          title: '13 KMS parties with threshold t = 4',
          url: KMS + 'ai-docs/ARCHITECTURE.md#L22-L23',
        },
        {
          title: 'Shamir sharing with t < n/3 (TKMS announcement)',
          url: 'https://www.zama.ai/post/introducing-zama-threshold-key-management-system-tkms',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'The encryption is lattice-based and survives quantum computers, but every ciphertext is publicly downloadable today and one long-lived key protects them all. If enough key shares ever leak, the entire history is exposed. Balance views travel to you under a post-quantum key exchange.',
      advice:
        'Assume that whatever you hold today may be decrypted if the key holders are ever compromised.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Lattice cryptography and one long-lived key.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Coprocessor ciphertext store (public listing)',
          url: 'https://coprocessor-1.mainnet.zama.org/?max-keys=3',
        },
        {
          title: 'ML-KEM hybrid encryption of decryption shares',
          url: KMS + 'core/service/src/cryptography/hybrid_ml_kem.rs',
        },
        {
          title: 'Key resharing and key switching in the KMS',
          url: 'https://docs.zama.org/protocol/protocol/overview/kms',
        },
      ],
    },
  },
})
