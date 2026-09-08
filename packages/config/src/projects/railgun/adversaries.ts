import type { PrivacyAdversaryAssessments } from '../../types'

const ENGINE = 'https://github.com/Railgun-Community/engine/blob/main/src'
const WALLET = 'https://github.com/Railgun-Community/wallet/blob/main/src'
const PROXY =
  'https://etherscan.io/address/0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9'

// Verdicts backed by .flat/RailgunSmartWallet, discovered.json, the engine,
// wallet, broadcaster and POI sources. Measurements as of 2026-09-08,
// block 25,931,791.
export const railgunAdversaries: PrivacyAdversaryAssessments = {
  publicObserver: {
    value: 'Boundary public, interior encrypted',
    sentiment: 'good',
    description:
      'Shielding reveals the sender, amount and token in cleartext; unshielding reveals the recipient, amount and token. Inside the pool, private transfers publish only Poseidon commitments, nullifiers and AES-GCM ciphertexts, so sender, recipient, amount and asset of interior transfers are hidden. DeFi through RelayAdapt is an atomic unshield, call and reshield bundle, so input and output tokens and amounts are public and only the owner is hidden. The link between a shield and an unshield is hidden cryptographically.',
    boundary: {
      sender: {
        verdict: 'leaked',
        note: 'At exit the gas payer is the broadcaster; self-broadcasting exposes the user EOA.',
      },
      recipient: 'leaked',
      amount: 'leaked',
      asset: 'leaked',
      linkage: 'hidden',
      membership: 'leaked',
    },
    interior: {
      sender: 'hidden',
      recipient: 'hidden',
      amount: {
        verdict: 'hidden',
        note: 'Leaked for DeFi bundles, which unshield to RelayAdapt in cleartext.',
      },
      asset: {
        verdict: 'hidden',
        note: 'Leaked for DeFi bundles.',
      },
      linkage: 'hidden',
      membership: 'n/a',
    },
    sources: [
      { title: 'RailgunSmartWallet shield / transact', url: `${PROXY}#code` },
      {
        title: 'Note ciphertext format',
        url: `${ENGINE}/note/transact-note.ts`,
      },
    ],
  },
  dragnetAnalyst: {
    value: 'Partitioned set, many links recoverable',
    sentiment: 'warning',
    description:
      'Join-split notes, internal transfers, DeFi round trips and broadcaster fee notes break the one-to-one correspondence of a mixer, and the pool is active with hundreds of shielding addresses a month. The candidate set for an unshield is nevertheless hard-limited by token type and tree number, and there is no enforced delay beyond the one-hour proof-of-innocence pending period. Round exit amounts are common. Published work links roughly a sixth of Ethereum withdrawals uniquely through timing, address reuse, amount fingerprints and knapsack sums, and non-heuristic pruning alone halves the anonymity set on average.',
    boundary: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: 'leaked',
      asset: 'leaked',
      linkage: {
        verdict: 'hygiene',
        note: 'Wait, avoid round and matching amounts, use a broadcaster, do not reuse exit addresses.',
      },
      membership: 'leaked',
    },
    sources: [
      {
        title: 'A Tattered Cloak of Invisibility (arXiv:2606.25926)',
        url: 'https://arxiv.org/abs/2606.25926',
      },
      {
        title: 'The Anonymity Gap (arXiv:2608.22987)',
        url: 'https://arxiv.org/abs/2608.22987',
      },
    ],
  },
  networkObserver: {
    value: 'Broadcaster and RPC see destination',
    sentiment: 'warning',
    description:
      'Note discovery is local trial decryption of every commitment, so neither the indexer nor the RPC learns which notes belong to the user. The broadcaster, however, decrypts the full transaction including the unshield destination, amount and token, but not the sender address or IP. Before broadcasting, the wallet SDK estimates gas by sending the real calldata with a dummy proof to the user RPC provider, which therefore also sees the pending destination. Proof-of-innocence nodes receive the blinded commitments of a wallet in batches and can cluster its notes. The default sync, Waku fleet and POI endpoints are all Railgun-affiliated. Broadcasting is permissionless with dozens of broadcasters active.',
    boundary: {
      recipient: {
        verdict: 'leaked',
        note: 'Broadcaster sees the unshield destination; RPC sees it during gas estimation.',
      },
      linkage: 'hidden',
      membership: {
        verdict: 'leaked',
        note: 'Sync indexer and POI nodes learn the IP of a Railgun wallet and its note cluster.',
      },
    },
    interior: {
      sender: 'hidden',
      recipient: 'hidden',
      amount: 'hidden',
      asset: 'hidden',
      linkage: {
        verdict: 'hygiene',
        note: 'POI submissions tie a wallet session to specific transaction ids.',
      },
    },
    sources: [
      {
        title: 'Gas estimation with dummy proof',
        url: `${WALLET}/services/transactions/tx-gas-details.ts`,
      },
      {
        title: 'Broadcaster decrypts request',
        url: 'https://github.com/Railgun-Community/ppoi-safe-broadcaster-example/blob/main/src/server/waku-broadcaster/methods/transact-method.ts',
      },
      { title: 'POI node interface', url: `${ENGINE}/poi/poi.ts` },
    ],
  },
  privilegedInsider: {
    value: 'No view keys, DAO upgrade after delay',
    sentiment: 'good',
    description:
      'The protocol has no view or decryption key, so no role can read past activity. The RAIL DAO can upgrade or pause the proxy through the Delegator after a seven-day execution delay, which could deanonymize future activity but not decrypt existing ciphertexts. It can also block new shields of a token and raise fees to 50%. Exclusion otherwise happens offchain: broadcasters can refuse transactions and by default require proof of innocence against a Chainalysis sanctions list, which partitions notes into listed and unlisted. The contract enforces none of this, so a self-broadcasting user cannot be excluded.',
    boundary: {
      linkage: 'hidden',
      membership: 'leaked',
    },
    interior: {
      sender: 'hidden',
      recipient: 'hidden',
      amount: 'hidden',
      asset: 'hidden',
      linkage: 'hidden',
    },
    sources: [
      {
        title: 'Voting execution delay',
        url: 'https://etherscan.io/address/0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC#readContract',
      },
      {
        title: 'POI required lists',
        url: 'https://github.com/Railgun-Community/shared-models/blob/main/src/models/poi.ts',
      },
    ],
  },
  futureAdversary: {
    value: 'Notes of shared addresses decrypt',
    sentiment: 'warning',
    description:
      'Note encryption is AES-256-GCM under a key agreed by ECDH on Ed25519, and shield bundles are encrypted to the receiver viewing key the same way. A quantum adversary breaks the key agreement but still needs a candidate viewing key, which every published 0zk address contains. For any address ever shared, including all broadcaster addresses, every incoming shield, transfer and fee note decrypts, revealing amounts, tokens and counterparties, and the graph expands transitively as more keys are learned. Poseidon commitments, nullifiers and the Groth16 proofs remain unaffected. The trusted setup only concerns soundness.',
    boundary: {
      linkage: {
        verdict: 'hygiene',
        note: 'Leaked for wallets whose 0zk address was ever shared; hidden otherwise.',
      },
      membership: {
        verdict: 'hygiene',
        note: 'Shield decryption ties the shielding EOA to a known 0zk identity.',
      },
    },
    interior: {
      sender: 'hygiene',
      recipient: 'hygiene',
      amount: 'hygiene',
      asset: 'hygiene',
      linkage: 'hygiene',
    },
    sources: [
      {
        title: 'Shared key derivation (Ed25519 ECDH)',
        url: `${ENGINE}/utils/keys-utils.ts`,
      },
      {
        title: 'AES-GCM note encryption',
        url: `${ENGINE}/utils/encryption/aes.ts`,
      },
    ],
  },
}
