import { expect } from 'earl'
import { it } from 'mocha'

import { DiagramType, getDiagramImage } from './getDiagramImage'

const fileName = 'random-file-name-that-does-not-exist'
const diagramTypes: DiagramType[] = [
  'architecture',
  'upgrades-and-governance',
  'state-validation',
]

describe(getDiagramImage.name, () => {
  for (const type of diagramTypes) {
    describe(type, () => {
      it('returns the correct path if the file exists', async () => {
        const result = getDiagramImage(type, fileName, {
          existsSync: () => true,
        })
        expect(result).toEqual(`/images/${type}/${fileName}.png`)
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
