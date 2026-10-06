import {
  type Hex,
  parseTransaction,
  recoverTransactionAddress,
  type TransactionSerializedEIP4844,
} from 'viem'
import type { Attribute } from './attribute'
import type { BeaconSource, LiveBatch, LiveBlock } from './LiveBlobsFeed'

/** A public beacon node, free to use within its rate limits */
const BEACON_API = 'https://ethereum-beacon-api.publicnode.com'
/** Blob transactions are of EIP-2718 type 3 */
const BLOB_TRANSACTION = '0x03'
/** A node that hangs would stall the feed; a slot later the block is old news */
const REQUEST_TIMEOUT_MS = 10_000

/** Reads blocks from the beacon node, attributing their blobs as it goes */
export function createBeaconNode(attribute: Promise<Attribute>): BeaconSource {
  return {
    headSlot: fetchHeadSlot,
    block: async (slot) => fetchBlock(slot, await attribute),
  }
}

/** The slot of the newest block the node has */
async function fetchHeadSlot(): Promise<number> {
  const body = await fetchJson<{
    data: { header: { message: { slot: string } } }
  }>('/eth/v1/beacon/headers/head')
  if (!body) throw new Error('The beacon node has no head block')
  return Number(body.data.header.message.slot)
}

/**
 * The block of `slot`, with its blobs told apart by project. Ask only for
 * slots up to the head: there, a slot without a block was missed, while past
 * the head its block may simply not have come yet.
 */
async function fetchBlock(
  slot: number,
  attribute: Attribute,
): Promise<LiveBlock> {
  const body = await fetchJson<{
    data: {
      message: {
        body: {
          execution_payload: { block_number: string; transactions: Hex[] }
        }
      }
    }
  }>(`/eth/v2/beacon/blocks/${slot}`)
  if (!body) return { slot, status: 'missed' }

  const payload = body.data.message.body.execution_payload
  return {
    slot,
    status: 'proposed',
    blockNumber: Number(payload.block_number),
    batches: await readBlobBatches(payload.transactions, attribute),
  }
}

/**
 * The blob transactions of a block, decoded. Who sent one is not written in
 * it but recovered from its signature, which takes a few milliseconds each.
 */
async function readBlobBatches(
  transactions: Hex[],
  attribute: Attribute,
): Promise<LiveBatch[]> {
  const batches: LiveBatch[] = []
  for (const transaction of transactions) {
    if (!transaction.startsWith(BLOB_TRANSACTION)) continue
    const serialized = transaction as TransactionSerializedEIP4844
    const { to, blobVersionedHashes } = parseTransaction(serialized)
    const blobs = blobVersionedHashes?.length ?? 0
    if (!to || blobs === 0) continue
    const from = await recoverTransactionAddress({
      serializedTransaction: serialized,
    })
    const inbox = to.toLowerCase()
    batches.push({
      projectId: attribute(inbox, from.toLowerCase()),
      blobs,
      to: inbox,
    })
  }
  return batches
}

/** The parsed body, or undefined when the node has nothing at that path */
async function fetchJson<T>(path: string): Promise<T | undefined> {
  const response = await fetch(`${BEACON_API}${path}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (response.status === 404) return undefined
  if (!response.ok) {
    throw new Error(`The beacon node answered ${response.status} for ${path}`)
  }
  return (await response.json()) as T
}
