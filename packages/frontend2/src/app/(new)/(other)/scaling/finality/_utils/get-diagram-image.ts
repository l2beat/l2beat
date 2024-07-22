import fs from 'fs'
import { join } from 'path'

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
  const path = join(process.cwd(), 'public', 'images', type, `${fileName}.png`)

  const exists = _fs.existsSync(path)

  return exists ? path : undefined
}

export function getDiagramImageOrThrow(
  type: DiagramType,
  fileName: string,
  _fs = { existsSync: fs.existsSync },
): string {
  const filePath = getDiagramImage(type, fileName, _fs)

  if (!filePath) {
    throw new Error(`Diagram image not found: /images/${type}/${fileName}.png`)
  }

  return filePath
}
