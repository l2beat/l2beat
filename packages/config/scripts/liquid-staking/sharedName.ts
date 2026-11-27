/** Protocol names an operator adds to its own ("Lido - Nethermind", "EtherFi10"). */
const PROTOCOL_WORDS =
  /\b(ether\.?fi|lido|ssv|stakewise|rocket ?pool)(?![a-z])/gi
const SEPARATORS = /[-–#|:_/]+/g

function clean(name: string) {
  return name
    .replace(PROTOCOL_WORDS, ' ')
    .replace(SEPARATORS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * The words every name starts with, once protocol names and separators are
 * dropped: "Chainnodes - EtherFi5" and "Lido - Chainnodes 1" share
 * "Chainnodes". Undefined when they share no word.
 */
export function sharedName(names: string[]): string | undefined {
  const cleaned = names.map(clean).filter((name) => name !== '')
  const first = cleaned[0]
  if (!first) return undefined
  let length = first.length
  for (const name of cleaned.slice(1)) {
    let i = 0
    while (
      i < length &&
      i < name.length &&
      name[i]?.toLowerCase() === first[i]?.toLowerCase()
    ) {
      i++
    }
    length = i
  }
  let prefix = first.slice(0, length)
  // Cut a word the names only share in part ("Stakin", "Stakingverse").
  const cutMidWord =
    /[a-z]$/i.test(prefix) &&
    cleaned.some((name) => /[a-z]/i.test(name[length] ?? ''))
  if (cutMidWord) prefix = prefix.replace(/[a-z0-9.]+$/i, '')
  const name = prefix.trim().replace(/\s+\d+$/, '')
  return /[a-z]/i.test(name) && name.length >= 2 ? name : undefined
}
