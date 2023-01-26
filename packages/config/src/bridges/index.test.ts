import { expect } from 'earljs'

import { ProjectTechnologyChoice } from '../common/ProjectTechnologyChoice'
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
})
