import { bridges, layer2s } from '@l2beat/config'
import { expect } from 'earl'
import { readdirSync } from 'fs'
import path from 'path'

describe('architecture image', () => {
  const files = readdirSync(path.join(__dirname, '../static/images/')).filter(
    (name) => name.endsWith('.png'),
  )
  const projects = [...layer2s, ...bridges].map((p) => p.display.slug)

  for (const file of files) {
    it(`${file} has an associated project`, () => {
      const project = file.replace('-architecture.png', '')
      expect(projects.includes(project)).toEqual(true)
    })
  }
})
