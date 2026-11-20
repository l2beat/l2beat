import type { ChainHeadCursorRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

/** "Block by block, within seconds": past this the newest rows shown may not be the newest there are */
const DELAYED_AFTER = UnixTime.MINUTE
/** How many usual gaps between blocks a chain may go without one before it counts as delayed */
const QUIET_GAPS = 10

/**
 * Whether what a feature stored at a chain's head can be shown on top of its
 * hourly data.
 *
 * - `live`: everything up to `asOf` is there
 * - `delayed`: everything up to `asOf` is there, but the chain's newest
 *   blocks may be missing: its source was not heard from for over a minute,
 *   or no block came for far longer than the chain usually takes
 * - `incomplete`: what is stored is of blocks the head no longer has, as
 *   between the head dropping blocks and the feature hearing of it
 * - `unchecked`: the chain's newest sealed hours were not compared with what
 *   was stored at the head, or no hours with rows in them matched since the
 *   feature last started over
 * - `held back`: an hour of the chain was sealed differently from what was
 *   stored at the head, and nobody has looked and deleted the result yet
 * - `off`: nothing is stored at the head of the chain
 *
 * Only `live` and `delayed` are to be shown.
 */
export type LiveStatus =
  | 'live'
  | 'delayed'
  | 'incomplete'
  | 'unchecked'
  | 'held back'
  | 'off'

/** What one snapshot of the database says of a feature at a chain's head */
export interface LiveChainState {
  /** Of the feature's indexer at the head. Undefined when it has none */
  cursor: ChainHeadCursorRecord | undefined
  /** The head still has the block the cursor stopped at */
  onHead: boolean
  /** When the head's source last had no block newer than the stored ones */
  heardAt: UnixTime | undefined
  /** Seconds between the chain's newest blocks, on average */
  blockGap: number | undefined
  /** The chain's newest sealed hours matched what was stored at the head, and so did hours with rows in them */
  matched: boolean
  /** An hour of the chain was sealed differently, with the result still stored */
  mismatched: boolean
}

export interface LiveChainStatus {
  status: LiveStatus
  /**
   * The time of the newest block read. Only for `live` and `delayed`. Not
   * the time the chain was last looked at: a source that is itself behind
   * would make that look fresher than the rows are
   */
  asOf: UnixTime | undefined
}

/** The same for every feature that stores rows at a chain's head with a cursor */
export function getLiveChainStatus(
  state: LiveChainState,
  now: UnixTime,
): LiveChainStatus {
  const none = (status: LiveStatus) => ({ status, asOf: undefined })
  if (state.cursor === undefined) return none('off')
  if (state.mismatched) return none('held back')
  if (!state.matched) return none('unchecked')
  if (!state.onHead) return none('incomplete')

  const asOf = state.cursor.timestamp
  // A quiet chain and a stalled source look the same from here, so a chain
  // is given a few of its usual gaps and no more
  const quietFor = QUIET_GAPS * (state.blockGap ?? 0)
  const delayed =
    state.heardAt === undefined ||
    now - state.heardAt > DELAYED_AFTER ||
    now - asOf > Math.max(DELAYED_AFTER, quietFor)
  return { status: delayed ? 'delayed' : 'live', asOf }
}
