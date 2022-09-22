import { EthereumAddress, ProjectId } from '@l2beat/types'
import { expect } from 'earljs'

import { bridges, layer2s } from '../src'

describe('projects', () => {
  describe('every slug is valid', () => {
    for (const project of [...layer2s, ...bridges]) {
      it(project.display.slug, () => {
        expect(project.display.slug).toEqual(
          expect.stringMatching(/^[a-z\d]+$/),
        )
      })
    }
  })

  describe('every slug is unique', () => {
    const slugs = new Set<string>()

    for (const project of [...layer2s, ...bridges]) {
      it(project.display.name, () => {
        expect(slugs.has(project.display.slug)).toEqual(false)
        slugs.add(project.display.slug)
      })
    }
  })

  describe('every id is unique', () => {
    const ids = new Set<ProjectId>()

    for (const project of [...layer2s, ...bridges]) {
      it(project.display.name, () => {
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
      })
    }
  })

  describe('every escrow is unique', () => {
    const addresses = new Set<EthereumAddress>()

    for (const project of [...layer2s, ...bridges]) {
      for (const { address } of project.config.escrows) {
        it(address, () => {
          expect(addresses.has(EthereumAddress(address))).toEqual(false)
          addresses.add(EthereumAddress(address))
        })
      }
    }
  })
})
