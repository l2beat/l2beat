import type { AbstractTokenRecord } from '@l2beat/database'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ExampleInputs } from './service'

export class TokenReplayMap<
  K extends ChainSpecificAddress,
  V extends AbstractTokenRecord,
> {
  constructor(private readonly inputs: ExampleInputs) {}

  get(key: K): V | undefined {
    const input = this.inputs.readTokenDb<V>(key.toString())

    if (input === undefined) {
      throw new ReplayError(
        `missing token db snapshot data - ${key.toString()}`,
      )
    }

    // null
    return input ?? undefined
  }
}

export class TokenCaptureMap<
  K extends ChainSpecificAddress,
  V extends AbstractTokenRecord,
> extends Map<K, V> {
  constructor(
    map: Map<K, V>,
    private readonly inputs: ExampleInputs,
  ) {
    super(map.entries())
  }

  override get(key: K): V | undefined {
    const value = super.get(key)

    // null
    this.inputs.writeTokenDb(key.toString(), value === undefined ? null : value)

    return value
  }
}

class ReplayError extends Error {
  constructor(key: string) {
    super(`missing token db snapshot data - ${key}`)
    this.name = 'ReplayError'
  }
}
