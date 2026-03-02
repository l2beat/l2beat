import { mockObject } from 'earl'
import type {
  Configuration,
  RemovalConfiguration,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../types'

export function actual<T>(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  properties?: Partial<T>,
): Configuration<T> {
  return {
    id,
    properties: mockObject<T>({ ...properties }),
    minHeight,
    maxHeight,
  }
}

export function trimRemoval(
  id: string,
  from: number,
  to: number,
): TrimRemovalConfiguration {
  return { type: 'trim', id, range: [from, to] }
}

export function wipeRemoval(id: string): WipeRemovalConfiguration {
  return { type: 'wipe', id }
}

/** @deprecated Use trimRemoval or wipeRemoval */
export function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration {
  return trimRemoval(id, from, to)
}
