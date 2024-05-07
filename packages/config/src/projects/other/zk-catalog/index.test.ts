import { expect } from 'earl'

import { zkCatalogProjects } from './index'

describe('zkCatalogProjects', () => {
  describe('description', () => {
    it('ends with a dot', () => {
      for (const zkCatalogProject of zkCatalogProjects) {
        it(zkCatalogProject.display.name, () => {
          expect(zkCatalogProject.display.description.endsWith('.')).toEqual(
            true,
          )
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
