import { UnixTime } from '@l2beat/shared'
import { expect } from 'earljs'

import { ProjectTechnologyChoice } from '../common/ProjectTechnologyChoice'
import { NUGGETS } from '../layer2s'
import { checkRisk } from '../test/helpers'
import { bridges, BridgeTechnology } from './index'

describe('bridges', () => {
  describe('technology', () => {
    for (const bridge of bridges) {
      describe(bridge.display.name, () => {
        type Key = Exclude<
          keyof BridgeTechnology,
          'canonical' | 'category' | 'destination'
        >

        function check(key: Key) {
          const item = bridge.technology[key]
          if (item) {
            checkChoice(item, key)
          }
        }

        function checkChoice(choice: ProjectTechnologyChoice, name: string) {
          it(`${name}.name doesn't end with a dot`, () => {
            expect(choice.name.endsWith('.')).toEqual(false)
          })

          it(`${name}.description ends with a dot`, () => {
            expect(choice.description.endsWith('.')).toEqual(true)
          })

          describe('risks', () => {
            for (const [i, risk] of choice.risks.entries()) {
              checkRisk(risk, `${name}.risks[${i}]`)
            }
          })
        }

        check('principleOfOperation')
        check('validation')
        check('destinationToken')
      })
    }
  })

  describe('milestones', () => {
    describe('name', () => {
      describe('no longer than 50 characters', () => {
        for (const project of bridges) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            it(`Milestone: ${milestone.name} (${project.display.name}) name is no longer than 50 characters`, () => {
              expect(milestone.name.length).toBeLessThanOrEqualTo(50)
            })
          }
        }
      })
    })

    describe('description', () => {
      describe('ends with dot', () => {
        for (const project of bridges) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            if (milestone.description === undefined) {
              continue
            }
            it(`Milestone: ${milestone.name} (${project.display.name}) description ends with a dot`, () => {
              expect(milestone.description?.endsWith('.')).toEqual(true)
            })
          }
        }
      })
      describe('no longer that 100 characters', () => {
        for (const project of bridges) {
          if (project.milestones === undefined) {
            continue
          }
          for (const milestone of project.milestones) {
            if (milestone.description === undefined) {
              continue
            }
            it(`Milestone: ${milestone.name} (${project.display.name}) description is no longer than 100 characters`, () => {
              expect(milestone.description?.length).toBeLessThanOrEqualTo(100)
            })
          }
        }
      })
    })

    describe('date', () => {
      for (const project of bridges) {
        if (project.milestones === undefined) {
          continue
        }
        for (const milestone of project.milestones) {
          it(`Milestone: ${milestone.name} (${project.display.name}) date is full day`, () => {
            expect(
              UnixTime.fromDate(new Date(milestone.date)).isFull('day'),
            ).toEqual(true)
          })
        }
      }
    })

    describe('knowledgeNuggets', () => {
      const knowledgeNuggets = bridges.flatMap(
        (nugget) => nugget.knowledgeNuggets ?? [],
      )

      describe('title fits character limit', () => {
        knowledgeNuggets.forEach((nugget) => {
          it(nugget.title, () => {
            expect(nugget.title.length).toBeLessThanOrEqualTo(40)
          })
        })
      })

      describe('uses static thumbnail', () => {
        const staticThumbnails = Object.values(NUGGETS.THUMBNAILS)
        knowledgeNuggets
          .filter((x) => x.thumbnail !== undefined)
          .forEach((nugget) => {
            it(nugget.title, () => {
              expect(staticThumbnails).toBeAnArrayWith(nugget.thumbnail)
            })
          })
      })
    })
  })
})
