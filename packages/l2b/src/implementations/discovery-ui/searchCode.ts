import type { ConfigReader, DiscoveryPaths } from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { getAllCode, getCode } from './getCode'
import type { ApiCodeSearchResponse } from './types'

export function searchCode(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  searchTerm: string,
  address?: ChainSpecificAddress,
): ApiCodeSearchResponse {
  const code =
    address === undefined
      ? getAllCode(paths, configReader, project)
      : { [address]: getCode(paths, configReader, project, address) }

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
  const matches: MatchingLine[] = []
  const isCaseSensitive = searchTerm !== searchTerm.toLowerCase()

  const searchPattern = isCaseSensitive ? searchTerm : searchTerm.toLowerCase()
  const searchText = isCaseSensitive ? code : code.toLowerCase()

  let text = code
  let searchTextRemaining = searchText
  let offset = 0

  while (true) {
    const index = searchTextRemaining.indexOf(searchPattern)
    if (index === -1) break

    const left = text.slice(0, index).lastIndexOf('\n')
    const lineStart = left + 1
    const lineText = text.slice(lineStart)
    const right = lineText.indexOf('\n')
    assert(right !== -1)

    matches.push({
      content: lineText.slice(0, right),
      offset: offset + index,
    })

    const nextPos = lineStart + right + 1
    text = text.slice(nextPos)
    searchTextRemaining = searchTextRemaining.slice(nextPos)
    offset += nextPos
  }

  return matches
}
