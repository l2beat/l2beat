import { nodeLabelsAreVisible } from './relationGraphCanvas'
import {
  findNodeAt,
  type RelationGraphScene,
  type SceneNode,
} from './relationGraphScene'

/**
 * At overview zoom, every drag pans even if it starts on a node. Individual
 * node dragging starts with the zoom level that reveals token and chain labels.
 */
export function nodeDraggingIsEnabled(scale: number) {
  return nodeLabelsAreVisible(scale)
}

/** A missing drag target leaves the pointer gesture to the pan behavior. */
export function findDraggableNodeAt(
  scene: RelationGraphScene,
  x: number,
  y: number,
  radius: number,
  scale: number,
): SceneNode | undefined {
  if (!nodeDraggingIsEnabled(scale)) return undefined
  return findNodeAt(scene, x, y, radius)
}
