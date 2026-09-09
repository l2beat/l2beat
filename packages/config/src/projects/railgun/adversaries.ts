import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const ENGINE = 'https://github.com/Railgun-Community/engine/blob/main/src'
const WALLET = 'https://github.com/Railgun-Community/wallet/blob/main/src'
const PROXY =
  'https://etherscan.io/address/0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9'

// Verdicts backed by .flat/RailgunSmartWallet, discovered.json, the engine,
// wallet, broadcaster and POI sources. Measurements as of 2026-09-08,
// block 25,931,791.
export const railgunAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the pool. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      condition: 'interior fully encrypted',
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
        linkage: 'private',
        identity: 'private',
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'private',
          note: 'Leaked for DeFi bundles, which unshield to RelayAdapt in cleartext.',
        },
        asset: {
          verdict: 'private',
          note: 'Leaked for DeFi bundles.',
        },
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        { title: 'RailgunSmartWallet shield / transact', url: `${PROXY}#code` },
        {
          title: 'Note ciphertext format',
          url: `${ENGINE}/note/transact-note.ts`,
        },
      ],
    },
    chainAnalyst: {
      condition: 'token and timing narrow it',
      sentiment: 'warning',
      description:
        'Join-split notes, internal transfers, DeFi round trips and broadcaster fee notes break the one-to-one correspondence of a mixer, and the pool is active with hundreds of shielding addresses a month. The candidate set for an unshield is nevertheless hard-limited by token type and tree number, and there is no enforced delay beyond the one-hour proof-of-innocence pending period. Round exit amounts are common. Published work links roughly a sixth of Ethereum withdrawals uniquely through timing, address reuse, amount fingerprints and knapsack sums, and non-heuristic pruning alone halves the anonymity set on average.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Wait, avoid round and matching amounts, use a broadcaster, do not reuse exit addresses.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the shielding EOA or the unshield destination.',
        },
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
        identity: 'private',
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
      condition: 'own node and POI list needed',
      sentiment: 'good',
      description:
        'Note discovery is local trial decryption of every commitment, so neither the indexer nor the RPC learns which notes belong to the user. The broadcaster decrypts the full transaction including the unshield destination, but that destination is public onchain a block later, and the broadcaster is reached over Waku, so it sees neither the sender address nor the IP. Two default-path leaks remain and both are avoidable in supported configuration: the wallet SDK estimates gas by sending the real calldata with a dummy proof to the configured RPC, which a self-hosted node fixes, and proof-of-innocence nodes receive the blinded commitments in batches, which a self-hosted list avoids. Self-broadcasting is not an escape: it puts the user EOA as gas payer next to the unshield in a public transaction. Broadcasting is permissionless with dozens of broadcasters active.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'private',
        identity: {
          verdict: 'atRisk',
          note: 'Configured RPC sees IP and the pending unshield destination during gas estimation; default sync indexer and Waku fleet see the IP of a Railgun wallet. A self-hosted node avoids both.',
        },
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
        identity: {
          verdict: 'atRisk',
          note: 'POI nodes receive the blinded commitments of a wallet in batches and its submissions per spend, tying an IP to a note cluster and to transaction ids; a self-hosted list avoids it.',
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
      condition: 'no view keys, 7-day upgrade delay',
      sentiment: 'good',
      description:
        'The protocol has no view or decryption key, so no role can read past activity. The RAIL DAO can upgrade or pause the proxy through the Delegator after a seven-day execution delay, which could deanonymize future activity but not decrypt existing ciphertexts. It can also block new shields of a token and raise fees to 50%. Exclusion otherwise happens offchain: broadcasters can refuse transactions and by default require proof of innocence against a Chainalysis sanctions list, which partitions notes into listed and unlisted. The contract enforces none of this, so a self-broadcasting user cannot be excluded.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'private',
        identity: 'private',
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'private',
        linkage: 'private',
        identity: 'private',
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
      condition: 'notes of shared addresses decrypt',
      sentiment: 'warning',
      description:
        'Note encryption is AES-256-GCM under a key agreed by ECDH on Ed25519, and shield bundles are encrypted to the receiver viewing key the same way. A quantum adversary breaks the key agreement but still needs a candidate viewing key, which every published 0zk address contains. For any address ever shared, including all broadcaster addresses, every incoming shield, transfer and fee note decrypts, revealing amounts, tokens and counterparties, and the graph expands transitively as more keys are learned. Poseidon commitments, nullifiers and the Groth16 proofs remain unaffected. The trusted setup only concerns soundness.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Leaked for wallets whose 0zk address was ever shared: shield decryption ties the shielding EOA to the 0zk identity and its later notes.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Inherits everything the chain analyst learns.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Decrypts for notes touching any shared 0zk address.',
        },
        recipient: 'atRisk',
        amount: 'atRisk',
        asset: 'atRisk',
        linkage: 'atRisk',
        identity: 'atRisk',
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
  },
})
