import { ExplorerType } from '@l2beat/database'

export { isExplorerType }

function isExplorerType(
  maybeExplorerType: string,
): maybeExplorerType is ExplorerType {
  return Object.values(ExplorerType).includes(maybeExplorerType as ExplorerType)
}
