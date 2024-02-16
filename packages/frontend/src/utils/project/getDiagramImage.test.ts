import { expect } from 'earl';
import mockFs from 'mock-fs';
import path from 'path';

import { getDiagramImage } from "./getDiagramImage";

describe(getDiagramImage.name, () => {

  it('returns the correct path if the file exists', () => {
    mockFs({
      [path.join(__dirname, `../../static/images/upgrades-and-governance/l2beat.png`)]: 'content'
    })

    const result = getDiagramImage('upgrades-and-governance', 'l2beat')
    expect(result).toEqual('/images/upgrades-and-governance/l2beat.png')

    mockFs.restore()
  })

  it('returns undefined if the file does not exist', () => {
    const result = getDiagramImage('upgrades-and-governance', 'l2beat')
    expect(result).toBeNullish()
  })
})