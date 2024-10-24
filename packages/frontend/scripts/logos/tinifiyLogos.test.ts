import crypto from 'crypto'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import {
  resolvedBridges,
  resolvedLayer2s,
  resolvedLayer3s,
} from '@l2beat/config/projects'
import { expect } from 'earl'

const projects = [...resolvedLayer2s, ...resolvedBridges, ...resolvedLayer3s]

describe('meta images', () => {
  for (const project of projects) {
    it(`${project.display.name} has a meta image`, () => {
      const iconPath = path.join(
        __dirname,
        `../../public/icons/${project.display.slug}.png`,
      )
      expect(existsSync(iconPath)).toEqual(true)
    })
  }
})

describe('icons', () => {
  for (const project of projects) {
    it(`${project.display.name} has an associated icon`, () => {
      const iconPath = path.join(
        __dirname,
        `../../public/icons/${project.display.slug}.png`,
      )
      expect(existsSync(iconPath)).toEqual(true)
    })
  }

  describe('every icon has proper dimensions, size and has been tinified ', () => {
    for (const project of projects) {
      const id = project.id.toString()
      const tinifiedLogos = getTinifiedLogos()

      it(id, () => {
        const iconPath = path.join(
          __dirname,
          `../../public/icons/${project.display.slug}.png`,
        )

        const buffer = readFileSync(iconPath)
        const width = buffer.readUInt32BE(16)
        const height = buffer.readUInt32BE(20)
        const size = buffer.length
        const hash = crypto.createHash('md5').update(buffer).digest('hex')

        expect(width).toEqual(128)
        expect(height).toEqual(128)
        expect(size).toBeLessThanOrEqual(14796)
        expect(tinifiedLogos[`${project.display.slug}.png`]).toEqual(hash)
      })
    }
  })
})

function getTinifiedLogos() {
  const tinifiedLogosFile = path.join(
    __dirname,
    '../../scripts/logos/tinifiedLogos.json',
  )

  const tinifiedLogos = readFileSync(tinifiedLogosFile, 'utf-8')
  return JSON.parse(tinifiedLogos) as Record<string, string>
}
