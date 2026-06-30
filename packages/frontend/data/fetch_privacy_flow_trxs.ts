import { createReadStream, createWriteStream } from 'node:fs'
import { rename, rm } from 'node:fs/promises'
import { once } from 'node:events'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'
import { finished } from 'node:stream/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const INPUT_FILE_NAME = 'PrivacyFlowEvent.csv'
const OUTPUT_FILE_NAME = 'PrivacyFlowTrxs.csv'
const OUTPUT_TMP_FILE_NAME = `${OUTPUT_FILE_NAME}.tmp`
const TARGET_PROTOCOLS = new Set(['railgun', 'tornado-cash'])
const TARGET_ACTION = 'deposit'
const TARGET_CHAIN = 'ethereum'
const BATCH_SIZE = 100
const PROGRESS_INTERVAL = 10_000
const HTTP_TIMEOUT_MS = 30_000

interface OutputRow {
  id: string
  protocol: string
  bucketName: string
  blockNumber: string
  txHash: string
}

type RpcResponseItem = {
  id?: unknown
  result?: unknown
  error?: {
    code?: unknown
    message?: unknown
    data?: unknown
  }
}

function logIssue(scope: string, message: string) {
  console.error(`[${scope}] ${message}`)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toCsvLine(row: OutputRow, senderAddress: string) {
  return [
    row.id,
    row.protocol,
    row.bucketName,
    row.blockNumber,
    row.txHash,
    senderAddress,
  ].join(',')
}

function parseOutputRow(line: string, lineNumber: number): OutputRow | undefined {
  if (line.length === 0) {
    return undefined
  }

  const columns = line.replace(/\r$/, '').split(',')
  if (columns[0] === 'id' && columns[1] === 'protocol') {
    return undefined
  }

  if (columns.length < 8) {
    logIssue(
      'csv',
      `Line ${lineNumber}: expected at least 8 columns, got ${columns.length}.`,
    )
    return undefined
  }

  const id = columns[0]
  const protocol = columns[1]
  const bucketName = columns[2]
  const chain = columns[3]
  const action = columns[4]
  const blockNumber = columns[6]
  const txHash = columns[7]

  if (
    id === undefined ||
    protocol === undefined ||
    bucketName === undefined ||
    chain === undefined ||
    action === undefined ||
    blockNumber === undefined ||
    txHash === undefined
  ) {
    logIssue('csv', `Line ${lineNumber}: missing required columns.`)
    return undefined
  }

  if (!TARGET_PROTOCOLS.has(protocol) || action !== TARGET_ACTION) {
    return undefined
  }

  if (chain !== TARGET_CHAIN) {
    logIssue(
      'csv',
      `Line ${lineNumber}: skipping ${protocol} deposit on ${chain}.`,
    )
    return undefined
  }

  if (!txHash.startsWith('0x')) {
    logIssue('csv', `Line ${lineNumber}: invalid tx hash ${txHash}.`)
    return undefined
  }

  return { id, protocol, bucketName, blockNumber, txHash }
}

async function fetchSenderBatch(
  rpcUrl: string,
  txHashes: string[],
): Promise<Map<string, string | null>> {
  const requests = txHashes.map((txHash, index) => ({
    jsonrpc: '2.0',
    id: index + 1,
    method: 'eth_getTransactionByHash',
    params: [txHash],
  }))

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requests),
    signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown JSON parse error'
    throw new Error(`Invalid JSON response: ${message}`)
  }

  if (!Array.isArray(payload)) {
    throw new Error('Expected an array JSON-RPC batch response.')
  }

  const responsesById = new Map<number, RpcResponseItem>()
  for (const item of payload) {
    if (!isObject(item)) {
      logIssue('rpc', `Ignoring non-object batch item: ${JSON.stringify(item)}`)
      continue
    }

    const { id } = item as RpcResponseItem
    if (typeof id !== 'number') {
      logIssue(
        'rpc',
        `Ignoring batch item without numeric id: ${JSON.stringify(item)}`,
      )
      continue
    }

    responsesById.set(id, item as RpcResponseItem)
  }

  const senderByHash = new Map<string, string | null>()

  for (const request of requests) {
    const txHash = request.params[0]
    const item = responsesById.get(request.id)

    if (!item) {
      logIssue('rpc', `Missing batch response for ${txHash}.`)
      senderByHash.set(txHash, null)
      continue
    }

    if (item.error) {
      logIssue(
        'rpc',
        `RPC error for ${txHash}: ${JSON.stringify(item.error)}`,
      )
      senderByHash.set(txHash, null)
      continue
    }

    if (item.result === null) {
    logIssue('rpc', `Transaction not found for ${txHash}.`)
      senderByHash.set(txHash, null)
      continue
    }

    if (!isObject(item.result) || typeof item.result.from !== 'string') {
      logIssue('rpc', `Missing sender address in response for ${txHash}.`)
      senderByHash.set(txHash, null)
      continue
    }

    senderByHash.set(txHash, item.result.from)
  }

  return senderByHash
}

