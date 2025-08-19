import { Hash256 } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type { PerContractSource } from '../discovery/source/SourceCodeService'
import type { ContractSource } from '../utils/IEtherscanClient'
import { flattenStartingFrom } from './flatten'
import { format } from './format'
import type { FileContent } from './ParsedFilesManager'

export interface HashedChunks {
  content: string
  length: number
}

export interface HashedFileContent {
  path: string
  hashChunks: HashedChunks[]
  content: string
}

const cache: Map<string, Hash256> = new Map()

// Flatten the first (non-proxy) source file.
// This functions is used to find "matching" contract templates.
// This handles gross majority of cases and works very well
// even when there are multiple sources.
// In the future it may be reimplemented to support
// all sources for comparison with templates.
export function getHashForMatchingFromSources(
  perContractSources: PerContractSource[],
): Hash256 | undefined {
  const hashes = recalculateSourceHashes(perContractSources)

  if (hashes === undefined) {
    return undefined
  }

  return getHashToBeMatched(hashes)
}

export function getHashToBeMatched(
  hashes: (string | undefined)[],
): Hash256 | undefined {
  if (hashes.length < 1) {
    return undefined
  }

  const hashToBeMatched = hashes.length === 1 ? hashes[0] : hashes[1]

  if (hashToBeMatched === undefined) {
    throw Error('No sources found')
  }

  return Hash256(hashToBeMatched)
}

export function contractFlatteningHash(
  source: ContractSource,
): string | undefined {
  if (!source.isVerified) {
    return undefined
  }

  const input: FileContent[] = Object.entries(source.files)
    .map(([fileName, content]) => ({
      path: fileName,
      content,
    }))
    .filter((e) => e.path.endsWith('.sol'))

  const hash =
    input.length === 0
      ? sha2_256bit(Object.values(source.files).join('\n'))
      : flatteningHash(
          flattenStartingFrom(source.name, input, source.remappings),
        )

  return hash
}

export function flatteningHash(source: string): Hash256 {
  const hashed = sha2_256bit(source)
  const cached = cache.get(hashed)
  if (cached !== undefined) {
    return cached
  }

  const value = sha2_256bit(formatIntoHashable(source))
  cache.set(hashed, value)
  return value
}

function formatIntoHashable(source: string) {
  let formatted = format(source)

  if (formatted.startsWith('pragma')) {
    const firstNewlineIndex = formatted.indexOf('\n')
    formatted =
      firstNewlineIndex === -1
        ? formatted
        : formatted.slice(firstNewlineIndex + 1)
  }

  return formatted.trim()
}

export function sha2_256bit(input: string | string[]): Hash256 {
  const baseHash = createHash('sha256')
  const inputs = Array.isArray(input) ? input : [input]

  inputs.reduce((hash, input) => {
    hash.update(input)
    return hash
  }, baseHash)

  return Hash256(`0x${baseHash.digest('hex')}`)
}

export function buildSimilarityHashmap(input: string): HashedChunks[] {
  const lines = splitLineKeepingNewlines(input)

  const stringChunks = lines.flatMap((line) => {
    const result = []
    for (let i = 0; i < line.length; i += 64) {
      result.push(line.slice(i, i + 64))
    }
    return result
  })

  checkIfLineCountIsCorrect(input, lines)

  const map = new Map<string, number>()

  for (const stringChunk of stringChunks) {
    const element = map.get(stringChunk)

    if (element !== undefined) {
      map.set(stringChunk, element + stringChunk.length)
    } else {
      map.set(stringChunk, stringChunk.length)
    }
  }

  // Transform that map to an array of Chunk objects
  const chunks: HashedChunks[] = Array.from(map).map(([content, length]) => ({
    content,
    length,
  }))
  // Sort alphabetically by content
  chunks.sort((lhs, rhs) => lhs.content.localeCompare(rhs.content))

  return chunks
}

export function estimateSimilarity(
  lhs: HashedFileContent,
  rhs: HashedFileContent,
): number {
  let lhsIndex = 0
  let rhsIndex = 0
  let sourceCopied = 0

  while (true) {
    const lhsIsDone = lhsIndex === lhs.hashChunks.length
    if (lhsIsDone) {
      break
    }

    while (rhsIndex < rhs.hashChunks.length) {
      if (
        // @ts-expect-error indexes are handled in "while" condition
        lhs.hashChunks[lhsIndex].content <= rhs.hashChunks[rhsIndex].content
      ) {
        break
      }

      rhsIndex++
    }

    // @ts-expect-error indexes are handled in "while" condition
    const lhsCount = lhs.hashChunks[lhsIndex].length
    let rhsCount = 0

    if (
      rhsIndex < rhs.hashChunks.length &&
      // @ts-expect-error indexes are handled in "while" condition
      lhs.hashChunks[lhsIndex].content === rhs.hashChunks[rhsIndex].content
    ) {
      // @ts-expect-error indexes are handled in "while" condition
      rhsCount = rhs.hashChunks[rhsIndex].length
      rhsIndex++
    }

    sourceCopied += Math.min(lhsCount, rhsCount)
    lhsIndex++
  }

  return (sourceCopied * 2) / (lhs.content.length + rhs.content.length)
}

function splitLineKeepingNewlines(input: string): string[] {
  const lines = []
  let start = 0

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '\n') {
      const part = input.substring(start, i + 1)
      lines.push(part)
      start = i + 1
    }
  }

  if (start < input.length) {
    lines.push(input.substring(start))
  }

  return lines
}

function checkIfLineCountIsCorrect(input: string, lines: string[]): void {
  const inputLines = input.split('\n')
  if (inputLines.at(-1) === '') {
    inputLines.pop()
  }
  const inputLineCount = inputLines.length
  const linesLineCount = lines.length

  if (inputLineCount !== linesLineCount) {
    throw new Error(
      `Line count mismatch: ${inputLineCount} vs ${linesLineCount}`,
    )
  }
}

// Source hashes logic
export function recalculateSourceHashes(
  sources: PerContractSource[],
): (string | undefined)[] | undefined {
  const hashes = sources.map((source) => source.hash)

  if (hashes.length === 0) {
    return undefined
  }

  // if it's just one source, it must have hash defined
  if (hashes.length === 1 && hashes[0] === undefined) {
    return undefined
  }

  // If any source (except proxy) has undefined hash, return undefined
  if (hashes.slice(1).some((hash) => hash === undefined)) {
    return undefined
  }

  // Single source or proxy + impl
  if (hashes.length === 1 || hashes.length === 2) {
    return hashes
  }

  // >2 - Diamonds and similar with multiple 'sub-implementations'
  const [proxy, ...implementations] = hashes

  const masterHash = combineImplementationHashes(implementations as string[])

  // biome-ignore lint/style/noNonNullAssertion: checked above
  return [proxy!, masterHash]
}

export function combineImplementationHashes(hashes: string[]): Hash256 {
  return sha2_256bit(hashes.sort())
}
