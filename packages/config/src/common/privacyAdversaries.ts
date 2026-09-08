import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyLeakField,
  PrivacyLeakFieldInfo,
} from '../types'

/**
 * Ordered along the "spine": the first, second and fifth adversary see the
 * same public data with increasing time and effort, so protection against a
 * later one implies protection against an earlier one. The network observer
 * and the privileged insider are positional and do not nest with the spine.
 */
export const PRIVACY_ADVERSARIES: Record<PrivacyAdversaryId, PrivacyAdversary> =
  {
    publicObserver: {
      id: 'publicObserver',
      label: 'Public observer',
      description:
        'Anyone with a block explorer, today. Sees every transaction, event and storage slot, but does no correlation beyond following links.',
      examples: 'A curious counterparty, an employer, a journalist.',
    },
    dragnetAnalyst: {
      id: 'dragnetAnalyst',
      label: 'Dragnet analyst',
      description:
        'Records the whole chain forever and correlates it statistically (timing, amounts, gas and wallet fingerprints, address clustering) and with offchain data such as exchange KYC. Cannot coerce anyone.',
      examples:
        'Chain analytics firms, tax authorities, data brokers, anyone who buys their data later.',
    },
    networkObserver: {
      id: 'networkObserver',
      label: 'Network observer',
      description:
        'Sits between the user and the chain: RPC providers, relayers and broadcasters, indexers, wallet backends, ISPs. Learns IP addresses, query patterns and pre-broadcast transactions.',
      examples:
        'Infura or Alchemy, a Tornado relayer, a wallet vendor selling telemetry.',
    },
    privilegedInsider: {
      id: 'privilegedInsider',
      label: 'Privileged insider',
      description:
        'Holds a protocol role: upgrade admin, sequencer, decryption or view key holder, TEE vendor, association set or proof-of-innocence provider. Can SEE more than the public, or EXCLUDE users, which also partitions anonymity sets.',
      examples:
        'A DAO with an upgrade key, a KMS committee, an ASP operator, or whoever can compel them.',
    },
    futureAdversary: {
      id: 'futureAdversary',
      label: 'Future adversary',
      description:
        'Harvest now, decrypt later. Holds every byte ever written onchain plus any retained logs, and future cryptanalysis such as a large quantum computer that breaks elliptic-curve key exchange and pairings, but not hashes, symmetric ciphers or lattices.',
      examples: 'Anyone, once the cryptography or the operator logs fail.',
    },
  }

export const PRIVACY_LEAK_FIELDS: Record<
  PrivacyLeakField,
  PrivacyLeakFieldInfo
> = {
  sender: {
    id: 'sender',
    label: 'Sender',
    description:
      'The Ethereum address that funds entered from, or that initiated a transfer.',
  },
  recipient: {
    id: 'recipient',
    label: 'Recipient',
    description:
      'The Ethereum address that funds exit to, or that receives a transfer.',
  },
  amount: {
    id: 'amount',
    label: 'Amount',
    description: 'The value moved.',
  },
  asset: {
    id: 'asset',
    label: 'Asset',
    description: 'Which token is moved.',
  },
  linkage: {
    id: 'linkage',
    label: 'Linkage',
    description:
      'Whether the entry and exit of the same funds, or sender and recipient of the same transfer, can be tied together.',
  },
  membership: {
    id: 'membership',
    label: 'Membership',
    description: 'The fact that an address used the protocol at all.',
  },
}
