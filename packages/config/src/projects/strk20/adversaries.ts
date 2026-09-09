import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const REPO = 'https://github.com/starkware-libs/starknet-privacy/blob/main'
const POOL =
  'https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a'

// Verdicts backed by .flat/PrivacyPool.cairo, the starknet-privacy repository
// (contract, SDK, prover and discovery service), the STRK-20 paper and a full
// decode of the pool's apply_actions transactions on Starknet. Starknet L2
// data is treated as public. Measurements as of 2026-09-08, Starknet block
// 14,566,177.
export const strk20Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides amounts and senders inside the pool, and the link between deposit and withdrawal. Deposits, withdrawals and first contacts are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      condition: 'recipient exposed on first contact',
      description:
        'Deposits and withdrawals are public events with address, token and amount. Inside the pool, transfers write encrypted notes into per-pair channels, and the note ciphertexts hide sender, amount and asset. Two things leak by design: the first payment between any sender and recipient opens a channel and writes the recipient address in cleartext, so who receives from someone is public on first contact, and the paymaster fee reimbursement in the same transaction is a public withdrawal that names the fee token. The link between a deposit and a later withdrawal is hidden cryptographically.',
      boundary: {
        sender: {
          verdict: 'leaked',
          note: 'Withdrawals are submitted by paymaster relayers; self-submitted transactions expose the user account.',
        },
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'private',
        identity: 'private',
      },
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'leaked',
          note: 'Opening a channel to a new counterparty writes the recipient address in cleartext; later transfers in the channel do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'The fee reimbursement withdrawal reveals which token the sender pays fees in; use STRK.',
        },
        linkage: 'private',
        identity: 'private',
      },
      sources: [
        { title: 'PrivacyPool contract on Voyager', url: POOL },
        {
          title: 'starknet-privacy repository',
          url: 'https://github.com/starkware-libs/starknet-privacy',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      condition: 'tiny set, one note per transaction',
      description:
        'The pool has under three thousand registered users and about a hundred transactions a day, nine in ten of which are deposits or withdrawals. Most deposits become exactly one note of the deposit amount that is later spent whole, so the one-to-one correspondence of a mixer is largely intact. Amounts are arbitrary but mostly round, tokens partition the set on both ends and through the fee reimbursement, no delay is enforced, and half of all channel openings are bundled into the same transaction as a public deposit, which the design paper itself warns against.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden only with a long hold, a non-round amount, in-pool hops and STRK as fee token.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Starknet accounts carry public bridge and exchange history; deposit addresses are screened by Elliptic.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Channel opening in the same transaction as a deposit names the depositor as sender.',
        },
        recipient: 'leaked',
        amount: 'private',
        asset: 'atRisk',
        linkage: 'atRisk',
        identity: 'atRisk',
      },
      sources: [{ title: 'PrivacyPool contract on Voyager', url: POOL }],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'hosted prover and discovery hold the viewing key',
      description:
        'The reference path sends the proving request to an operator-run prover as cleartext calldata that contains the user address, the private viewing key and every action, so the prover learns everything the auditor could. Note discovery sends the viewing key to an operator-run discovery service on every sync; a contract-scanning provider exists in the SDK source but is not exported. The one supported broadcaster, the AVNU paymaster, learns IP, the full transaction and the STARK proof bytes, which are never published onchain and are not zero-knowledge. Self-hosting the prover and discovery is possible but is not a wallet option, and self-submitting publishes the user account.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'leaked',
          note: 'The prover sees deposits, notes and withdrawal destinations of a user in cleartext.',
        },
        identity: {
          verdict: 'leaked',
          note: 'IP reaches prover, discovery and paymaster unless the optional OHTTP relay is configured.',
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
        {
          title: 'Proving request includes viewing key',
          url: `${REPO}/sdk/src/internal/proof-invocation-factory.ts`,
        },
        {
          title: 'Discovery service API',
          url: `${REPO}/crates/discovery-service/README.md`,
        },
        {
          title: 'Stwo is not zero-knowledge by default',
          url: 'https://github.com/starkware-libs/stwo-cairo#security-model',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'mandatory auditor key escrow',
      description:
        "Every user's viewing key is encrypted to a single auditor public key stored in the contract, and every withdrawal and open note carries the initiator address encrypted to the same key; the proof enforces it. Whoever holds that key traces the entire history retroactively. Its custody, described as a TEE run by Financial Privacy Inc. behind a 3-of-4 StarkWare and FPI multisig, is not verifiable onchain. Every deposit also needs a fresh screener signature backed by Elliptic verdicts, so entry can be denied per address. The permissioned sequencer is the only party that verifies client proofs, and a 7-of-12 multisig can replace the contract class with no delay.",
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'leaked',
          note: 'To the auditor key holder, retroactively for every user.',
        },
        identity: {
          verdict: 'leaked',
          note: 'The screener and the operator prover see depositor addresses and IPs.',
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
        { title: 'Auditor and screener keys in storage', url: POOL },
        {
          title: 'Discovery service (viewing key per request)',
          url: `${REPO}/crates/discovery-service/README.md`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      condition: 'auditor escrow is elliptic-curve ECDH',
      description:
        "All confidentiality keys are agreed by ECDH on the Stark curve, and the auditor public key, every user's viewing public key and every escrow ciphertext are onchain. A quantum adversary recovers the auditor private key, or each user's viewing key directly, and replays the auditor's full tracing over the entire history: senders, recipients, amounts, tokens and the deposit-to-withdrawal graph. The STARK proofs are hash-based and their soundness survives, but that protects funds, not privacy. The quantumResistant flag in our config describes the proof system, not the encryption.",
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
        { title: 'Stark-curve ECDH encryption (SDK)', url: `${REPO}/sdk/src` },
      ],
    },
  },
})
