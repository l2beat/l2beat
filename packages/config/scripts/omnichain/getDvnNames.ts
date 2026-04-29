import { readFileSync } from 'fs'

type DvnMeta = {
  canonicalName?: string
  id?: string
}

type LzChainMeta = {
  environment?: string
  dvns?: Record<string, DvnMeta>
}

const LZ_DVNS_URL = 'https://metadata.layerzero-api.com/v1/metadata/dvns'

function normalizeName(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join('')
}

function getLabel(meta: DvnMeta): string {
  const raw = meta.canonicalName ?? meta.id ?? 'Unknown'
  return normalizeName(raw)
}

function extractDvnAddressesFromDiscoveredJson(
  path: string,
): Set<string> {
  const raw = readFileSync(path, 'utf8')
  const discovered = JSON.parse(raw) as {
    entries?: Array<{ values?: Record<string, unknown> }>
  }

  const result = new Set<string>()

  for (const entry of discovered.entries ?? []) {
    const values = entry.values ?? {}
    for (const [key, value] of Object.entries(values)) {
      if (!key.startsWith('dvnConfig_')) continue
      if (typeof value !== 'object' || value === null) continue
      const cfg = value as {
        requiredDVNs?: unknown
        optionalDVNs?: unknown
      }

      for (const list of [cfg.requiredDVNs, cfg.optionalDVNs]) {
        if (!Array.isArray(list)) continue
        for (const item of list) {
          if (typeof item === 'string') {
            const [, address] = item.split(':')
            result.add((address ?? item).toLowerCase())
          }
        }
      }
    }
  }

  return result
}

async function main() {
  const discoveredPath =
    process.argv[2] ??
    'src/projects/rs-eth-token/discovered.json'

  const dvnAddresses = extractDvnAddressesFromDiscoveredJson(discoveredPath)
  if (dvnAddresses.size === 0) {
    console.log('No DVN addresses found in dvnConfig_* fields.')
    return
  }

  const response = await fetch(LZ_DVNS_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${LZ_DVNS_URL}: ${response.status}`)
  }
  const metadata = (await response.json()) as Record<string, LzChainMeta>

  const resolved = new Map<string, string>()
  for (const chain of Object.values(metadata)) {
    if (chain.environment !== 'mainnet') continue
    for (const [address, meta] of Object.entries(chain.dvns ?? {})) {
      const key = address.toLowerCase()
      if (!dvnAddresses.has(key) || resolved.has(key)) continue
      resolved.set(key, getLabel(meta))
    }
  }

  const output = [...dvnAddresses]
    .sort()
    .map((address) => {
      const label = resolved.get(address) ?? 'Unknown'
      return { address, label }
    })

  console.log(JSON.stringify(output, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
