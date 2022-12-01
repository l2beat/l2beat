import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { ProjectTechnologyChoice } from '../src/common'
import { layer2s, Layer2Technology } from '../src/layer2s'
import { checkRisk } from './checkRisk'

describe('layer2s', () => {
  describe('sentences', () => {
    describe('every description ends with a dot', () => {
      for (const layer2 of layer2s) {
        it(layer2.display.name, () => {
          expect(layer2.display.description.endsWith('.')).toEqual(true)
        })
      }
    })

    describe('technology', () => {
      for (const layer2 of layer2s) {
        describe(layer2.display.name, () => {
          type Key = Exclude<
            keyof Layer2Technology,
            'category' | 'provider' //TODO: Add test for permissions
          >

          function check(key: Key) {
            const item = layer2.technology[key]
            if (Array.isArray(item)) {
              for (const [i, x] of item.entries()) {
                checkChoice(x, `${key}[${i}]`)
              }
            } else if (item) {
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

          check('stateCorrectness')
          check('newCryptography')
          check('dataAvailability')
          check('operator')
          check('forceTransactions')
          check('exitMechanisms')
          check('massExit')
          check('additionalPrivacy')
          check('smartContracts')
        })
      }
    })
  })

  describe('every purpose is short', () => {
    const purposes = layer2s.map((x) => x.display.purpose)
    for (const purpose of purposes) {
      it(purpose, () => {
        expect(purpose.length).toBeLessThanOrEqualTo(20)
      })
    }
  })

  describe('events', () => {
    for (const project of layer2s) {
      for (const event of project.config.events) {
        it(`${event.name} in ${project.display.name} as correct ABI`, () => {
          expect(event.abi.endsWith(';')).toEqual(false)
        })
      }
    }
  })

  describe('milestones', () => {
    describe('description', () => {
      for (const project of layer2s) {
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

    describe('date', () => {
      for (const project of layer2s) {
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
  })
})
