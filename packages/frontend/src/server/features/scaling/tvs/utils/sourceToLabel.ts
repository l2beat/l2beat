import type { TvsToken } from '@l2beat/config'
import capitalize from 'lodash/capitalize'

/**
 * Maps a TVS token source to its display label.
 * 'custom-canonical' is displayed as 'Canonical' on the frontend.
 */
export function sourceToLabel(source: TvsToken['source']): string {
  if (source === 'custom-canonical') {
    return sourceToLabel('canonical')
  }
  return capitalize(source)
}
