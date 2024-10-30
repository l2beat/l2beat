import { createDatabase } from '@l2beat/database'
import { writeFile } from 'fs/promises'
import { argv } from 'process'

const path = argv[2]

if (!path) {
  console.error('Usage: pnpm export <output-path>')
  process.exit(1)
}

const db = createDatabase()

const tokens = await db.token.getAll()
const networks = await db.network.getAll()
const deployments = await db.deployment.getAll()
const metadata = await db.tokenMeta.getAll()
const tokenBridges = await db.tokenBridge.getAll()
const externalBridges = await db.externalBridge.getAll()

const result = tokens.map((token) => {
  const network = networks.find((n) => n.id === token.networkId)
  const deployment = deployments.find((d) => d.tokenId === token.id)
  const meta = metadata.filter((m) => m.tokenId === token.id)
  const bridgedFrom = tokenBridges
    .filter((b) => b.targetTokenId === token.id)
    .map((b) => ({
      ...b,
      externalBridge: externalBridges.find((e) => e.id === b.externalBridgeId),
    }))
  return {
    ...token,
    network,
    deployment,
    metadata: meta,
    bridgedFrom,
  }
})

await db.close()

await writeFile(path, JSON.stringify(result, null, 2))

const counts = result.reduce<
  Record<'externallyBridged' | 'canonicallyBridged' | 'native', number>
>(
  (acc, token) => {
    if (token.bridgedFrom) {
      if (token.bridgedFrom.some((b) => b.externalBridge)) {
        acc.externallyBridged++
      } else {
        acc.canonicallyBridged++
      }
    } else {
      acc.native++
    }
    return acc
  },
  { externallyBridged: 0, canonicallyBridged: 0, native: 0 },
)

console.log(`Exported total ${tokens.length} to ${path} ✅`)
console.log(`- externally bridged: ${counts.externallyBridged}`)
console.log(`- canonically bridged: ${counts.canonicallyBridged}`)
console.log(`- native: ${counts.native}`)
