import { ProjectId, TokenId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { type Formula, ProjectTvsConfigSchema, isAmountFormula } from '../types'

type FormulaTest = (formula: Formula) => void

describe('tvs', () => {
  const projects = getProjects().filter((p) => p.tvsConfig)

  it(`throws when token config has wrong schema`, () => {
    const mockTvsConfig = {
      projectId: ProjectId('project'),
      tokens: [
        {
          mode: 'auto',
          id: TokenId('token-1'),
          priceId: 'price-id',
          symbol: 'TKN',
          name: 'Token',
          amount: {
            type: 'totalSupply',
            address: 'wrong-address',
            chain: 'chain',
            decimals: 18,
            sinceTimestamp: 1729881083,
          },
          category: 'wrong-category',
          source: 'canonical',
          isAssociated: false,
        },
      ],
    }

    const expectedErrors = [
      {
        code: 'custom',
        message: 'Failed to transform to EthereumAddress type',
        path: ['tokens', 0, 'amount', 'address'],
      },
      {
        received: 'wrong-category',
        code: 'invalid_enum_value',
        options: ['ether', 'stablecoin', 'other'],
        path: ['tokens', 0, 'category'],
        message:
          "Invalid enum value. Expected 'ether' | 'stablecoin' | 'other', received 'wrong-category'",
      },
    ]

    expect(() => ProjectTvsConfigSchema.parse(mockTvsConfig)).toThrow(
      JSON.stringify(expectedErrors, null, 2),
    )
  })

  for (const project of projects) {
    it(`project ${project.id} has correct tvs config`, () => {
      const tokenIds = new Set<string>()
      for (const token of project.tvsConfig!) {
        // token has unique id within the project
        expect(tokenIds.has(token.id)).toEqual(false)
        tokenIds.add(token.id)

        // if untilTimestamp defined then > sinceTimestamp
        const untilLaterThanSince: FormulaTest = (formula) => {
          if (
            formula.type !== 'calculation' &&
            formula.type !== 'value' &&
            formula.untilTimestamp
          ) {
            expect(formula.sinceTimestamp).toBeLessThanOrEqual(0)
          }
        }

        // if amount is CalculationFormula it can't include ValueFormula as argument
        const noValueFormula: FormulaTest = (formula) => {
          if (formula.type === 'calculation') {
            for (const arg of formula.arguments) {
              expect(arg.type).not.toEqual('value')
            }
          }
        }

        // CalculationFormula have at least two arguments (diff has max two)
        const hasCorrectNumberOfArguments: FormulaTest = (formula) => {
          if (formula.type === 'calculation') {
            expect(formula.arguments.length).toBeGreaterThan(1)
            if (formula.operator === 'diff') {
              expect(formula.arguments.length).toEqual(2)
            }
          }
        }

        // do not mix Amount and Value formulas in one calculation
        const noMixedArguments: FormulaTest = (formula) => {
          if (formula.type === 'calculation') {
            const hasValue = formula.arguments.some(
              (arg) => arg.type === 'value',
            )
            const hasAmount = formula.arguments.some((arg) =>
              isAmountFormula(arg),
            )

            expect(hasValue && hasAmount).toEqual(false)
          }
        }

        const commonTests = [
          untilLaterThanSince,
          hasCorrectNumberOfArguments,
          noMixedArguments,
        ]

        testRecursive(token.amount, [noValueFormula, ...commonTests])
        testRecursive(token.valueForProject, [...commonTests])
        testRecursive(token.valueForSummary, [...commonTests])
      }
    })
  }
})

function testRecursive(
  formula: Formula | undefined,
  tests: ((formula: Formula) => void)[],
) {
  if (!formula) {
    return
  }

  for (const test of tests) {
    test(formula)
  }

  if (formula.type !== 'calculation') {
    return
  }

  for (const arg of formula.arguments) {
    testRecursive(arg, tests)
  }
}
