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

  describe('link', () => {
    describe('links', () => {
      describe('all links do not contain spaces', () => {
        for (const zkCatalogProject of zkCatalogProjects) {
          it(zkCatalogProject.display.name, () => {
            expect(zkCatalogProject.display.link).not.toInclude(' ')
          })
        }
      })
      describe('do not include www part', () => {
        for (const zkCatalogProject of zkCatalogProjects) {
          it(zkCatalogProject.display.name, () => {
            expect(zkCatalogProject.display.link).not.toInclude('www')
          })
        }
      })
    })
  })
})
