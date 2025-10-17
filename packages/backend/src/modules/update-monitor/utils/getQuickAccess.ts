import type { DiscoveryDiff } from '@l2beat/discovery'

export interface QuickAccessData {
  name: string
  link: string
}

export function getQuickAccess(diff: DiscoveryDiff): QuickAccessData[] {
  const result: QuickAccessData[] = []

  result.push(...getImplementationQuickLinks(diff))

  return result
}

function getImplementationQuickLinks(diff: DiscoveryDiff): QuickAccessData[] {
  const result: QuickAccessData[] = []

  const matching = (diff.diff ?? []).flatMap((field) => {
    if (
      field.key.startsWith('values.$implementation') &&
      field.before !== undefined &&
      field.after !== undefined
    ) {
      return [
        {
          before: trimCharacters(field.before, '"'),
          after: trimCharacters(field.after, '"'),
          implementationIndex: getImplementationIndex(field.key),
        },
      ]
    }
    return []
  })

  for (const match of matching) {
    const name =
      match.implementationIndex !== undefined
        ? `DIFFO [Implementation ${match.implementationIndex}]`
        : 'DIFFO [Implementation]'

    result.push({
      name,
      link: `https://disco.l2beat.com/diff/${match.before}/${match.after}`,
    })
  }

  return result
}

function getImplementationIndex(key: string): number | undefined {
  const prefix = 'values.$implementation.'

  if (!key.startsWith(prefix)) {
    return undefined
  }

  const indexStr = key.slice(prefix.length)
  const index = Number(indexStr)

  return Number.isInteger(index) && indexStr === String(index)
    ? index
    : undefined
}

function trimCharacters(str: string, chars: string): string {
  if (!str || !chars) return str

  let start = 0
  let end = str.length - 1

  while (start <= end && chars.includes(str[start])) {
    start++
  }

  while (end >= start && chars.includes(str[end])) {
    end--
  }

  return str.substring(start, end + 1)
}
