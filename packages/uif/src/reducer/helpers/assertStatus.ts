import { assert } from '@l2beat/shared-pure'
import type { IndexerState } from '../types/IndexerState'

export function assertStatus(
  status: IndexerState['status'],
  expected: IndexerState['status'] | IndexerState['status'][],
): void {
  if (Array.isArray(expected)) {
    assert(
      expected.includes(status),
      'Invalid status. Expected ' + expected.join(' or ') + ', got ' + status,
    )
  } else {
    assert(
      status === expected,
      'Invalid status. Expected ' + expected + ', got ' + status,
    )
  }
}
