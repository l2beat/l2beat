import { assert } from '@l2beat/shared-pure'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { z } from 'zod'

import { EtherscanClient } from './EtherscanClient'

/**
 * Gets all addresses that interacted with the endpoint contract
 */
export async function getAddresses(
  blockNumber: number,
  etherscanClient: EtherscanClient,
): Promise<string[]> {
  // deployment of endpoint contract
  const fromBlock = 14388880
  const batchSize = 10_000

  const savedAddresses = readSavedAddresses()
  const missingRange = calcMissingRange(savedAddresses, fromBlock, blockNumber)

  if (!missingRange) {
    console.log('All addresses are already downloaded')
    return savedAddresses?.addresses ?? []
  }
  console.log('Downloading addresses...')
  const internalTxs = await etherscanClient.fetchAllInternalTxs(
    missingRange.start,
    missingRange.end,
    batchSize,
  )
  const addresses = new Set(internalTxs.map((tx) => tx.from))
  console.log('Addresses fetched: ', addresses.size)

  const mergedData = mergeAddresses(savedAddresses, addresses, missingRange)
  console.log('Saving addresses...')
  writeFileSync(
    './scripts/omnichain-value/savedAddresses.json',
    JSON.stringify(mergedData, null, 2),
  )

  return mergedData.addresses
}

const savedAddressesSchema = z.object({
  fromBlock: z.number(),
  toBlock: z.number(),
  addresses: z.array(z.string()),
})
type SavedAddresses = z.infer<typeof savedAddressesSchema>

function readSavedAddresses() {
  if (!existsSync('./scripts/omnichain-value/savedAddresses.json')) {
    console.log('No saved addresses found, downloading all...')
    return undefined
  }

  const raw = JSON.parse(
    readFileSync('./scripts/omnichain-value/savedAddresses.json').toString(),
  ) as unknown
  const parsed = savedAddressesSchema.parse(raw)
  return parsed
}

function calcMissingRange(
  saved:
    | {
        fromBlock: number
        toBlock: number
      }
    | undefined,
  currentStart: number,
  currentEnd: number,
) {
  if (!saved) {
    return {
      start: currentStart,
      end: currentEnd,
    }
  }

  assert(saved.fromBlock === currentStart, 'Start blocks must match')
  assert(saved.toBlock <= currentEnd, 'Saved end must be before current end')

  if (saved.toBlock === currentEnd) {
    return undefined
  }

  return {
    start: saved.toBlock + 1,
    end: currentEnd,
  }
}

function mergeAddresses(
  savedAddresses: SavedAddresses | undefined,
  fetchedAddresses: Set<string>,
  missingRange: { start: number; end: number },
) {
  const merged = new Set<string>()
  savedAddresses?.addresses.map((address) => {
    merged.add(address)
  })

  fetchedAddresses.forEach((address) => {
    merged.add(address)
  })

  const mergedData = {
    fromBlock: savedAddresses?.fromBlock ?? missingRange.start,
    toBlock: missingRange.end,
    addresses: Array.from(merged.values()).sort((a, b) => a.localeCompare(b)),
  }

  return mergedData
}
