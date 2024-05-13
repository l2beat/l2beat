import { expect } from 'earl'

import { zkCatalogProjects } from './index'

describe('zkCatalogProjects', () => {
  describe('description', () => {
    describe('ends with a dot', () => {
      for (const zkCatalogProject of zkCatalogProjects) {
        describe(zkCatalogProject.display.name, () => {
          zkCatalogProject.proofVerification.verifiers.forEach((sV) => {
            it(sV.name, () => {
              expect(sV.description.endsWith('.')).toEqual(true)
            })
          })
        })
      }
    })
  })
})
