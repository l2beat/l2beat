import { daTrackingDomain } from './daTracking/identities'
import type { SnapshotDomain } from './types'

// To guard a new family of identities (e.g. trackedTxs), add a
// <domain>/identities.ts exporting a SnapshotDomain and register it here.
// The guard test and 'pnpm snapshots:generate' pick it up automatically.
export const SNAPSHOT_DOMAINS: SnapshotDomain[] = [daTrackingDomain]
