import { expect } from 'earl'
import { it } from 'mocha'

import { DiagramType, getDiagramImage } from './getDiagramImage'

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
        const result = getDiagramImage(type, fileName, undefined, {
          existsSync: () => true,
        })
        expect(result).toEqual(`/images/${type}/${fileName}.png`)

        const result2 = getDiagramImage(
          type,
          fileName,
          { throwOnMissing: true },
          {
            existsSync: () => true,
          },
        )
        expect(result2).toEqual(`/images/${type}/${fileName}.png`)
      })

      it('throws if the file does not exist and throwOnMissing is true', () => {
        expect(() =>
          getDiagramImage(
            type,
            fileName,
            { throwOnMissing: true },
            {
              existsSync: () => false,
            },
          ),
        ).toThrow(`Diagram image not found: /images/${type}/${fileName}.png`)
      })

      it('returns undefined if the file does not exist', () => {
        const result = getDiagramImage(type, fileName, undefined, {
          existsSync: () => false,
        })
        expect(result).toBeNullish()
      })
    })
  }
})
