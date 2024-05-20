import { layer2s } from '@l2beat/config'
import Image from 'next/image'
import { ClassNameValue } from 'tailwind-merge'
import { formatUnits } from 'viem'
import { Card } from '~/components/Card'
import { getChainStage } from '~/utils/chains'
import { cn } from '~/utils/cn'
import { StageBadge } from './StageBadge'
import { Cell, TableRow } from './TableRow'
import {} from './Warning'

const TABLE_COLUMNS: {
  name: string
  className?: ClassNameValue
}[] = [
  {
    name: 'VALUE',
  },
  {
    name: 'NAME',
    className: 'pl-12',
  },
  {
    name: 'TYPE',
  },
  {
    name: '',
  },
  {
    name: '',
  },
]

export type Token = {
  token: {
    id: string
    name: string
    decimals: number
    symbol: string
    iconUrl?: string
    bridge?: string | null
  }
  chain: {
    id: number
    name: string
  }
  balance: bigint | null
}

interface TokensTableProps {
  tokens: Token[]
}

export function TokensTable(props: TokensTableProps) {
  return (
    <Card className="rounded-none sm:rounded-xl overflow-x-auto">
      <h2 className="text-xl font-bold">Assets</h2>
      <div
        className={cn(
          'mt-3 overflow-x-auto whitespace-pre pb-3 text-base md:mt-6',
          '-mx-4 w-[calc(100%_+_32px)] px-4 md:-mx-12 md:w-[calc(100%_+_96px)] md:px-12',
        )}
      >
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-b-gray-200 dark:border-b-zinc-700">
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <TableColumnHeader
                  key={column.name}
                  column={column.name}
                  className={column.className}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {props.tokens.map((token) => {
              const chain =
                token.chain.id === 1
                  ? {
                      stage: null,
                      technology: null,
                      riskView: null,
                    }
                  : layer2s.find(
                      (l2) => l2.chainConfig?.chainId === token.chain.id,
                    )
              return (
                <TableRow
                  chain={chain?.technology}
                  key={`${token.chain.id}-${token.token.id}`}
                >
                  <RowContent token={token} />
                </TableRow>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function RowContent({ token }: { token: Token }) {
  const stage = getChainStage(token.chain.id)
  return (
    <>
      <Cell className="text-gray-500 font-medium text-sm">
        {token.balance && formatUnits(token.balance, token.token.decimals)}
        &nbsp;
        {token.token.symbol}
      </Cell>
      <Cell className="flex items-center gap-2">
        {token.token.iconUrl && (
          <Image
            src={token.token.iconUrl}
            alt={`${token.token.name} icon`}
            width={32}
            height={32}
            className="size-8"
          />
        )}
        <div className="flex flex-col">
          <span className="font-bold text-lg">{token.token.name}</span>
          <div className="font-normal flex items-center text-sm text-gray-500">
            on <span className="font-medium">{token.chain.name}</span>
            &nbsp;
            {stage && <StageBadge stage={stage} />}&nbsp;
            {token.token.bridge && `bridged via ${token.token.bridge}`}
          </div>
        </div>
      </Cell>
      <Cell>TYPE</Cell>
    </>
  )
}

function TableColumnHeader({
  column,
  className,
}: { column: string; className?: ClassNameValue }) {
  return (
    <th
      className={cn(
        'whitespace-pre py-2 pl-2 align-bottom text-sm font-medium uppercase text-gray-500 dark:text-gray-50',
        'pr-3 last:pr-0 md:pr-4',
        'rounded-tl-lg',
        'rounded-tr-lg',
        className,
      )}
    >
      <div className={cn('flex flex-row items-end gap-1.5')}>{column}</div>
    </th>
  )
}
