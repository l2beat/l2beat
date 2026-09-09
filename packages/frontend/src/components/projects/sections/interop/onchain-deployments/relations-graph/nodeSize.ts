// Members are listed up to a cap that guards the canvas against a runaway cluster.
export const CLUSTER_MEMBERS_CAP = 16

// The layout needs sizes before anything renders, so the same numbers drive
// both the size formula and the card's inline styles.
export const NODE_PADDING_X = 12
export const NODE_PADDING_Y = 10
const BORDER_Y = 2
export const TITLE_HEIGHT = 20
export const META_GAP = 4
export const META_HEIGHT = 16
export const LIST_GAP = 12
export const CLUSTER_ROW_HEIGHT = 26
export const CLUSTER_FOOTER_HEIGHT = 20
const HEADER_HEIGHT = TITLE_HEIGHT + META_GAP + META_HEIGHT

export function getRelationsNodeSize(deploymentCount: number): {
  width: number
  height: number
} {
  const frame = 2 * NODE_PADDING_Y + BORDER_Y + HEADER_HEIGHT
  if (deploymentCount <= 1) {
    return { width: 184, height: frame + META_GAP + META_HEIGHT }
  }
  const shown = getShownMemberCount(deploymentCount)
  const columns = getClusterColumns(deploymentCount)
  const rows = Math.ceil(shown / columns)
  const list = LIST_GAP + rows * CLUSTER_ROW_HEIGHT
  const footer = deploymentCount > shown ? CLUSTER_FOOTER_HEIGHT : 0
  return { width: columns === 1 ? 268 : 420, height: frame + list + footer }
}

export function getClusterColumns(count: number): number {
  return count <= 3 ? 1 : 2
}

export function getShownMemberCount(count: number): number {
  return count > CLUSTER_MEMBERS_CAP ? CLUSTER_MEMBERS_CAP - 1 : count
}
