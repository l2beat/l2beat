import type { InteropBlockProcessor } from '../../capture/InteropBlockProcessor'

export interface ProcessorStatus {
  chain: string
  block: number
  timestamp: number
}

export function getProcessorsStatus(
  processors: InteropBlockProcessor[],
): ProcessorStatus[] {
  return processors.flatMap((processor) =>
    processor.lastProcessed
      ? [
          {
            chain: processor.chain,
            block: processor.lastProcessed.number,
            timestamp: processor.lastProcessed.timestamp,
          },
        ]
      : [],
  )
}
