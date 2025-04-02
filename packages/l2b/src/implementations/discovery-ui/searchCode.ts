import type { ConfigReader, DiscoveryPaths } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { getAllCode } from './getCode'
import type { ApiCodeSearchResponse } from './types'

export function searchCode(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  searchTerm: string,
): ApiCodeSearchResponse {
  const code = getAllCode(paths, configReader, project)

  const matches: ApiCodeSearchResponse['matches'] = []
  for (const address in code) {
    const entry = code[address]
    const codeLocation: ApiCodeSearchResponse['matches'][number]['codeLocation'] =
      []

    for (const [i, codeEntry] of entry.sources.entries()) {
      const lines = getMatchingLines(codeEntry.code, searchTerm)
      for (const { content, offset } of lines) {
        codeLocation.push({
          line: content,
          fileName: codeEntry.name,
          index: i,
          offset,
        })
      }
    }

    if (codeLocation.length > 0) {
      matches.push({
        name: entry.entryName,
        address: address,
        codeLocation,
      })
    }
  }

  return { matches }
}

interface MatchingLine {
  content: string
  offset: number
}

function getMatchingLines(code: string, searchTerm: string): MatchingLine[] {
  let text = code
  let of = 0
  const matches: MatchingLine[] = []
  const isCaseSensitive = searchTerm !== searchTerm.toLowerCase()

  while (true) {
    const searchText = isCaseSensitive ? text : text.toLowerCase()
    const searchPattern = isCaseSensitive
      ? searchTerm
      : searchTerm.toLowerCase()
    const index = searchText.indexOf(searchPattern)
    if (index === -1) {
      break
    }
    const left = text.slice(0, index).lastIndexOf('\n')
    text = text.slice(left + 1)
    const right = text.indexOf('\n')
    assert(right !== -1)

    matches.push({
      content: text.slice(0, right),
      offset: of + index,
    })

    text = text.slice(right + 1)
    of += left + 1 + right + 1
  }

  return matches
}
