import { Prisma } from '@prisma/client'
import { createPrismaClient } from '../db/prisma.js'
import { argv } from 'process'
import { writeFile } from 'fs/promises'

const path = argv[2]

if (!path) {
  console.error('Usage: yarn export <output-path>')
  process.exit(1)
}

const db = createPrismaClient()

const selectNetworkMeta = {
  id: true,
  chainId: true,
  name: true,
} satisfies Prisma.NetworkSelect

const selectExternalBridgeMeta = {
  id: true,
  name: true,
  type: true,
} satisfies Prisma.ExternalBridgeSelect

const tokens = await db.token.findMany({
  select: {
    id: true,
    network: { select: selectNetworkMeta },
    address: true,
    deployment: {
      select: {
        id: true,
        txHash: true,
        blockNumber: true,
        timestamp: true,
        from: true,
        to: true,
        isDeployerEoa: true,
        sourceAvailable: true,
      },
    },
    metadata: {
      select: {
        id: true,
        source: true,
        externalId: true,
        name: true,
        symbol: true,
        decimals: true,
        logoUrl: true,
        contractName: true,
      },
    },
    bridgedFrom: {
      select: {
        id: true,
        sourceTokenId: true,
        externalBridge: {
          select: selectExternalBridgeMeta,
        },
      },
    },
  },
})

await db.$disconnect()

await writeFile(path, JSON.stringify(tokens, null, 2))

const counts = tokens.reduce<
  Record<'externallyBridged' | 'canonicallyBridged' | 'native', number>
>(
  (acc, token) => {
    if (token.bridgedFrom) {
      if (token.bridgedFrom.externalBridge) {
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
