import fs from 'fs'
import path from 'path'

export type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'

export function getDiagramImage(
  type: DiagramType,
  slug: string,
  _fs = { existsSync: fs.existsSync },
) {
  const filePath = `/images/${type}/${slug}.png`
  const exists = _fs.existsSync(path.join(__dirname, '../../static', filePath))
  return exists ? filePath : undefined
}
