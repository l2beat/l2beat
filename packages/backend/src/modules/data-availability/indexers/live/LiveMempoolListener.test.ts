import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { LiveMempoolListener, readBlobTx } from './LiveMempoolListener'
import type { LiveBlobsConfig } from './liveBlobs'

/**
 * Methodology: the subscription is a fake that hands the listener events as
 * the node sends them, the database a mock; tests assert what is stored
 */
describe(LiveMempoolListener.name, () => {
  // lowercase, as the stored blocks have them; the node sends checksummed
  const SENDER = EthereumAddress.random().toLowerCase()
  const INBOX = EthereumAddress.random().toLowerCase()

  it('stores the blob transactions, attributed by sender and inbox, and nothing else', async () => {
    const { tell, db } = setup({ now: 1000.5 })

    tell(pendingTx({ type: '0x2' }))
    tell(pendingTx({ type: '0x3', nonce: '0x2a' }))
    await flush()

    expect(db.livePendingBlobTx.upsert).toHaveBeenOnlyCalledWith({
      from: SENDER,
      nonce: 42,
      txHash: '0xtx',
      to: INBOX,
      blobs: 2,
      projectId: ProjectId('rollup'),
      firstSeenAt: 1000.5,
      lastSeenAt: 1000.5,
    })
  })

  function setup(options: { now: number }) {
    let tell: (result: unknown) => void = () => {}
    const livePendingBlobTx = mockObject<Database['livePendingBlobTx']>({
      upsert: mockFn().resolvesTo(undefined),
      deleteSeenBefore: mockFn().resolvesTo(0),
    })
    const listener = new LiveMempoolListener(
      {
        pendingTxs: {
          start: (onEvent) => {
            tell = onEvent
          },
        },
        db: mockObject<Database>({ livePendingBlobTx }),
        configurations: [rollupConfig(SENDER, INBOX)],
        now: () => options.now,
      },
      Logger.SILENT,
    )
    listener.start()
    return {
      tell: (result: unknown) => tell(result),
      db: { livePendingBlobTx },
    }
  }

  function pendingTx(fields: { type: string; nonce?: string }) {
    return {
      hash: '0xtx',
      from: EthereumAddress(SENDER),
      to: EthereumAddress(INBOX),
      nonce: fields.nonce ?? '0x1',
      type: fields.type,
      blobVersionedHashes: fields.type === '0x3' ? ['0x01', '0x02'] : undefined,
    }
  }
})

describe(readBlobTx.name, () => {
  it('tells nothing of a transaction with no blobs or no receiver', () => {
    expect(
      readBlobTx({ type: '0x2', hash: '0x', from: '0x', to: '0x' }),
    ).toEqual(undefined)
    expect(
      readBlobTx({
        type: '0x3',
        hash: '0x',
        from: '0x',
        to: null,
        blobVersionedHashes: ['0x01'],
      }),
    ).toEqual(undefined)
  })
})

function rollupConfig(sender: string, inbox: string): LiveBlobsConfig {
  return {
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox,
    sequencers: [sender],
    sinceBlock: 0,
    projectId: ProjectId('rollup'),
  }
}

/** Lets the queued writes run */
function flush() {
  return new Promise((resolve) => setImmediate(resolve))
}
