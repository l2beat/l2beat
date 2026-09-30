import { ProjectId, pluralize } from '@l2beat/shared-pure'
import type { ParticleScale } from '~/pages/interop/components/flows/graph/utils/particleScale'
import { formatPosted } from './formatPosted'

const KIB = 1024
const BLOB = 128 * KIB

/**
 * The graph plays a minute in a second. At their real pace even the largest
 * posters send a batch a minute, and the graph would look switched off.
 */
export const TIME_SCALE = 60

export interface DaFlowsUnit {
  scale: ParticleScale
  /** Names an amount of data the way the DA layer counts it */
  format: (bytes: number) => string
}

// One particle starts at 256 B of data and doubles up the usual byte steps
const BYTES: DaFlowsUnit = {
  scale: {
    base: 256,
    options: [
      256,
      512,
      KIB,
      2 * KIB,
      5 * KIB,
      10 * KIB,
      20 * KIB,
      50 * KIB,
      100 * KIB,
    ],
    extensionStep: 100 * KIB,
  },
  format: formatPosted,
}

// Ethereum takes data a blob at a time, so there a particle is a blob
const BLOBS: DaFlowsUnit = {
  scale: {
    base: BLOB,
    options: [1, 2, 5, 10, 20, 50, 100].map((blobs) => blobs * BLOB),
    extensionStep: 100 * BLOB,
  },
  format: (bytes) => formatBlobs(bytes / BLOB),
}

export function getDaFlowsUnit(daLayerId: string): DaFlowsUnit {
  return daLayerId === ProjectId.ETHEREUM ? BLOBS : BYTES
}

/** An average is rarely a whole number of blobs: 8.1 blobs, 1 blob, 12 blobs */
export function formatBlobs(blobs: number): string {
  const rounded = blobs >= 10 ? Math.round(blobs) : Math.round(blobs * 10) / 10
  return `${rounded} ${pluralize(rounded, 'blob')}`
}
