import { mockObject } from 'earl'
import type { Configuration, RemovalConfiguration } from '../types'

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

export function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration {
  return { id, from, to }
}
