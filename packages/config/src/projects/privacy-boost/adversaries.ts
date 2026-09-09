import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const POOL =
  'https://optimistic.etherscan.io/address/0xca689828854a422CF1f778be03CA80549408F620'
const AUDIT =
  'https://optimistic.etherscan.io/address/0xb328535aB3bCe578996AE9af5A7f44f175721118'
const SDK = 'https://www.npmjs.com/package/@sunnyside-io/privacy-boost'

// Verdicts backed by the .flat sources (PrivacyBoost pool, AuthRegistry,
// AuditGateway, ExternalCallGateway, Groth16 verifiers), discovered.json, the
// published SDK wrapper (its Rust core and the TEE server are closed) and a
// decode of all pool events on OP Mainnet. Measurements as of 2026-09-08,
// OP Mainnet block 156,644,698.
export const privacyBoostAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides everything inside the ledger and the link between deposit and withdrawal. Deposits and withdrawals are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      condition: 'exit through the relay, never forced',
      description:
        "Deposits publish depositor, token and amount, and withdrawals publish recipient, token and amount inside the relay's epoch transactions. Interior transfers publish only Poseidon commitments, nullifiers and ciphertexts, so counterparties and amounts are hidden and the deposit-to-withdrawal link is hidden cryptographically. Every epoch carries exactly one transfer, so each private transfer is an individually timestamped transaction with a visible input and output count. The forced withdrawal path reveals the account owner and the exact notes spent, and DeFi through the gateway is an atomic unshield, call and reshield with public amounts.",
      boundary: {
        sender: {
          verdict: 'leaked',
          note: 'The forced exit path additionally names the account owner through the public auth registry.',
        },
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'private',
          note: 'Leaked on the forced path, whose input commitments are identifiable leaves.',
        },
        identity: 'private',
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'private',
          note: 'Leaked for gateway DeFi legs.',
        },
        asset: {
          verdict: 'private',
          note: 'Leaked for gateway DeFi legs.',
        },
        linkage: {
          verdict: 'private',
          note: 'One transfer per epoch: timing and input/output shape of every transfer are public.',
        },
        identity: 'private',
      },
      sources: [
        {
          title: 'PrivacyBoost pool (submitEpoch, requestDeposit)',
          url: `${POOL}#code`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      condition: 'a few dozen real users, exact exit amounts',
      description:
        'More than 99% of all deposits and withdrawals are a heartbeat by one operator address cycling 0.001 WETH every ten minutes, which an analyst filters out for free. What remains is fewer than forty real depositors and about twenty exit addresses. Exits are always 0.996 times the gross note, most deposits become a single note spent whole, holds last minutes, and most real recipients withdrew to the address they deposited from. Each user transfer is the one non-heartbeat epoch near its timestamp. Linkage is recoverable for essentially every real user.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the depositing EOA, which is also bound to an account id onchain.',
        },
      },
      interior: {
        sender: 'atRisk',
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by the public deposit and exit amounts of the few real users.',
        },
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden only if a transfer coincides with the heartbeat cadence.',
        },
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Operator heartbeat address',
          url: 'https://optimistic.etherscan.io/address/0x1b10c04536c01a51cb5d20cf3ac717047303d89c',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'single operator endpoint, no attestation check',
      description:
        'Only deposits touch an RPC. Every transfer, withdrawal, balance read and history query is an HTTPS request to one operator server behind Cloudflare. Login sends the wallet address, app id, master public key and the nullifying key; transfer requests are plaintext witnesses. The client encrypts requests to server keys fetched from the same server and, contrary to the documentation, performs no attestation verification, so nothing distinguishes the enclave from an ordinary server. There is one relay, allowlisted by the operator, and no alternative indexer or prover exists.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'leaked',
          note: "The server receives every withdrawal request with its destination and the user's nullifying key.",
        },
        identity: {
          verdict: 'leaked',
          note: 'IP, wallet address and app identity on every login.',
        },
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
      },
      sources: [
        { title: 'SDK (JS wrapper around closed Rust core)', url: SDK },
        {
          title: 'Server info endpoint (bare TEE public key)',
          url: 'https://optimism.privacyboost.io/api/v1/info',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'operator holds the plaintext ledger',
      description:
        "The TEE operator runs the indexer and prover and holds the plaintext of every transfer and the key that decrypts every onchain ciphertext. The enclave code is unpublished, no measurement is published and the client verifies nothing, so this rests on trust in the operator and in the cloud vendor's attestation and key release. A 2-of-3 admin multisig with the same signers as the operator can upgrade all four proxies with no delay and appoint auditors who may query any account's balances and history without consent; no auditor has been appointed and the audit logger has never transacted. Exit without the operator is a three-day forced withdrawal with no published tooling.",
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
      },
      sources: [
        {
          title: 'AuditGateway (auditors, audit logger)',
          url: `${AUDIT}#code`,
        },
        {
          title: 'AdminMultisig (2 of 3)',
          url: 'https://optimistic.etherscan.io/address/0x6476cBeBbce2673aeDAa464a4b9f31FD284aA0dC',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      condition: 'every ciphertext wrapped to a public static key',
      description:
        "Every note ciphertext on chain is AES-GCM under a key that is wrapped twice by secp256k1 ECDH: once to the recipient and once to the TEE's long-lived public key, which the server publishes. A quantum adversary therefore needs no recipient key or address book: from the published ephemeral points and the public TEE key it unwraps every note ever written, revealing sender, recipient, token and amount for the whole history. The same total decryption follows classically from a leak of the TEE private key, which has no forward secrecy. Poseidon commitments and the Groth16 proofs are unaffected.",
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'atRisk',
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'atRisk',
      },
      sources: [
        {
          title:
            'Ciphertext layout (teeWrapKey, receiverWrapKey) in pool source',
          url: `${POOL}#code`,
        },
      ],
    },
  },
})
