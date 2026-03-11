import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { modify, applyEdits, parse } from 'jsonc-parser'
import type { DiscoveryPaths } from '@l2beat/discovery'

/**
 * Validates that a contract address and field name exist in discovered.json.
 * Returns true if valid, false otherwise.
 */
export function validateContractField(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
  fieldName: string,
): boolean {
  const discoveredPath = join(paths.discovery, project, 'discovered.json')
  if (!existsSync(discoveredPath)) return false

  try {
    const discovered = JSON.parse(readFileSync(discoveredPath, 'utf-8'))
    const entry = discovered.entries?.find(
      (e: any) => e.type === 'Contract' && e.address === contractAddress,
    )
    if (!entry?.values) return false
    return fieldName in entry.values
  } catch {
    return false
  }
}

/**
 * Ensures severity is set for a field in config.jsonc.
 * Uses jsonc-parser's modify() + applyEdits() to preserve comments.
 * Validates the contract/field exist in discovered.json first.
 */
export function ensureFieldSeverity(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
  fieldName: string,
  severity: 'HIGH' | 'LOW' = 'HIGH',
): void {
  const configPath = join(paths.discovery, project, 'config.jsonc')
  if (!existsSync(configPath)) return

  // Validate contract address and field exist before modifying config
  if (!validateContractField(paths, project, contractAddress, fieldName)) {
    console.warn(
      `Skipping severity for ${contractAddress}.${fieldName}: not found in discovered.json`,
    )
    return
  }

  const text = readFileSync(configPath, 'utf-8')

  const edits = modify(
    text,
    ['overrides', contractAddress, 'fields', fieldName, 'severity'],
    severity,
    { formattingOptions: { tabSize: 2, insertSpaces: true } },
  )

  if (edits.length > 0) {
    writeFileSync(configPath, applyEdits(text, edits))
  }
}

/**
 * Removes severity from a field in config.jsonc if it was auto-set.
 * Only removes if the field entry has no other properties (description, handler, etc.)
 * to avoid clobbering manually configured fields.
 */
export function removeFieldSeverityIfAutoOnly(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
  fieldName: string,
): boolean {
  const configPath = join(paths.discovery, project, 'config.jsonc')
  if (!existsSync(configPath)) return false

  const text = readFileSync(configPath, 'utf-8')
  const parsed = parse(text)

  const fieldConfig = parsed?.overrides?.[contractAddress]?.fields?.[fieldName]
  if (!fieldConfig || !fieldConfig.severity) return false

  const keys = Object.keys(fieldConfig)
  if (keys.length === 1 && keys[0] === 'severity') {
    // Only severity — safe to remove the entire field entry
    const edits = modify(
      text,
      ['overrides', contractAddress, 'fields', fieldName],
      undefined,
      { formattingOptions: { tabSize: 2, insertSpaces: true } },
    )
    if (edits.length > 0) {
      let updated = applyEdits(text, edits)
      // Clean up empty parent objects if needed
      const reparsed = parse(updated)
      const fieldsObj = reparsed?.overrides?.[contractAddress]?.fields
      if (fieldsObj && Object.keys(fieldsObj).length === 0) {
        const fieldsEdits = modify(
          updated,
          ['overrides', contractAddress, 'fields'],
          undefined,
          { formattingOptions: { tabSize: 2, insertSpaces: true } },
        )
        if (fieldsEdits.length > 0) {
          updated = applyEdits(updated, fieldsEdits)
        }
      }
      writeFileSync(configPath, updated)
    }
    return true
  }

  // Field has other properties — only remove the severity key
  const edits = modify(
    text,
    ['overrides', contractAddress, 'fields', fieldName, 'severity'],
    undefined,
    { formattingOptions: { tabSize: 2, insertSpaces: true } },
  )
  if (edits.length > 0) {
    writeFileSync(configPath, applyEdits(text, edits))
  }
  return true
}
