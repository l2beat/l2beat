import { mockObject } from 'earl'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
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

export function update<T>(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  hasData: boolean,
  properties?: Partial<T>,
): UpdateConfiguration<T> {
  return {
    id,
    properties: mockObject<T>({ ...properties }),
    minHeight,
    maxHeight,
    hasData,
  }
}

export function removal<T>(
  id: string,
  from: number,
  to: number,
  properties?: Partial<T>,
): RemovalConfiguration<T> {
  return { id, properties: mockObject<T>({ ...properties }), from, to }
}
