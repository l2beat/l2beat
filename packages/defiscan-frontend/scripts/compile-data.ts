import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface CompiledReview {
  metadata: {
    protocolName: string
    protocolSlug: string
    chain: string
    projectType: string
    tokenName: string
  }
  totals: {
    contractCount: number
    permissionedFunctionCount: number
    scoredFunctionCount: number
    adminCount: number
    dependencyCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
  }
  admins: {
    address: string
    adminType: string
    totalDirectCapital: number
    functions: { contractAddress: string }[]
  }[]
  dependencies: {
    address: string
    name: string
    entity: string | null
    functions: { contractAddress: string; contractName: string; functionName: string }[]
  }[]
  funds: {
    address: string
    name: string
    description: string
    balances: { totalUsdValue: number } | null
    positions: { totalUsdValue: number } | null
    tokenInfo: {
      symbol: string
      price: number
      totalSupply: string
      tokenValue: number
    } | null
  }[]
}

interface FundsData {
  contracts: Record<string, {
    balances?: { totalUsdValue: number }
    positions?: { totalUsdValue: number }
    tokenInfo?: {
      symbol: string
      price: number
      totalSupply: string
      tokenValue: number
    }
  }>
}

const DATA_DIR = join(__dirname, '..', 'public', 'data')

function main() {
  mkdirSync(DATA_DIR, { recursive: true })

  // Discover projects by scanning public/data/ for subdirs containing compiled-review.json
  const slugs = readdirSync(DATA_DIR).filter((name) => {
    const dir = join(DATA_DIR, name)
    return statSync(dir).isDirectory() && existsSync(join(dir, 'compiled-review.json'))
  })

  if (slugs.length === 0) {
    console.log('No compiled reviews found in public/data/. index.json will be empty.')
  }

  const protocols: Array<{
    slug: string
    name: string
    chain: string
    projectType: string
    tokenName: string
    totals: CompiledReview['totals']
  }> = []

  // Dependency aggregation: address → { name, entity, totalFundsAtRisk, protocols }
  const depMap = new Map<
    string,
    {
      name: string
      entity: string | null
      totalFundsAtRisk: number
      protocols: { slug: string; name: string }[]
    }
  >()

  let totalCapitalAtRisk = 0
  let totalTokenValueAtRisk = 0

  for (const slug of slugs) {
    const reviewPath = join(DATA_DIR, slug, 'compiled-review.json')
    const review: CompiledReview = JSON.parse(readFileSync(reviewPath, 'utf8'))

    console.log(`  Processing ${slug}`)

    // Patch funds data from funds-data.json if available (co-located next to compiled-review.json)
    const fundsDataPath = join(DATA_DIR, slug, 'funds-data.json')
    if (existsSync(fundsDataPath) && review.funds) {
      const fundsData: FundsData = JSON.parse(readFileSync(fundsDataPath, 'utf8'))
      // Build case-insensitive lookup with eth: prefix normalization
      const fundsLookup = new Map<string, FundsData['contracts'][string]>()
      for (const [addr, data] of Object.entries(fundsData.contracts ?? {})) {
        fundsLookup.set(addr.replace(/^eth:/i, '').toLowerCase(), data)
      }
      let patched = 0
      for (const fund of review.funds) {
        const normalizedAddr = fund.address.replace(/^eth:/i, '').toLowerCase()
        const contractFunds = fundsLookup.get(normalizedAddr)
        if (!contractFunds) continue
        if (contractFunds.balances) {
          fund.balances = { totalUsdValue: contractFunds.balances.totalUsdValue }
        }
        if (contractFunds.positions) {
          fund.positions = { totalUsdValue: contractFunds.positions.totalUsdValue }
        }
        if (contractFunds.tokenInfo) {
          fund.tokenInfo = {
            symbol: contractFunds.tokenInfo.symbol,
            price: contractFunds.tokenInfo.price,
            totalSupply: contractFunds.tokenInfo.totalSupply,
            tokenValue: contractFunds.tokenInfo.tokenValue,
          }
        }
        patched++
      }
      if (patched > 0) {
        console.log(`    Patched ${patched} fund(s) from funds-data.json`)
      }
    }

    // Add to protocol list
    protocols.push({
      slug: review.metadata.protocolSlug,
      name: review.metadata.protocolName,
      chain: review.metadata.chain,
      projectType: review.metadata.projectType,
      tokenName: review.metadata.tokenName,
      totals: review.totals,
    })

    totalCapitalAtRisk += review.totals.totalCapitalAtRisk
    totalTokenValueAtRisk += review.totals.totalTokenValueAtRisk

    // Aggregate dependencies across protocols
    // For each dependency, sum capital of admins whose functions use this dependency
    // This avoids attributing the entire protocol TVL to every dependency
    for (const dep of review.dependencies) {
      const key = dep.address.toLowerCase()
      // Compute capital controlled by admins that call through this dependency
      const depContractAddresses = new Set(dep.functions.map((f) => f.contractAddress.toLowerCase()))
      let depCapital = 0
      for (const admin of review.admins) {
        const usesThisDep = admin.functions.some(
          (f) => depContractAddresses.has(f.contractAddress.toLowerCase()),
        )
        if (usesThisDep) {
          depCapital += admin.totalDirectCapital
        }
      }

      const existing = depMap.get(key)
      if (existing) {
        existing.protocols.push({ slug, name: review.metadata.protocolName })
        existing.totalFundsAtRisk += depCapital
      } else {
        depMap.set(key, {
          name: dep.name,
          entity: dep.entity,
          totalFundsAtRisk: depCapital,
          protocols: [{ slug, name: review.metadata.protocolName }],
        })
      }
    }
  }

  // Build dependencies list sorted by funds at risk
  const dependencies = Array.from(depMap.entries())
    .map(([address, data]) => ({
      address,
      name: data.name,
      entity: data.entity,
      totalFundsAtRisk: data.totalFundsAtRisk,
      protocols: data.protocols,
    }))
    .sort((a, b) => b.totalFundsAtRisk - a.totalFundsAtRisk)

  // Write index.json
  const index = {
    totalDefiTvl: 100_000_000_000, // Manually maintained — update periodically
    protocols,
    globalTotals: {
      totalCapitalAtRisk,
      totalTokenValueAtRisk,
      protocolsReviewed: protocols.length,
    },
    dependencies,
  }

  writeFileSync(join(DATA_DIR, 'index.json'), JSON.stringify(index, null, 2))

  console.log(`\nCompiled ${protocols.length} protocols → public/data/index.json`)
  console.log(`Dependencies: ${dependencies.length}`)
}

main()
