import type { Formula } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import { EtherscanLink } from '~/components/EtherscanLink'

export function renderFormulaSubComponent<T extends { formula: Formula }>({
  row,
}: {
  row: Row<T>
}) {
  return (
    <div className="ml-[52px] flex flex-col py-3">
      <p className="font-normal text-xs">The value is calculated as:</p>
      <div className="rounded-lg bg-surface-secondary p-3">
        <Formula formula={row.original.formula} />
      </div>
    </div>
  )
}

function Formula({ formula }: { formula: Formula }) {
  switch (formula.type) {
    case 'balanceOfEscrow':
      return <BalanceOfEscrow formula={formula} />
    case 'circulatingSupply':
      return <CirculatingSupply formula={formula} />
    case 'calculation':
      return <Calculation formula={formula} />
    case 'const':
      return <Const formula={formula} />
    case 'starknetTotalSupply':
    case 'totalSupply':
      return <TotalSupply formula={formula} />
    case 'value':
      return <Value formula={formula} />
    default:
      assertUnreachable(formula)
  }
}

function BalanceOfEscrow({
  formula,
}: {
  formula: Extract<Formula, { type: 'balanceOfEscrow' }>
}) {
  return (
    <p>
      Balance of <EtherscanLink address={formula.escrowAddress} />{' '}
      {formula.chain}
    </p>
  )
}

function CirculatingSupply({
  formula,
}: {
  formula: Extract<Formula, { type: 'circulatingSupply' }>
}) {
  return (
    <p>
      Circulating supply of <EtherscanLink address={formula.address} />
    </p>
  )
}

function Calculation({
  formula,
}: {
  formula: Extract<Formula, { type: 'calculation' }>
}) {
  return (
    <div className="flex flex-col gap-2">
      {formula.operator}
      {formula.arguments.map((arg) => (
        <Formula key={arg.type} formula={arg} />
      ))}
    </div>
  )
}

const formatter = new Intl.NumberFormat('en-US')
function Const({ formula }: { formula: Extract<Formula, { type: 'const' }> }) {
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
  formula: Extract<Formula, { type: 'starknetTotalSupply' | 'totalSupply' }>
}) {
  return (
    <p>
      Total supply of <EtherscanLink address={formula.address} />
    </p>
  )
}

function Value({ formula }: { formula: Extract<Formula, { type: 'value' }> }) {
  return <p>A value of {formula.priceId}</p>
}
