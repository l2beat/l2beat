import { expect } from 'earl'
import { it } from 'mocha'
import {
  type DiagramType,
  getDiagramImage,
  getDiagramImageOrThrow,
  getDiagramPath,
} from './get-diagram-image'

const fileName = 'random-file-name-that-does-not-exist'
const diagramTypes: DiagramType[] = [
  'architecture',
  'upgrades-and-governance',
  'state-validation',
  'finality',
]

describe(getDiagramImage.name, () => {
  for (const type of diagramTypes) {
    describe(type, () => {
      it('returns the correct path if the file exists', async () => {
        const result = getDiagramImage(type, fileName, {
          existsSync: () => true,
        })

        expect(result).toEqual(getDiagramPath(type, fileName))
      })

      it('returns undefined if the file does not exist', () => {
        const result = getDiagramImage(type, fileName, {
          existsSync: () => false,
        })
        expect(result).toBeNullish()
      })
    })
  }
})

describe(getDiagramImageOrThrow.name, () => {
  for (const type of diagramTypes) {
    describe(type, () => {
      it('returns the correct path if the file exists', async () => {
        const result = getDiagramImageOrThrow(type, fileName, {
          existsSync: () => true,
        })
        expect(result).toEqual(getDiagramPath(type, fileName))
      })

      it('throws an error if the file does not exist', () => {
        expect(() => {
          getDiagramImageOrThrow(type, fileName, {
            existsSync: () => false,
          })
        }).toThrow(`Diagram image not found: /images/${type}/${fileName}.png`)
      })
    })
  }
})
