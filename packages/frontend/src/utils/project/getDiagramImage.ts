import { existsSync } from 'fs'
import path from 'path'

type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'

export function getDiagramImage(type: DiagramType, slug: string) {
  const exists = existsSync(
    path.join(__dirname, `../../static/images/${type}/${slug}.png`),
  )
  return exists ? `/images/${type}/${slug}.png` : undefined
}
