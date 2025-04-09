import { assert, ProjectId, TokenId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { type Formula, ProjectTvsConfigSchema, isAmountFormula } from '../types'

type FormulaTest = (formula: Formula) => void

describe('tvs', () => {
  const projects = getProjects().filter((p) => p.tvsConfig)
  const supportedChains = new Set(
    getProjects()
      .filter((p) => p.chainConfig)
      .map((c) => c.chainConfig!.name),
  )

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
        assert(
          tokenIds.has(token.id) === false,
          `Duplicated token id: ${token.id}`,
        )
        tokenIds.add(token.id)

        // if untilTimestamp defined then > sinceTimestamp
        const untilLaterThanSince: FormulaTest = (formula) => {
          if (
            formula.type !== 'calculation' &&
            formula.type !== 'value' &&
            formula.untilTimestamp
          ) {
            assert(
              formula.sinceTimestamp < formula.untilTimestamp,
              `Wrong untilTimestamp for token ${token.id}`,
            )
          }
        }

        // if amount is CalculationFormula it can't include ValueFormula as argument
        const noValueFormula: FormulaTest = (formula) => {
          if (formula.type === 'calculation') {
            for (const arg of formula.arguments) {
              assert(
                arg.type !== 'value',
                `Value formula included in amount for token ${token.id}`,
              )
            }
          }
        }

        // CalculationFormula have at least two arguments (diff has max two)
        const hasCorrectNumberOfArguments: FormulaTest = (formula) => {
          if (formula.type === 'calculation') {
            assert(
              formula.arguments.length > 1,
              `Wrong number of arguments for token ${token.id}`,
            )
            if (formula.operator === 'diff') {
              assert(
                (formula.arguments.length = 2),
                `Wrong number of arguments for token ${token.id}`,
              )
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

            assert(
              (hasValue && hasAmount) === false,
              `Mixed arguments in formula for token ${token.id}`,
            )
          }
        }

        const chainIsSupported: FormulaTest = (formula) => {
          if (
            formula.type === 'balanceOfEscrow' ||
            formula.type === 'totalSupply'
          ) {
            assert(
              supportedChains.has(formula.chain),
              `Unsupported chain ${formula.chain} configured for ${token.id}`,
            )
          }
        }

        const commonTests = [
          untilLaterThanSince,
          hasCorrectNumberOfArguments,
          noMixedArguments,
          chainIsSupported,
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
