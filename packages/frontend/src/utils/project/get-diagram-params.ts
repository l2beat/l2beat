import { readFileSync } from 'fs'
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
    Object.entries(imagePaths).map(([key, filePath]) => [
      key,
      getImageParams(filePath),
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

function getImageParams(filePath: string) {
  try {
    const imgBuffer = readFileSync(
      path.join(process.cwd(), './public', filePath),
    )
    const dimensions = getImageDimensions(imgBuffer)
    if (!dimensions) return undefined
    return { ...dimensions, src: filePath }
  } catch {
    return undefined
  }
}
function getImageDimensions(imgBuffer: Buffer) {
  try {
    const width = imgBuffer.readUInt32BE(16)
    const height = imgBuffer.readUInt32BE(20)
    return { width, height }
  } catch {
    return undefined
  }
}
