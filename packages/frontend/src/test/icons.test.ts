import { bridges, layer2s } from '@l2beat/config'
import { expect } from 'earl'
import { existsSync, readFileSync } from 'fs'
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

  for (const project of [...layer2s, ...bridges]) {
    it(`${project.display.name} every icon has proper size`, () => {
      const iconPath = path.join(
        __dirname,
        `../static/icons/${project.display.slug}.png`,
      )

      const buffer = readFileSync(iconPath)
      const width = buffer.readUInt32BE(16)
      const height = buffer.readUInt32BE(20)

      expect(width).toEqual(256)
      expect(height).toEqual(256)
    })
  }
})
