import fs from 'fs'
import path from 'path'

export type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'
  | 'finality'

export function getDiagramImage(
  type: DiagramType,
  fileName: string,
  _fs = { existsSync: fs.existsSync },
): string | undefined {
  const filePath = `/images/${type}/${fileName}.png`
  const exists = _fs.existsSync(path.join(process.cwd(), './public', filePath))

  return exists ? filePath : undefined
}
