import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const CORE =
  'https://github.com/pantherfoundation/panther-core/blob/0b078c8398de69a21b77e24405d86bdf3401fc82/'
const CONTRACTS = CORE + 'contracts/contracts/protocol/v1/'
const CIRCUITS = CORE + 'circuits/circuits/'

export const pantherAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides who pays whom inside the pool and which deposits fund a withdrawal. Deposits, withdrawals and swaps are public, and every transaction is encrypted to the compliance operators.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure: `Internal transfers publish only commitments, nullifiers and ciphertexts. ${S.entryExitPublic()} Registration publicly links each master EOA to its zAccount ID and keys, and swaps publish the tokens, amounts and route.`,
      advice:
        'Deposit and withdraw from addresses that are not linked to each other, and keep funds inside the pool between them.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'private',
          note: 'Leaked for swaps and PRP conversions, which publish the output amount.',
        },
        asset: {
          verdict: 'private',
          note: 'Leaked for swaps, which publish the input and output tokens.',
        },
        linkage: 'private',
      },
      sources: [
        { contract: 'Vault', title: 'Locked and Unlocked events' },
        {
          title: 'Deposit and withdrawal handling',
          url:
            CONTRACTS +
            'core/facets/zTransaction/DepositAndWithdrawalHandler.sol#L43-L146',
        },
        {
          title: 'ZAccountRegistered publishes the master EOA and keys',
          url: CONTRACTS + 'core/facets/ZAccountsRegistration.sol#L156-L209',
        },
        {
          title: 'Swaps publish tokens, amounts and route',
          url: CONTRACTS + 'core/facets/ZSwap.sol#L99-L184',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Every deposit and withdrawal belongs to a KYC-registered master EOA, so the crowd is limited to registered zAccounts. Amounts and timing of deposits and withdrawals can link them when few users are active.',
      advice: `${S.commonAmounts} ${S.freshExit}`,
      interior: {
        sender: 'atRisk',
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by the public deposit and withdrawal amounts.',
        },
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Amount and timing matching across a small set of registered zAccounts.',
        },
      },
      sources: [
        { contract: 'PantherPool', title: 'Registered zAccounts' },
        {
          title: 'KYT hashes emitted for every deposit and withdrawal',
          url:
            CONTRACTS +
            'core/facets/zTransaction/DepositAndWithdrawalHandler.sol#L27-L95',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        "The dApp is not open source. It reads notes from Panther's hosted subgraph and sends sponsored transactions through allowlisted bundlers, which see the user's IP and timing. What the dApp sends to these services cannot be verified.",
      advice:
        'Use Tor, and submit transactions yourself from a fresh EOA instead of the sponsored path.',
      interior: {
        sender: 'unverifiable',
        recipient: 'unverifiable',
        amount: 'unverifiable',
        asset: 'unverifiable',
        linkage: 'unverifiable',
      },
      sources: [
        {
          contract: 'PayMaster',
          title: 'Only allowlisted bundlers are sponsored',
        },
        {
          title: 'Subgraph indexing transaction notes',
          url: CORE + 'subgraph/subgraph.template.yaml',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "Every transaction carries a ciphertext, verified in the proof, with its asset, amounts, sender zAccount and the recipients' keys. The zone's data escrow operator can decrypt it together with either the DAO or the zone operator, and can tell which notes are spent. KYC and KYT providers know the identity behind every master EOA and sign every deposit and withdrawal.",
      advice:
        'Treat all activity in the pool as visible to the escrow operator together with the DAO or the zone operator.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          section: 'permissions',
          title: 'DAO signers controlling zones and keys',
        },
        {
          contract: 'PantherTrees',
          title: 'Zones, provider keys and DAO escrow key',
        },
        {
          title: 'Data escrow encryption scheme',
          url:
            CIRCUITS + 'templates/dataEscrowElGamalEncryption.circom#L13-L110',
        },
        {
          title: 'Escrowed fields of every transaction',
          url: CIRCUITS + 'zSwapV1.circom#L793-L827',
        },
        {
          title: 'KYT signature over sender, receiver, token and amount',
          url: CIRCUITS + 'templates/trustProvidersKyt.circom#L113-L192',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'Escrow ciphertexts, the ephemeral keys wrapped to the DAO and zone keys, and recipient notes all rely on BabyJubJub elliptic-curve key exchange and are stored onchain. Breaking it decrypts the full history.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Data escrow encryption scheme',
          url:
            CIRCUITS + 'templates/dataEscrowElGamalEncryption.circom#L13-L110',
        },
        {
          title: 'Note encryption to the recipient reading key',
          url: CORE + 'crypto/src/panther/messages.ts#L289-L299',
        },
      ],
    },
  },
})
