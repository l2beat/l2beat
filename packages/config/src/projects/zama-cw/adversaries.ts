import type { PrivacyAdversaryAssessments } from '../../types'

const SDK = 'https://github.com/zama-ai/relayer-sdk/blob/main'
const CUSDC =
  'https://etherscan.io/address/0xe978F22157048E5DB8E5d07971376e86671672B2'

// Verdicts backed by .flat/ConfidentialUSDCWrapper, .flat/ACL, .flat/KMSVerifier,
// discovered.json (Ethereum + gateway chain) and the relayer-sdk source.
// Measurements as of 2026-09-08, block 25,931,789.
export const zamaCwAdversaries: PrivacyAdversaryAssessments = {
  publicObserver: {
    value: 'Only interior amounts hidden',
    sentiment: 'warning',
    description:
      'Confidential tokens are an account model, not a pool. Wrapping and unwrapping are plain ERC-20 movements with the exact amount public; unwrapping even posts the decrypted plaintext onchain in the finalization call, and a zero reveals an insufficient balance. Confidential transfers publish sender and recipient as indexed event fields and only a 32-byte handle for the amount, so the whole transfer graph is public and the single hidden field is the interior amount. Holders can voluntarily disclose any amount.',
    boundary: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: 'leaked',
      asset: 'leaked',
      linkage: 'leaked',
      membership: 'leaked',
    },
    interior: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: 'hidden',
      asset: 'leaked',
      linkage: 'leaked',
      membership: 'leaked',
    },
    sources: [
      { title: 'ConfidentialWrapper (cUSDC)', url: `${CUSDC}#code` },
      {
        title: 'finalizeUnwrap cleartext amount',
        url: `${CUSDC}#writeProxyContract`,
      },
    ],
  },
  dragnetAnalyst: {
    value: 'Balances inferable from boundaries',
    sentiment: 'bad',
    description:
      'There is nothing to demix: linkage is public by construction. Because every wrap and unwrap amount is plaintext, an account that never transfers has a fully known balance, and every other account has a balance bounded by its public in and out flows. Roughly half of cUSDC wrap recipients have never made a confidential transfer. The gateway chain additionally publishes who requests decryption of which balance handles and when, which is a timing channel on balance checks.',
    boundary: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: 'leaked',
      asset: 'leaked',
      linkage: 'leaked',
      membership: 'leaked',
    },
    interior: {
      amount: {
        verdict: 'hygiene',
        note: 'Bounded by public wrap and unwrap totals; exact for accounts with few transfers.',
      },
    },
    sources: [
      {
        title: 'Gateway Decryption events (chain 261131)',
        url: 'https://docs.zama.org/protocol',
      },
    ],
  },
  networkObserver: {
    value: 'Zama relayer sees all activity',
    sentiment: 'bad',
    description:
      'The SDK sends every encrypted input to the Zama relayer together with the user address and target contract before the transaction is broadcast, and every balance read is a decryption request through the same relayer naming the exact handles. Mainnet access is gated by an API key, so the relayer holds a billing identity per app. Decryption shares are encrypted to the user with ML-KEM, so the relayer does not learn plaintext balances, only who transacts and reads what, and when. No third-party relayer is known to exist. A single coprocessor stores and processes every ciphertext.',
    boundary: {
      membership: 'leaked',
    },
    interior: {
      sender: 'leaked',
      recipient: 'leaked',
      amount: {
        verdict: 'hidden',
        note: 'Relayer and coprocessor see ciphertexts and handles, not plaintext.',
      },
      linkage: 'leaked',
    },
    sources: [
      { title: 'Relayer default URL', url: `${SDK}/src/configs.ts` },
      {
        title: 'Input encryption request',
        url: `${SDK}/src/relayer/sendEncryption.ts`,
      },
      {
        title: 'User decryption request',
        url: `${SDK}/src/relayer/userDecrypt.ts`,
      },
    ],
  },
  privilegedInsider: {
    value: 'KMS or owner can decrypt everything',
    sentiment: 'bad',
    description:
      'Thirteen KMS nodes hold shares of the single FHE key; a colluding set at the reconstruction threshold decrypts every balance and transfer amount ever produced, retroactively. The wrapper owner, an Aragon DAO executed by a 9-of-17 or a 3-of-5 multisig with no delay, can appoint an observer with wildcard decryption rights over a whole token, upgrade the wrappers, block users, and pause. A single coprocessor signer can censor inputs. Exclusion also inherits the blacklists of the underlying issuers. Unwrapping needs a live KMS, coprocessor and gateway, so the walkaway test fails.',
    interior: {
      amount: {
        verdict: 'leaked',
        note: 'To the KMS at threshold, or to any owner-appointed observer. No observer is set today.',
      },
    },
    sources: [
      { title: 'addObserver / blockUser (owner)', url: `${CUSDC}#code` },
      {
        title: 'ProtocolConfig KMS signers and thresholds',
        url: 'https://etherscan.io/address/0xD8236B57394f90726b26aB25D38CeAC776E1a7C4#readProxyContract',
      },
    ],
  },
  futureAdversary: {
    value: 'Lattice-safe, but stores are offchain',
    sentiment: 'warning',
    description:
      'Amounts are TFHE ciphertexts, which are lattice-based and not broken by a quantum computer, and only handles and digests are written to Ethereum. The remaining exposure is operational rather than cryptographic: the ciphertexts sit in a single coprocessor store and the key shares in the KMS nodes, so a future leak of enough shares decrypts the entire history. Whether the ciphertext store is publicly readable today, and whether the pairing-based input proofs held by the relayer are only computationally zero-knowledge, could not be verified.',
    interior: {
      amount: {
        verdict: 'unverifiable',
        note: 'Hidden by lattice cryptography; exposure depends on the retention and access policy of the coprocessor store and KMS shares.',
      },
    },
    sources: [
      {
        title: 'ML-KEM hybrid encryption of decryption shares',
        url: 'https://github.com/zama-ai/kms/blob/main/core/service/src/cryptography/hybrid_ml_kem.rs',
      },
      {
        title: 'Input proof system (tfhe-zk-pok)',
        url: 'https://github.com/zama-ai/tfhe-rs/tree/main/tfhe-zk-pok',
      },
    ],
  },
}
