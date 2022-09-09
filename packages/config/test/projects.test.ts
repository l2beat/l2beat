import { EthereumAddress, ProjectId } from '@l2beat/types'
import { expect } from 'earljs'

import { bridges, layer2s } from '../src'

describe('projects', () => {
  describe('each slug is unique', () => {
    const slugs = new Set<string>()

    for (const project of [...layer2s, ...bridges]) {
      it(project.name, () => {
        expect(slugs.has(project.slug)).toEqual(false)
        slugs.add(project.slug)
      })
    }
  })

  describe('each id is unique', () => {
    const ids = new Set<ProjectId>()

    for (const project of [...layer2s, ...bridges]) {
      it(project.name, () => {
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
      })
    }
  })

  describe('each escrow is unique', () => {
    const addresses = new Set<EthereumAddress>()

    for (const project of [...layer2s, ...bridges]) {
      for (const { address } of project.escrows) {
        it(address, () => {
          expect(addresses.has(EthereumAddress(address))).toEqual(false)
          addresses.add(EthereumAddress(address))
        })
      }
    }
  })
})
