import { tokenizeSolidity } from './tokenizeSolidity'

export function splitCode(
  left: Record<string, string>,
  right: Record<string, string>,
  removeSameDeclarations = false,
  considerComments = true,
): [string, string] {
  // For the "are these declarations effectively the same?" comparison, use a
  // comment-stripped view when comments are being ignored downstream by the
  // diff filter. Without this, a declaration whose only difference is a
  // comment edit stays visible in the "unchanged removed" view because the
  // raw strings differ, but its line changes are then filtered out — leaving
  // a large block of identical-looking content.
  const leftForMatch = considerComments ? left : stripCommentsFromAll(left)
  const rightForMatch = considerComments ? right : stripCommentsFromAll(right)
  const matched = matchUp(
    leftForMatch,
    rightForMatch,
    removeSameDeclarations,
  )

  let smallerLeft = ''
  let smallerRight = ''

  for (const [lk, _] of matched.removed) {
    smallerLeft += wrapRegion(lk, left[lk] + '\n')
    smallerRight += wrapRegion(lk, '')
  }

  for (const [lk, rk] of matched.diff) {
    smallerLeft += wrapRegion(lk, left[lk] + '\n')
    smallerRight += wrapRegion(lk, right[rk] + '\n')
  }

  for (const [_, rk] of matched.created) {
    smallerLeft += wrapRegion(rk, '')
    smallerRight += wrapRegion(rk, right[rk] + '\n')
  }

  return [smallerLeft.trim(), smallerRight.trim()]
}

function wrapRegion(name: string, content: string): string {
  return `\n// #region ${name}\n${content}// #endregion ${name}\n`
}

function stripCommentsFromAll(
  code: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(code)) {
    result[key] = tokenizeSolidity(value)
      .filter((t) => t.type !== 'comment')
      .map((t) => t.content)
      .join(' ')
  }
  return result
}

type Pair = [string, string]
interface MatchUpResult {
  created: Pair[]
  diff: Pair[]
  removed: Pair[]
}

function matchUp(
  left: Record<string, string>,
  right: Record<string, string>,
  removeSameDeclarations: boolean,
  threshold = 0.5,
): MatchUpResult {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)

  const sameKeys = and(leftKeys, rightKeys)
  const differentLeftKeys = leftKeys.filter((key) => !sameKeys.includes(key))
  const differentRightKeys = rightKeys.filter((key) => !sameKeys.includes(key))

  const matrix = calculateSimilarities(
    differentLeftKeys.map((k) => left[k] as string),
    differentRightKeys.map((k) => right[k] as string),
  )

  const usedRight = new Set<number>()
  const diff: Pair[] = sameKeys
    .filter((k) => !removeSameDeclarations || left[k] !== right[k])
    .map((k) => [k, k])
  const removed: Pair[] = []

  differentLeftKeys.forEach((lk, i) => {
    let best = -1
    let bestScore = 0

    for (let j = 0; j < differentRightKeys.length; j++) {
      if (usedRight.has(j)) continue
      const s = matrix[i]?.[j] ?? 0
      if (s > bestScore) {
        bestScore = s
        best = j
      }
    }

    if (bestScore === 1 && removeSameDeclarations) {
      usedRight.add(best)
    } else if (bestScore >= threshold && best !== -1) {
      const r = differentRightKeys[best]
      if (r !== undefined) {
        diff.push([lk, r])
        usedRight.add(best)
      }
    } else {
      removed.push([lk, ''])
    }
  })

  const created: Pair[] = []
  differentRightKeys.forEach((rk, j) => {
    if (!usedRight.has(j)) created.push(['', rk])
  })

  return { created, diff, removed }
}

function calculateSimilarities(left: string[], right: string[]): number[][] {
  const leftHashed: HashedFileContent[] = left.map((l) => ({
    content: l,
    hashChunks: buildSimilarityHashmap(l),
  }))
  const rightHashed: HashedFileContent[] = right.map((r) => ({
    content: r,
    hashChunks: buildSimilarityHashmap(r),
  }))

  const result: number[][] = []
  for (const lh of leftHashed) {
    const row: number[] = []
    for (const rh of rightHashed) {
      row.push(estimateSimilarity(lh, rh))
    }
    result.push(row)
  }

  return result
}

interface HashedChunks {
  content: string
  length: number
}

interface HashedFileContent {
  hashChunks: HashedChunks[]
  content: string
}

function estimateSimilarity(
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

function buildSimilarityHashmap(input: string): HashedChunks[] {
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

function and(left: string[], right: string[]): string[] {
  const result: string[] = []
  for (const entry of left) {
    if (right.includes(entry)) {
      result.push(entry)
    }
  }
  return result
}
