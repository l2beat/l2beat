/** Right-side (new file) line numbers present in a unified diff, per file. */
export type DiffLines = Map<string, Set<number>>

export function parseDiffLines(diff: string): DiffLines {
  const result: DiffLines = new Map()
  let file: string | undefined
  let line = 0
  for (const raw of diff.split('\n')) {
    if (raw.startsWith('+++ ')) {
      const path = raw.slice(4).trim()
      file = path === '/dev/null' ? undefined : path.replace(/^b\//, '')
      if (file) result.set(file, new Set())
      continue
    }
    if (raw.startsWith('--- ') || raw.startsWith('diff ')) continue
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw)
    if (hunk) {
      line = Number(hunk[1])
      continue
    }
    if (!file) continue
    if (raw.startsWith('+')) {
      result.get(file)?.add(line)
      line++
    } else if (raw.startsWith('-') || raw.startsWith('\\')) {
      // removed line or "\ No newline at end of file": right side unchanged
    } else {
      line++
    }
  }
  return result
}

export function isInDiff(
  diff: DiffLines,
  file: string,
  lineStart: number,
  lineEnd = lineStart,
): boolean {
  const lines = diff.get(file)
  if (!lines || lineStart < 1 || lineEnd < lineStart) return false
  for (let l = lineStart; l <= lineEnd; l++) {
    if (!lines.has(l)) return false
  }
  return true
}
