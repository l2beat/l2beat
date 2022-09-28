import { expect } from 'earljs'

import {
  bridges,
  BridgeTechnology,
  ProjectRisk,
  ProjectTechnologyChoice,
} from '../src'

describe('bridges', () => {
  describe('technology', () => {
    for (const bridge of bridges) {
      describe(bridge.display.name, () => {
        type Key = Exclude<
          keyof BridgeTechnology,
          'canonical' | 'type' | 'destination'
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

        function checkRisk(risk: ProjectRisk, name: string) {
          it(`${name} is correctly formatted`, () => {
            expect(risk.text).toEqual(expect.stringMatching(/^[a-z].*\.$/))
          })
        }

        check('principleOfOperation')
        check('validation')
        check('destinationToken')
      })
    }
  })
})
