/**
 * Nearest candidates by edit distance, for "did you mean" hints.
 *
 * Validator findings are read by the model in a repair round; a miss that
 * names the closest existing identifiers is fixed in one round, a bare
 * "not found" often is not. Candidates are compared on `key` first (for
 * signatures, the name before the parenthesis, so a typo in a name is not
 * outweighed by a long parameter list), then by longest shared prefix (a
 * misremembered suffix still finds its family), then on the whole string,
 * then in code-point order so the hint is the same on every machine.
 */
export function closest(
  candidates: readonly string[],
  target: string,
  limit = 3,
  key: (value: string) => string = (value) => value,
): string[] {
  const needle = target.toLowerCase()
  const needleKey = key(needle)
  return [...new Set(candidates)]
    .map((candidate) => ({
      candidate,
      byKey: levenshtein(key(candidate.toLowerCase()), needleKey),
      prefix: commonPrefix(candidate.toLowerCase(), needle),
      full: levenshtein(candidate.toLowerCase(), needle),
    }))
    .sort(
      (a, b) =>
        a.byKey - b.byKey ||
        b.prefix - a.prefix ||
        a.full - b.full ||
        (a.candidate < b.candidate ? -1 : a.candidate > b.candidate ? 1 : 0),
    )
    .slice(0, limit)
    .map((entry) => entry.candidate)
}

/** The identifier before the parameter list of a `name(types)` signature. */
export function nameOf(signature: string): string {
  const parenthesis = signature.indexOf('(')
  return parenthesis === -1 ? signature : signature.slice(0, parenthesis)
}

function commonPrefix(a: string, b: string): number {
  let length = 0
  while (length < a.length && length < b.length && a[length] === b[length]) {
    length++
  }
  return length
}

function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const substitution =
        (previous[j - 1] as number) + (a[i - 1] === b[j - 1] ? 0 : 1)
      const deletion = (previous[j] as number) + 1
      const insertion = (current[j - 1] as number) + 1
      current[j] = Math.min(substitution, deletion, insertion)
    }
    previous = current
  }
  return previous[b.length] as number
}
