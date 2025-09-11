import type { CalculationFormula } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import type { ProjectTvsBreakdownTokenEntry } from '~/server/features/scaling/tvs/breakdown/getProjectTokensEntries'
import { cn } from '~/utils/cn'
import { TokenAddressCell } from './cells/TokenAddressCell'

export function renderFormulaSubComponent<
  T extends { formula: ProjectTvsBreakdownTokenEntry['formula'] },
>({ row }: { row: Row<T> }) {
  return (
    <div className="ml-[52px] flex flex-col py-3">
      <p className="mb-1 font-normal text-xs">The value is calculated as:</p>
      <div className="rounded-lg bg-surface-secondary p-3 font-medium text-label-value-14">
        <FormulaWithOperator
          formula={row.original.formula}
          operator={
            row.original.formula.type === 'calculation' ? undefined : 'sum'
          }
        />
      </div>
    </div>
  )
}

function FormulaWithOperator({
  formula,
  operator,
  depth = 0,
  className,
}: {
  formula: ProjectTvsBreakdownTokenEntry['formula']
  operator?: CalculationFormula['operator']
  depth?: number
  className?: string
}) {
  return (
    <div className={cn('flex gap-4', className)}>
      {operator && <Operator operator={operator} />}
      <Formula formula={formula} depth={depth} />
    </div>
  )
}

function Formula({
  formula,
  depth,
}: {
  formula: ProjectTvsBreakdownTokenEntry['formula']
  depth: number
}) {
  switch (formula.type) {
    case 'balanceOfEscrow':
      return <BalanceOfEscrow formula={formula} />
    case 'circulatingSupply':
      return <CirculatingSupply formula={formula} />
    case 'calculation':
      return <Calculation formula={formula} depth={depth} />
    case 'const':
      return <Const formula={formula} />
    case 'starknetTotalSupply':
    case 'totalSupply':
      return <TotalSupply formula={formula} />
    case 'value':
      return <Formula formula={formula.amount} depth={depth} />
    default:
      assertUnreachable(formula)
  }
}

function Operator({ operator }: { operator: CalculationFormula['operator'] }) {
  switch (operator) {
    case 'sum':
      return (
        <div className="font-mono text-label-value-14 text-positive">
          <span className="mr-4">+</span>
          <span className="inline-block w-[51px] text-center">add</span>
        </div>
      )
    case 'diff':
      return (
        <div className="font-mono text-label-value-14 text-negative">
          <span className="mr-4">-</span>
          <span className="inline-block w-[51px] text-center">deduct</span>
        </div>
      )
    case 'min':
    case 'max':
      return null
    default:
      assertUnreachable(operator)
  }
}

function BalanceOfEscrow({
  formula,
}: {
  formula: Extract<
    ProjectTvsBreakdownTokenEntry['formula'],
    { type: 'balanceOfEscrow' }
  >
}) {
  if (formula.addressMeta.address === 'native') {
    return (
      <p>
        Balance in <TokenAddressCell {...formula.escrowAddressMeta} />
      </p>
    )
  }
  return (
    <p>
      Balance of <TokenAddressCell {...formula.addressMeta} /> in{' '}
      <TokenAddressCell {...formula.escrowAddressMeta} />
    </p>
  )
}

function CirculatingSupply({
  formula,
}: {
  formula: Extract<
    ProjectTvsBreakdownTokenEntry['formula'],
    { type: 'circulatingSupply' }
  >
}) {
  return (
    <p>
      Circulating supply of <TokenAddressCell {...formula.addressMeta} />
    </p>
  )
}

function Calculation({
  formula,
  depth,
}: {
  formula: Extract<
    ProjectTvsBreakdownTokenEntry['formula'],
    { type: 'calculation' }
  >
  depth: number
}) {
  if (formula.operator === 'min' || formula.operator === 'max') {
    return (
      <div>
        {depth !== 0 && (
          <p className="mb-2">{operatorToText(formula.operator)}:</p>
        )}
        <ul className="list-inside list-decimal space-y-2">
          {formula.arguments.map((arg, i) => {
            return (
              <li key={arg.type}>
                <FormulaWithOperator
                  formula={arg}
                  operator={undefined}
                  depth={depth + 1}
                  className="inline-block"
                />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {depth !== 0 && (
        <p className="mb-2">{operatorToText(formula.operator)}:</p>
      )}
      <ul className="space-y-2">
        {formula.arguments.map((arg, i) => {
          const operator =
            i === 0 && formula.operator === 'diff' ? 'sum' : formula.operator
          return (
            <li key={arg.type}>
              <FormulaWithOperator
                formula={arg}
                operator={operator}
                depth={depth + 1}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const formatter = new Intl.NumberFormat('en-US')
function Const({
  formula,
}: {
  formula: Extract<ProjectTvsBreakdownTokenEntry['formula'], { type: 'const' }>
}) {
  return (
    <p>
      A constant of{' '}
      {formatter.format(
        BigInt(formula.value) / 10n ** BigInt(formula.decimals),
      )}
    </p>
  )
}

function TotalSupply({
  formula,
}: {
  formula: Extract<
    ProjectTvsBreakdownTokenEntry['formula'],
    { type: 'starknetTotalSupply' | 'totalSupply' }
  >
}) {
  return (
    <p>
      Total supply of <TokenAddressCell {...formula.addressMeta} />
    </p>
  )
}

function operatorToText(operator: CalculationFormula['operator']) {
  switch (operator) {
    case 'sum':
    case 'diff':
      return 'The result of'
    case 'min':
      return 'The minimum of'
    case 'max':
      return 'The maximum of'
    default:
      return operator
  }
}
