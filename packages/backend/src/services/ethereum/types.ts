import { as } from '../cast'
import { Bytes } from '../model'
import { UnixTime } from '../model/UnixTime'
import { EthereumAddress } from './EthereumAddress'
import { KeccakHash } from './KeccakHash'
import {
  asBigIntFromQuantity,
  asBytesFromData,
  asEthereumAddressFromData,
  asKeccakHashFromData,
} from './primitives'

export interface RpcBlock {
  /** The block number. Missing for pending block. */
  number: BigInt | undefined
  /** Hash of the block. Missing for pending block. */
  hash: KeccakHash | undefined
  /** Hash of the parent block. */
  parentHash: KeccakHash
  /** Hash of the generated proof-of-work - 8 bytes. Missing for pending block. */
  nonce: Bytes | undefined
  /** MixHash is the hash that was used as an input to the PoW process. */
  mixHash: KeccakHash
  /** SHA3 of the uncles data in the block. */
  sha3Uncles: KeccakHash
  /** The bloom filter for the logs of the block - 256 bytes. Missing for pending block. */
  logsBloom: Bytes | undefined
  /** The root of the transaction trie of the block. */
  transactionsRoot: KeccakHash
  /** The root of the final state trie of the block. */
  stateRoot: KeccakHash
  /** The root of the receipts trie of the block. */
  receiptsRoot: KeccakHash
  /** The address of the beneficiary to whom the mining rewards were given. Missing for pending block. */
  miner: EthereumAddress | undefined
  /** Integer of the difficulty for this block. */
  difficulty: BigInt
  /** Integer of the total difficulty of the chain until this block. Missing for pending block. */
  totalDifficulty: BigInt | undefined
  /** The “extra data” field of this block. */
  extraData: Bytes
  /** Integer the size of this block in bytes. */
  size: BigInt
  /** The maximum gas allowed in this block. */
  gasLimit: BigInt
  /** The total used gas by all transactions in this block. */
  gasUsed: BigInt
  /** The fee per unit of gas burned by the protocol in this block. Missing in older blocks. */
  baseFeePerGas: BigInt | undefined
  /** The unix timestamp for when the block was collated. */
  timestamp: UnixTime
  /** Array of transaction hashes. */
  transactions: KeccakHash[]
  /** Array of uncle hashes. */
  uncles: KeccakHash[]
}

export const asRpcBlock = as.object<RpcBlock>({
  number: as.optional(asBigIntFromQuantity),
  hash: as.optional(asKeccakHashFromData),
  parentHash: asKeccakHashFromData,
  nonce: as.optional(asBytesFromData),
  mixHash: asKeccakHashFromData,
  sha3Uncles: asKeccakHashFromData,
  logsBloom: as.optional((value) => asBytesFromData(value, 256)),
  transactionsRoot: asKeccakHashFromData,
  stateRoot: asKeccakHashFromData,
  receiptsRoot: asKeccakHashFromData,
  miner: as.optional(asEthereumAddressFromData),
  difficulty: asBigIntFromQuantity,
  totalDifficulty: as.optional(asBigIntFromQuantity),
  extraData: asBytesFromData,
  size: asBigIntFromQuantity,
  gasLimit: asBigIntFromQuantity,
  gasUsed: asBigIntFromQuantity,
  baseFeePerGas: as.optional(asBigIntFromQuantity),
  timestamp: as.mapped(
    asBigIntFromQuantity,
    (value) => new UnixTime(Number(value))
  ),
  transactions: as.array(asKeccakHashFromData),
  uncles: as.array(asKeccakHashFromData),
})
