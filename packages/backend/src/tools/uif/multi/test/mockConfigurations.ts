import { mockObject } from 'earl'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
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

export function saved<T>(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
  properties?: Partial<T>,
): SavedConfiguration<T> {
  return {
    id,
    properties: mockObject<T>({ ...properties }),
    minHeight,
    maxHeight,
    currentHeight,
  }
}

export function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration {
  return { id, from, to }
}
