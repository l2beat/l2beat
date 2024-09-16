import fs from 'fs'
import path from 'path'

export type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'
  | 'finality'
  | 'da-layer-technology'
  | 'da-bridge-technology'

const diagramTypeToCaption: Record<DiagramType, string> = {
  architecture: 'A diagram of the smart contract architecture',
  'upgrades-and-governance': 'A diagram of the upgrades and governance',
  'state-validation': 'A diagram of the state validation',
  finality: 'A diagram of the finality',
  'da-layer-technology': 'A diagram of the DA layer technology',
  'da-bridge-technology': 'A diagram of the DA bridge technology',
}

export interface DiagramParams {
  src: string
  caption: string
}

export function getDiagramParams(
  type: DiagramType,
  fileName: string,
  _fs = { existsSync: fs.existsSync },
): DiagramParams | undefined {
  const filePath = `/images/${type}/${fileName}.png`
  const exists = _fs.existsSync(path.join(process.cwd(), './public', filePath))

  if (!exists) return undefined
  return {
    src: filePath,
    caption: diagramTypeToCaption[type],
  }
}