async function fetchSenders(
  rpcUrl: string,
  txHashes: string[],
): Promise<Map<string, string | null>> {
  if (txHashes.length === 0) {
    return new Map()
  }

  try {
    return await fetchSenderBatch(rpcUrl, txHashes)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logIssue(
      'rpc',
      `Batch request failed for ${txHashes.length} transaction(s): ${message}`,
    )

    if (txHashes.length === 1) {
      const txHash = txHashes[0]
      return txHash === undefined ? new Map() : new Map([[txHash, null]])
    }

    const midpoint = Math.floor(txHashes.length / 2)
    const left = await fetchSenders(rpcUrl, txHashes.slice(0, midpoint))
    const right = await fetchSenders(rpcUrl, txHashes.slice(midpoint))
    return new Map([...left, ...right])
  }
}

async function writeLine(writer: NodeJS.WritableStream, line: string) {
  if (writer.write(`${line}\n`)) {
    return
  }

  await once(writer, 'drain')
}

async function flushPendingRows(
  writer: NodeJS.WritableStream,
  pendingRows: OutputRow[],
  senderCache: Map<string, string | null>,
) {
  let writtenRows = 0
  let unresolvedRows = 0

  for (const row of pendingRows) {
    const senderAddress = senderCache.get(row.txHash) ?? ''
    if (!senderAddress) {
      unresolvedRows++
    }

    await writeLine(writer, toCsvLine(row, senderAddress))
    writtenRows++
  }

  return { writtenRows, unresolvedRows }
}

async function main() {
  const rpcUrl = process.env.ETHEREUM_RPC_URL
  if (!rpcUrl) {
    throw new Error('ETHEREUM_RPC_URL is not set.')
  }

  const dataDir = dirname(fileURLToPath(import.meta.url))
  const inputPath = join(dataDir, INPUT_FILE_NAME)
  const outputPath = join(dataDir, OUTPUT_FILE_NAME)
  const outputTmpPath = join(dataDir, OUTPUT_TMP_FILE_NAME)

  const reader = createInterface({
    input: createReadStream(inputPath, 'utf8'),
    crlfDelay: Number.POSITIVE_INFINITY,
  })
  const writer = createWriteStream(outputTmpPath, 'utf8')

  const senderCache = new Map<string, string | null>()
  const pendingHashSet = new Set<string>()
  let pendingRows: OutputRow[] = []
  let pendingHashes: string[] = []

  let processedLines = 0
  let matchedRows = 0
  let writtenRows = 0
  let unresolvedRows = 0

  const resolveAndFlushPending = async () => {
    if (pendingHashes.length > 0) {
      const resolvedSenders = await fetchSenders(rpcUrl, pendingHashes)
      for (const txHash of pendingHashes) {
        senderCache.set(txHash, resolvedSenders.get(txHash) ?? null)
      }
    }

    const flushed = await flushPendingRows(writer, pendingRows, senderCache)
    writtenRows += flushed.writtenRows
    unresolvedRows += flushed.unresolvedRows

    pendingRows = []
    pendingHashes = []
    pendingHashSet.clear()
  }

  try {
    for await (const line of reader) {
      processedLines++

      const row = parseOutputRow(line, processedLines)
      if (row) {
        matchedRows++

        if (pendingRows.length === 0 && senderCache.has(row.txHash)) {
          const senderAddress = senderCache.get(row.txHash) ?? ''
          if (!senderAddress) {
            unresolvedRows++
          }

          await writeLine(writer, toCsvLine(row, senderAddress))
          writtenRows++
        } else {
          pendingRows.push(row)

          if (
            !senderCache.has(row.txHash) &&
            !pendingHashSet.has(row.txHash)
          ) {
            pendingHashes.push(row.txHash)
            pendingHashSet.add(row.txHash)
          }

          if (pendingHashes.length >= BATCH_SIZE) {
            await resolveAndFlushPending()
          }
        }
      }

      if (processedLines % PROGRESS_INTERVAL === 0) {
        console.log(
          `Processed ${processedLines} CSV lines, matched ${matchedRows}, wrote ${writtenRows}.`,
        )
      }
    }

    if (pendingRows.length > 0) {
      await resolveAndFlushPending()
    }

    writer.end()
    await finished(writer)
    await rename(outputTmpPath, outputPath)

    console.log(
      `Done. Processed ${processedLines} CSV lines, matched ${matchedRows}, wrote ${writtenRows}, unresolved ${unresolvedRows}.`,
    )
  } catch (error) {
    writer.destroy()
    await rm(outputTmpPath, { force: true })
    throw error
  }
}

const isMain =
  process.argv[1] !== undefined &&
  pathToFileURL(process.argv[1]).href === import.meta.url

if (isMain) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
