import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'
import type { L2Block } from '../types/BaseAnalyzer'
import { decodeV0Blob } from './decodeV0Blob'

// NOTE(radomski): Based on https://github.com/Consensys/linea-monorepo/blob/main/prover/lib/compressor/blob/blob.go
export function decodeBlob(blobHexString: string): L2Block[] {
  const blob = byteArrFromHexStr(blobHexString)
  const version = getBlobVersion(blob)
  assert(
    version === 0,
    'Only version 0 of blob encoding is supported currently',
  )

  switch (version) {
    case 0: {
      return decodeV0Blob(blob)
    }
    default: {
      assertUnreachable(version)
    }
  }
}

function getBlobVersion(blob: Uint8Array): number {
  // NOTE(radomski): Sanity check that we have data to read
  if (blob.length < 3) {
    return 0
  }

  if (blob[0] === 0x3f && blob[1] === 0xff && (blob[2] & 0xc0) === 0xc0) {
    return 1
  }

  return 0
}
