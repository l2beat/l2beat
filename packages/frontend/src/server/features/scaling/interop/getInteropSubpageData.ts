import type { InteropSubpageParams } from './types'
import {
  type AllProtocolsEntry,
  getAllProtocolEntries,
} from './utils/getAllProtocolEntries'
import { getTopPaths, type InteropPathData } from './utils/getTopPaths'
import {
  getTopProtocols,
  type InteropProtocolData,
} from './utils/getTopProtocols'
import { prepareInteropData } from './utils/prepareInteropData'

type InteropSubpageData = {
  top3Paths: InteropPathData[]
  topProtocols: InteropProtocolData[]
  allProtocolsEntries: AllProtocolsEntry[]
}

export async function getInteropSubpageData(
  params: InteropSubpageParams,
): Promise<InteropSubpageData> {
  const { records, tokensDetailsMap, interopProjects, subgroupProjects } =
    await prepareInteropData(params.from, params.to, params.type)

  return {
    top3Paths: getTopPaths(records, subgroupProjects),
    topProtocols: getTopProtocols(records, interopProjects, subgroupProjects),
    allProtocolsEntries: getAllProtocolEntries(
      records,
      tokensDetailsMap,
      interopProjects,
    ),
  }
}
