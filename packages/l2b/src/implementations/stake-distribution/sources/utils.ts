import { isDateOnly } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import fetch from 'node-fetch'
import type { StakingEntity } from '../types'

// Stake amounts may arrive as numbers or numeric strings.
export const StakeAmountSchema = v.union([v.number(), v.string()])

export async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    )
  }

  return await response.json()
}

export function getUrlWithParams(
  url: string,
  params: Record<string, string>,
): string {
  const parsed = new URL(url)

  for (const [key, value] of Object.entries(params)) {
    parsed.searchParams.set(key, value)
  }

  return parsed.toString()
}

export function sumStake(entities: StakingEntity[]): number {
  return entities.reduce((sum, entity) => sum + entity.stakeBaseUnits, 0)
}

export function toFiniteNumber(value: unknown, name: string): number {
  const numberValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : Number.NaN

  if (!Number.isFinite(numberValue)) {
    throw new Error(`${name} is not a finite number`)
  }

  return numberValue
}

export function toSnapshotDate(value: string, name: string): string {
  const date = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  if (!date || !isDateOnly(date)) {
    throw new Error(`${name} is not a valid date: ${value}`)
  }

  return date
}
