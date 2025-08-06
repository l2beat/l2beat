import { existsSync } from 'fs'
import path from 'path'
import { getImageParams } from './getImageParams'

type DiagramType =
  | 'architecture'
  | 'upgrades-and-governance'
  | 'state-validation'
  | 'da-layer-technology'
  | 'da-bridge-technology'
  | 'sequencing'

const diagramTypeToCaption: Record<DiagramType, string> = {
  architecture: 'A diagram of the smart contract architecture',
  'upgrades-and-governance': 'A diagram of the upgrades and governance',
  'state-validation': 'A diagram of the state validation',
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
      .filter(([_, filePath]) =>
        existsSync(path.join(process.cwd(), 'static', filePath)),
      )
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
