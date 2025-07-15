import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

/**
 * Simple helper that removes both inline // comments and /* *\/ block comments
 * from a JSONC string so it can be parsed with JSON.parse().
 */
function stripJsonComments(input: string): string {
  // Remove /* */ block comments first (including newlines)
  const withoutBlock = input.replace(/\/\*[\s\S]*?\*\//g, '')
  // Remove // comments – only when they appear at the beginning of a line or after whitespace
  return withoutBlock.replace(/(^|\s+)\/\/.*$/gm, '')
}

interface TokenEntry {
  symbol: string
  address?: string
  [key: string]: unknown // other optional metadata
}

interface ChainTokens {
  [chain: string]: TokenEntry[]
}

/**
 * Small helper that ensures an array contains `value` once (uses strict equality).
 */
function pushUnique<T>(arr: T[], value: T) {
  if (!arr.includes(value)) arr.push(value)
}

// Paths – resolved relative to this script's location.
const TOKENS_PATH = path.resolve(
  __dirname,
  '..',
  'src',
  'tokens',
  'tokens.jsonc',
)
const CONFIG_PATH = path.resolve(
  __dirname,
  '..',
  'src',
  'projects',
  'tokens-v2',
  'config.jsonc',
)

// Read & parse tokens.jsonc
const tokensRaw = readFileSync(TOKENS_PATH, 'utf-8')
const tokensJson = JSON.parse(stripJsonComments(tokensRaw)) as ChainTokens

// Read & parse existing discovery config (if it exists)
const configRaw = readFileSync(CONFIG_PATH, 'utf-8')
// The discovery config structure is dynamic and differs between chains – using `any` here
// simplifies merging logic without introducing a large bespoke type.
// biome-ignore lint/suspicious/noExplicitAny: dynamic JSON structure
const configJson = JSON.parse(stripJsonComments(configRaw)) as any

if (!configJson.chains) {
  configJson.chains = {}
}

// Clean helper: copy all token fields except address & symbol into an overrides object
function buildOverrides(
  token: TokenEntry,
): Record<string, unknown> | undefined {
  const extra: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(token)) {
    if (key === 'address' || key === 'symbol') continue
    if (value !== undefined) extra[key] = value
  }
  return Object.keys(extra).length > 0 ? extra : undefined
}
// Iterate over every chain and token entry
for (const [chain, tokenList] of Object.entries(tokensJson)) {
  if (!Array.isArray(tokenList)) continue

  // Collect all addresses for the chain (skip tokens without an address)
  const validEntries = tokenList.filter((t) => t.address)
  if (validEntries.length === 0) continue // nothing to migrate for this chain

  // Ensure a chain entry exists in the config
  if (!configJson.chains[chain]) {
    configJson.chains[chain] = {
      maxDepth: 1,
      initialAddresses: [],
      overrides: {},
    }
  }

  const chainCfg = configJson.chains[chain]
  chainCfg.initialAddresses = chainCfg.initialAddresses || []
  chainCfg.overrides = chainCfg.overrides || {}

  // For every token entry, add to initialAddresses & overrides (merging when needed)
  for (const token of validEntries) {
    const address = (token.address as string).toLowerCase()

    // Add to discovery roots
    pushUnique(
      chainCfg.initialAddresses,
      // ensure we don't mix-case duplicates
      address,
    )

    const overridesMap = chainCfg.overrides as Record<string, unknown>
    // biome-ignore lint/suspicious/noExplicitAny: dynamic override structure
    const existingOverride: any = overridesMap[address] ?? {
      fields: {
        $tokenData: {
          handler: {
            type: 'ERC20Data',
          },
        },
      },
    }

    // Build overrides from token metadata
    const extra = buildOverrides(token)

    // If there is extra metadata, attach/merge it
    if (extra) {
      // biome-ignore lint/suspicious/noExplicitAny: dynamic handler sub-structure
      const handlerCfg: any = (existingOverride as any).fields.$tokenData
        .handler
      if (!handlerCfg.overrides) handlerCfg.overrides = {}
      Object.assign(handlerCfg.overrides, extra)
    }

    overridesMap[address] = existingOverride
  }
}
// Stringify back to JSON (2-space indent) – we intentionally keep it as .jsonc even though comments are lost.
const output = JSON.stringify(configJson, null, 2) + '\n'

writeFileSync(CONFIG_PATH, output)

console.log('Migration completed successfully.')
