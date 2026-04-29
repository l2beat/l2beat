import { mockObject } from 'earl'
import type {
  Configuration,
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
  return { id, range: [from, to] }
}

export function wipeRemoval(id: string): WipeRemovalConfiguration {
  return { id }
}
