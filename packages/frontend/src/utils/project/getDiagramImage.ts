import fs from 'fs'
import path from 'path'

export type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'
  | 'finality'

interface Options {
  throwOnMissing?: boolean
}

export function getDiagramImage(
  type: DiagramType,
  fileName: string,
  opts?: Options,
  _fs = { existsSync: fs.existsSync },
) {
  const filePath = `/images/${type}/${fileName}.png`
  const exists = _fs.existsSync(path.join(__dirname, '../../static', filePath))
  if (!exists && opts?.throwOnMissing) {
    throw new Error(`Diagram image not found: ${filePath}`)
  }

  return exists ? filePath : undefined
}
