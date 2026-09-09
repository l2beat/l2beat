import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const SDK = 'https://github.com/zama-ai/relayer-sdk/blob/main'
const CUSDC =
  'https://etherscan.io/address/0xe978F22157048E5DB8E5d07971376e86671672B2'

// Verdicts backed by .flat/ConfidentialUSDCWrapper, .flat/ACL, .flat/KMSVerifier,
// discovered.json (Ethereum + gateway chain) and the relayer-sdk source.
// Measurements as of 2026-09-08, block 25,931,789.
export const zamaCwAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'amount',
    text: 'Hides transfer amounts. Who pays whom, and every wrap and unwrap amount, is public.',
  },
  cells: {
    publicObserver: {
      condition: 'graph and boundary amounts public',
      sentiment: 'good',
      description:
        'Confidential tokens are an account model, not a pool. Wrapping and unwrapping are plain ERC-20 movements with the exact amount public; unwrapping even posts the decrypted plaintext onchain in the finalization call, and a zero reveals an insufficient balance. Confidential transfers publish sender and recipient as indexed event fields and only a 32-byte handle for the amount, so the whole transfer graph is public and the single hidden field is the interior amount. Holders can voluntarily disclose any amount.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'private',
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'private',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'private',
      },
      sources: [
        { title: 'ConfidentialWrapper (cUSDC)', url: `${CUSDC}#code` },
        {
          title: 'finalizeUnwrap cleartext amount',
          url: `${CUSDC}#writeProxyContract`,
        },
      ],
    },
    chainAnalyst: {
      condition: 'bounded by wrap and unwrap totals',
      sentiment: 'warning',
      description:
        'There is nothing to demix: linkage is public by construction. Because every wrap and unwrap amount is plaintext, an account that never transfers has a fully known balance, and every other account has a balance bounded by its public in and out flows. Roughly half of cUSDC wrap recipients have never made a confidential transfer. The gateway chain additionally publishes who requests decryption of which balance handles and when, which is a timing channel on balance checks.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on any address in the public graph.',
        },
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: {
          verdict: 'atRisk',
          note: 'Bounded by public wrap and unwrap totals; exact for accounts with few transfers.',
        },
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Gateway Decryption events (chain 261131)',
          url: 'https://docs.zama.org/protocol',
        },
      ],
    },
    networkObserver: {
      subject: 'identity',
      condition: 'mandatory relayer with API key',
      sentiment: 'bad',
      description:
        'The SDK sends every encrypted input to the Zama relayer together with the user address and target contract before the transaction is broadcast, and every balance read is a decryption request through the same relayer naming the exact handles. Mainnet access is gated by an API key, so the relayer holds a billing identity per app. Decryption shares are encrypted to the user with ML-KEM, so the relayer does not learn plaintext balances, only who transacts and reads what, and when. No third-party relayer is known to exist. A single coprocessor stores and processes every ciphertext.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'leaked',
          note: 'The mandatory Zama relayer sees IP and API key with every input and balance read; no third-party relayer exists.',
        },
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: {
          verdict: 'private',
          note: 'Relayer and coprocessor see ciphertexts and handles, not plaintext.',
        },
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
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
      condition: 'KMS or owner can decrypt',
      sentiment: 'bad',
      description:
        'Thirteen KMS nodes hold shares of the single FHE key; a colluding set at the reconstruction threshold decrypts every balance and transfer amount ever produced, retroactively. The wrapper owner, an Aragon DAO executed by a 9-of-17 or a 3-of-5 multisig with no delay, can appoint an observer with wildcard decryption rights over a whole token, upgrade the wrappers, block users, and pause. A single coprocessor signer can censor inputs. Exclusion also inherits the blacklists of the underlying issuers. Unwrapping needs a live KMS, coprocessor and gateway, so the walkaway test fails.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'leaked',
          note: 'Zama operates the relayer, the coprocessor and two KMS nodes.',
        },
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: {
          verdict: 'leaked',
          note: 'To the KMS at threshold, or to any owner-appointed observer. No observer is set today.',
        },
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
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
      condition: 'ciphertexts public, one key',
      sentiment: 'warning',
      description:
        'Amounts are TFHE ciphertexts, which are lattice-based and not broken by a quantum computer, and only handles and digests are written to Ethereum. The ciphertexts themselves, however, are not private: the coprocessor store is a publicly listable S3 bucket holding an estimated three quarters of a million objects, one compact and one large ciphertext per handle, going back to the first deployments. Anyone can harvest the full history today. Confidentiality therefore rests on a single long-lived FHE key whose shares sit in thirteen KMS nodes; one future reconstruction or leak of enough shares decrypts every balance and transfer ever made, and users have no mitigation. Whether the pairing-based input proofs held by the relayer are only computationally zero-knowledge is unverified.',
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
        amount: {
          verdict: 'private',
          note: 'Hidden by lattice cryptography only. Every ciphertext is publicly downloadable from the coprocessor bucket, so a future KMS key compromise is retroactive and total.',
        },
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Coprocessor ciphertext store (public S3 listing)',
          url: 'https://coprocessor-1.mainnet.zama.org/?max-keys=3',
        },
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
  },
})
