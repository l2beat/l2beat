import { existsSync, readFileSync } from 'fs'
import path from 'path'
import type { DiscoveredTokens, ProcessedEscrows } from './types'

export const OUTPUT_PATH = path.resolve(__dirname, './discovered.json')
export const PROCESSED_ESCROWS_PATH = path.resolve(
  __dirname,
  './processedEscrows.json',
)

export function loadExistingTokens(): DiscoveredTokens {
  if (existsSync(OUTPUT_PATH)) {
    const data = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    return {
      found: data.found ?? [],
    }
  }
  return { found: [] }
}

export function loadProcessedEscrows(): ProcessedEscrows {
  if (existsSync(PROCESSED_ESCROWS_PATH)) {
    const data = JSON.parse(readFileSync(PROCESSED_ESCROWS_PATH, 'utf-8'))
    return {
      processed: data.processed ?? {},
    }
  }
  return { processed: {} }
}

export function getEscrowKey(chain: string, address: string) {
  return `${chain}:${address}`
}

export function formatNumberWithCommas(value: number, precision = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}
