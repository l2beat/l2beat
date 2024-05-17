import Image from 'next/image'
import { formatUnits } from 'viem'
import { Card } from '~/components/Card'
import { getChainStage } from '~/utils/chains'
import { cn } from '~/utils/cn'
import { StageBadge } from './StageBadge'

const TABLE_COLUMNS = ['VALUE', 'NAME', 'TYPE']

type Token = {
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
    <Card className="rounded-none sm:rounded-xl">
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
                <TableColumnHeader key={column} column={column} />
              ))}
            </tr>
          </thead>
          <tbody>
            {props.tokens.map((token) => (
              <TableRow
                token={token}
                key={`${token.chain.id}-${token.token.id}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function TableRow({ token }: { token: Token }) {
  const stage = getChainStage(token.chain.id)
  return (
    <tr
      className={cn(
        'cursor-pointer border-b border-b-gray-200 dark:border-b-zinc-700',
        'hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.1]',
      )}
    >
      <td className={cn('h-16 text-gray-500 font-medium text-sm')}>
        {token.balance && formatUnits(token.balance, token.token.decimals)}
        &nbsp;
        {token.token.symbol}
      </td>
      <td className={cn('h-16 flex items-center gap-2 py-2')}>
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
            on <span className="font-medium">{token.chain.name}</span>&nbsp;
            {stage && <StageBadge stage={stage} />}&nbsp;
            {token.token.bridge && `bridged via ${token.token.bridge}`}
          </div>
        </div>
      </td>
      <td className={cn('h-16')}>TYPE</td>
    </tr>
  )
}

function TableColumnHeader({ column }: { column: string }) {
  return (
    <th
      className={cn(
        'whitespace-pre py-2 align-bottom text-sm font-medium uppercase text-gray-500 dark:text-gray-50',
        'pr-3 last:pr-0 md:pr-4',
        'rounded-tl-lg',
        'rounded-tr-lg',
      )}
    >
      <div className={cn('flex flex-row items-end gap-1.5')}>{column}</div>
    </th>
  )
}
