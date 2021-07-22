import { expect } from 'chai'
import { utils } from 'ethers'
import { projects } from '../src/projects'
import { getTokenBySymbol } from '../src/tokens'

describe('projects', () => {
  describe('every slug is valid', () => {
    for (const project of projects) {
      it(project.slug, () => {
        expect(project.slug).to.match(/^[a-z\d]+$/)
      })
    }
  })

  describe('addresses', () => {
    const addresses = projects.flatMap((x) => x.bridges.map((x) => x.address))

    describe('every addresses is valid and formatted', () => {
      for (const address of addresses) {
        it(address, () => {
          expect(utils.getAddress(address)).to.equal(address)
        })
      }
    })

    it('every bridge has a unique address', () => {
      const everyUnique = addresses.every((x, i) => addresses.indexOf(x) === i)
      expect(everyUnique).to.equal(true)
    })
  })

  describe('every purpose is short', () => {
    const purposes = projects.map((x) => x.details.purpose)
    for (const purpose of purposes) {
      it(purpose, () => {
        expect(purpose.length).to.be.lessThanOrEqual(20)
      })
    }
  })

  describe('every token is valid', () => {
    const symbols = projects
      .flatMap((x) => x.bridges.flatMap((x) => x.tokens))
      .filter((x, i, a) => a.indexOf(x) === i)
    for (const symbol of symbols) {
      it(symbol, () => {
        expect(() => getTokenBySymbol(symbol)).not.to.throw()
      })
    }
  })

  describe('links', () => {
    describe('every project has at least one website link', () => {
      for (const project of projects) {
        it(project.name, () => {
          expect(project.details.links.websites.length).to.be.greaterThan(0)
        })
      }
    })

    describe('every link is https', () => {
      const links = projects.flatMap((x) =>
        Object.values(x.details.links).flat()
      )
      for (const link of links) {
        it(link, () => {
          expect(link).to.match(/^https:\/\//)
        })
      }
    })

    describe('social media links are properly formatted', () => {
      const links = projects.flatMap((x) => x.details.links.socialMedia)
      for (const link of links) {
        it(link, () => {
          if (link.includes('discord')) {
            expect(link).to.match(/^https:\/\/discord\.gg\/\w+$/)
          } else if (link.includes('t.me')) {
            expect(link).to.match(/^https:\/\/t\.me\/\w+$/)
          } else if (link.includes('medium')) {
            expect(link).to.match(/^https:\/\/medium\.com\/[@\w-]+$/)
          } else if (link.includes('twitter')) {
            expect(link).to.match(/^https:\/\/twitter\.com\/[\w-]+$/)
          } else if (link.includes('reddit')) {
            expect(link).to.match(/^https:\/\/reddit\.com\/r\/[\w-]+\/$/)
          } else if (link.includes('youtube')) {
            if (!link.includes('playlist')) {
              expect(link).to.match(
                /^https:\/\/youtube\.com\/(c|channel)\/[\w-]+$/
              )
            }
          } else if (link.includes('twitch')) {
            expect(link).to.match(/^https:\/\/twitch\.tv\/[\w-]+$/)
          } else if (link.includes('gitter')) {
            expect(link).to.match(/^https:\/\/gitter\.im\/[\w-/]+$/)
          }
        })
      }
    })
  })
})
