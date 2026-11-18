import { assert } from '@l2beat/shared-pure'
import type { StarknetEvent } from './StarknetClient'
import { starknetKeccak } from './utils'

export interface StarknetABIEntry {
  name: string
  output: string[]
}

export interface DecodedEvent {
  name: string
  values: Record<string, string>
}

export class StarknetABIInterface {
  private readonly map = new Map<string, StarknetABIEntry>()
  constructor(items: StarknetABIEntry[]) {
    for (const item of items) {
      this.map.set(starknetKeccak(Buffer.from(item.name)), item)
    }
  }

  decode(event: StarknetEvent): DecodedEvent {
    const hash = event.keys[0]
    const entry = this.map.get(hash)
    if (entry === undefined) {
      throw new Error(`Unknown event ${hash}`)
    }

    const values: Record<string, string> = {}
    for (let i = 0; i < entry.output.length; i++) {
      const key = entry.output[i]
      assert(key !== undefined)
      values[key] = event.data[i]
    }
    return {
      name: entry.name,
      values,
    }
  }
}
