import { existsSync } from 'fs'
import { getImageParams } from './get-image-params'

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
    light: {
      src: string
      width: number
      height: number
    }
    dark?: {
      src: string
      width: number
      height: number
    }
  }
  caption: string
}

export function getDiagramParams(
  type: DiagramType,
  fileName: string,
): DiagramParams | undefined {
  const imagePaths = {
    light: `/images/${type}/${fileName}.png`,
    dark: `/images/${type}/${fileName}.dark.png`,
  }

  const paths = Object.fromEntries(
    Object.entries(imagePaths)
      .filter(([_, filePath]) => existsSync(filePath))
      .map(([key, filePath]) => [key, getImageParams(filePath)]),
  )
  const { light, dark } = paths

  if (!light) return undefined

  return {
    src: {
      light,
      dark,
    },
    caption: diagramTypeToCaption[type],
  }
}
