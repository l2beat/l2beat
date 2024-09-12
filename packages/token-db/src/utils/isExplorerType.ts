import { ExplorerType } from '@prisma/client'

export { isExplorerType }

function isExplorerType(
  maybeExplorerType: string,
): maybeExplorerType is ExplorerType {
  return Object.values(ExplorerType).includes(maybeExplorerType as ExplorerType)
}
