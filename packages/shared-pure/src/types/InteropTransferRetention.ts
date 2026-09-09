import { UnixTime } from './UnixTime.js'

/** How long raw `InteropTransfer` rows are kept before the cleaner drops them. */
export const INTEROP_TRANSFER_RETENTION = 7 * UnixTime.DAY
