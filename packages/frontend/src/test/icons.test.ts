import { bridges, layer2s } from '@l2beat/config'
import { expect } from 'earl'
import { existsSync } from 'fs'
import path from 'path'

describe('icons', () => {
  for (const project of [...layer2s, ...bridges]) {
    it(`${project.display.name} has an associated icon`, () => {
      const iconPath = path.join(
        __dirname,
        `../static/icons/${project.display.slug}.png`,
      )
      expect(existsSync(iconPath)).toEqual(true)
    })
  }
})
