import { expect } from 'earl'
import { unlink, writeFile } from 'fs-extra'
import path from 'path'

import { getDiagramImage } from './getDiagramImage'

const fileName = 'random-file-name-that-does-not-exist'

describe(getDiagramImage.name, () => {
  it('returns the correct path if the file exists', async () => {
    const file = mockFile(
      path.join(
        __dirname,
        `../../static/images/upgrades-and-governance/${fileName}.png`,
      ),
    )
    await file.create()

    const result = getDiagramImage('upgrades-and-governance', fileName)
    expect(result).toEqual(`/images/upgrades-and-governance/${fileName}.png`)

    file.delete()
  })

  it('returns undefined if the file does not exist', () => {
    const result = getDiagramImage('upgrades-and-governance', fileName)
    expect(result).toBeNullish()
  })
})

const mockFile = (filePath: string) => {
  return {
    create: () => writeFile(filePath, 'random-file-content'),
    delete: () => unlink(filePath, () => {}),
  }
}
