import { bridges, layer2s, layer3s } from '@l2beat/config'
import { expect } from 'earl'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

describe('icons', () => {
  const projects = [...layer2s, ...bridges, ...layer3s]
  for (const project of projects) {
    it(`${project.display.name} has an associated icon`, () => {
      const iconPath = path.join(
        __dirname,
        `../static/icons/${project.display.slug}.png`,
      )
      expect(existsSync(iconPath)).toEqual(true)
    })
  }

  describe('every icon has proper dimensions and size', () => {
    for (const project of projects) {
      const id = project.id.toString()

      it(id, () => {
        const iconPath = path.join(
          __dirname,
          `../static/icons/${project.display.slug}.png`,
        )

        const buffer = readFileSync(iconPath)
        const width = buffer.readUInt32BE(16)
        const height = buffer.readUInt32BE(20)
        const size = buffer.length

        expect(width).toEqual(128)
        expect(height).toEqual(128)
        expect(size).toBeLessThanOrEqual(10240)
      })
    }
  })

  describe('every icon has been tinified', () => {
    const tinifiedLogos = getTinifiedLogos()
    for (const project of projects) {
      const id = project.id.toString()

      it(id, () => {
        expect(tinifiedLogos.includes(`${project.display.slug}.png`)).toEqual(
          true,
        )
      })
    }
  })
})

function getTinifiedLogos() {
  const tinifiedLogosFile = path.join(
    __dirname,
    '..',
    '..',
    'cli',
    'tinifiedLogos.json',
  )

  const tinifiedLogos = readFileSync(tinifiedLogosFile, 'utf-8')
  return JSON.parse(tinifiedLogos) as string[]
}
