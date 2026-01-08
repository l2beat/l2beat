import type { InteropTransferRecord } from '@l2beat/database'

export interface SerializableInteropTransfer
  extends Omit<InteropTransferRecord, 'srcRawAmount' | 'dstRawAmount'> {
  srcRawAmount?: string
  dstRawAmount?: string
}

type TransferListener = (transfers: SerializableInteropTransfer[]) => void

export class InteropTransferStream {
  private readonly listeners = new Set<TransferListener>()
  private readonly buffer: SerializableInteropTransfer[] = []
  private nextDispatchAt = 0

  constructor(private readonly bufferSize = 50) {}

  publish(transfers: InteropTransferRecord[]) {
    if (transfers.length === 0) return
    this.dispatch(transfers.map(toSerializableTransfer))
  }

  // Evenly dispatches events across the `periodMs` period
  // to prevent ugly events bursts every few seconds
  publishBulk(transfers: InteropTransferRecord[], periodMs: number) {
    if (transfers.length === 0) return
    const serialized = transfers.map(toSerializableTransfer)
    const safePeriodMs = Number.isFinite(periodMs) ? Math.max(periodMs, 0) : 0
    const spacing =
      serialized.length > 1 ? safePeriodMs / (serialized.length - 1) : 0
    const now = Date.now()
    const startAt = Math.max(now, this.nextDispatchAt)

    serialized.forEach((transfer, index) => {
      const scheduledAt = startAt + index * spacing
      const delay = Math.max(0, scheduledAt - now)
      if (delay === 0) {
        this.dispatch([transfer])
        return
      }
      setTimeout(() => {
        this.dispatch([transfer])
      }, delay)
    })

    const lastScheduledAt = startAt + spacing * (serialized.length - 1)
    this.nextDispatchAt = Math.max(this.nextDispatchAt, lastScheduledAt)
  }

  subscribe(listener: TransferListener, options?: { replay?: number }) {
    if (options?.replay && this.buffer.length > 0) {
      const replay = this.buffer.slice(-options.replay)
      if (replay.length > 0) {
        listener(replay)
      }
    }
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private dispatch(transfers: SerializableInteropTransfer[]) {
    for (const transfer of transfers) {
      this.buffer.push(transfer)
    }
    if (this.buffer.length > this.bufferSize) {
      this.buffer.splice(0, this.buffer.length - this.bufferSize)
    }
    for (const listener of this.listeners) {
      try {
        listener(transfers)
      } catch {
        // Ignore listener failures to keep the stream alive.
      }
    }
  }
}

function toSerializableTransfer(
  record: InteropTransferRecord,
): SerializableInteropTransfer {
  return {
    ...record,
    srcRawAmount: record.srcRawAmount?.toString(),
    dstRawAmount: record.dstRawAmount?.toString(),
  }
}
