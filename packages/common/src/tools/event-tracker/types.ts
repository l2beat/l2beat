import { UnixTime } from '@l2beat/types'

type UnixTimestamp = ReturnType<typeof UnixTime.prototype.toNumber> // Seconds, NOT milliseconds

export type History = Map<UnixTimestamp, number>

export type ReadonlyHistory = ReadonlyMap<UnixTimestamp, number>
