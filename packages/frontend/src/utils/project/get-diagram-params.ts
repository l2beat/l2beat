import fs from 'fs'
import path from 'path'

export type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'
  | 'finality'
  | 'da-layer-technology'
  | 'da-bridge-technology'
  | 'sequencing'

const diagramTypeToCaption: Record<DiagramType, string> = {
  architecture: 'A diagram of the smart contract architecture',
  'upgrades-and-governance': 'A diagram of the upgrades and governance',
  'state-validation': 'A diagram of the state validation',
  finality: 'A diagram of the finality',
  'da-layer-technology': 'A diagram of the DA layer technology',
  'da-bridge-technology': 'A diagram of the DA bridge technology',
  sequencing: 'A diagram of the sequencing technology',
}

export interface DiagramParams {
  src: {
    light: string
    dark?: string
  }
  caption: string
}

export function getDiagramParams(
  type: DiagramType,
  fileName: string,
  _fs = { existsSync: fs.existsSync },
): DiagramParams | undefined {
  const imagePaths = {
    light: `/images/${type}/${fileName}.png`,
    dark: `/images/${type}/${fileName}.dark.png`,
  }
  const paths: {
    light?: string
    dark?: string
  } = Object.fromEntries(
    Object.entries(imagePaths).map(([key, filePath]) => [
      key,
      _fs.existsSync(path.join(process.cwd(), './public', filePath))
        ? filePath
        : undefined,
    ]),
  )

  const { light } = paths

  if (!light) return undefined

  return {
    src: {
      ...paths,
      light: light,
    },
    caption: diagramTypeToCaption[type],
  }
}
