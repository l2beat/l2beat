import type { LineRange } from '../post/schema.js'

/** Right-side (new file) line numbers present in a unified diff, per file. */
export type DiffLines = Map<string, Set<number>>

const FILE_HEADER = /^diff --git a\/.+ b\/(.+)$/
const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/

/** Expects `git diff` output: file paths come from the `diff --git` lines. */
export function parseDiffLines(diff: string): DiffLines {
  const result: DiffLines = new Map()
  let file: string | undefined
  let line = 0
  let inHunk = false
  for (const raw of diff.split('\n')) {
    const header = FILE_HEADER.exec(raw)
    if (header) {
      file = header[1]
      inHunk = false
      result.set(file, new Set())
      continue
    }
    if (!file) continue
    const hunk = HUNK_HEADER.exec(raw)
    if (hunk) {
      line = Number(hunk[1])
      inHunk = true
      continue
    }
    if (!inHunk) {
      // index / mode / ---/+++ lines; a deleted file has no right side.
      if (raw === '+++ /dev/null') {
        result.delete(file)
        file = undefined
      }
      continue
    }
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

/** True when every line of the range was added by the diff. */
export function isInDiff(
  diff: DiffLines,
  file: string,
  range: LineRange,
): boolean {
  const lines = diff.get(file)
  if (!lines) return false
  for (let l = range.start; l <= range.end; l++) {
    if (!lines.has(l)) return false
  }
  return true
}
