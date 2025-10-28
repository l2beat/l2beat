import { useState } from 'react'
import { Badge } from '~/components/badge/Badge'
import { Checkbox } from '~/components/core/Checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EtherscanLink } from '~/components/EtherscanLink'
import { ChevronIcon } from '~/icons/Chevron'
import { InfoIcon } from '~/icons/Info'
import { formatTimestamp } from '~/utils/dates'
import type {
  TrackedTransaction,
  TrackedTransactionsByType,
} from '~/utils/project/tracked-txs/getTrackedTransactions'

export function TrackedTransactions(props: TrackedTransactionsByType) {
  const [showHistoricalTransactions, setShowHistoricalTransactions] =
    useState(false)

  const transactions = {
    batchSubmissions: showHistoricalTransactions
      ? props.batchSubmissions
      : props.batchSubmissions?.filter(
          (transaction) => !transaction.isHistorical,
        ),
    proofSubmissions: showHistoricalTransactions
      ? props.proofSubmissions
      : props.proofSubmissions?.filter(
          (transaction) => !transaction.isHistorical,
        ),
    stateUpdates: showHistoricalTransactions
      ? props.stateUpdates
      : props.stateUpdates?.filter((transaction) => !transaction.isHistorical),
  }

  const hasHistoricalTransactions =
    !!props.batchSubmissions?.some((transaction) => transaction.isHistorical) ||
    !!props.proofSubmissions?.some((transaction) => transaction.isHistorical) ||
    !!props.stateUpdates?.some((transaction) => transaction.isHistorical)

  return (
    <Collapsible className="group rounded-lg border border-divider">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-3 font-bold">
        Tracked transactions
        <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 transition-transform duration-300" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6">
        {hasHistoricalTransactions && (
          <Checkbox
            name="show-historical-transactions"
            className="mb-4"
            checked={showHistoricalTransactions}
            onCheckedChange={(checked) =>
              setShowHistoricalTransactions(!!checked)
            }
          >
            Show historical transactions
          </Checkbox>
        )}
        {transactions.batchSubmissions &&
          transactions.batchSubmissions.length > 0 && (
            <TransactionGroup
              title="Batch submissions"
              transactions={transactions.batchSubmissions}
              showHistoricalTransactions={showHistoricalTransactions}
            />
          )}
        {transactions.proofSubmissions &&
          transactions.proofSubmissions.length > 0 && (
            <TransactionGroup
              title="Proof submissions"
              transactions={transactions.proofSubmissions}
              showHistoricalTransactions={showHistoricalTransactions}
            />
          )}
        {transactions.stateUpdates && transactions.stateUpdates.length > 0 && (
          <TransactionGroup
            title="State updates"
            transactions={transactions.stateUpdates}
            showHistoricalTransactions={showHistoricalTransactions}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function TransactionGroup({
  title,
  transactions,
  showHistoricalTransactions,
}: {
  title: string
  transactions: TrackedTransaction[]
  showHistoricalTransactions: boolean
}) {
  return (
    <div className="mb-6">
      <h2 className="mb-3 font-medium text-base text-secondary">{title}</h2>
      {transactions.map((transaction, index) => (
        <TransactionDetails
          key={index}
          transaction={transaction}
          showHistoricalTransactions={showHistoricalTransactions}
        />
      ))}
    </div>
  )
}

function TransactionDetails({
  transaction,
  showHistoricalTransactions,
}: {
  transaction: TrackedTransaction
  showHistoricalTransactions: boolean
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between max-lg:flex-col lg:gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="font-medium text-xs capitalize">
              {transaction.params.formula}
            </p>
            {transaction.params.formula === 'sharedBridge' && (
              <Tooltip>
                <TooltipTrigger className="inline size-4">
                  <InfoIcon />
                </TooltipTrigger>
                <TooltipContent>
                  Tracked function calls are those ones with first parameter in
                  calldata equal to {transaction.params.firstParameter}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {showHistoricalTransactions ? (
            transaction.isHistorical ? (
              <Badge type="gray" size="small">
                Historical
              </Badge>
            ) : (
              <Badge type="pink" size="small">
                Currently used
              </Badge>
            )
          ) : null}
        </div>
        <p className="text-2xs text-secondary max-md:mt-0.5 md:text-xs">
          {formatTimestamp(transaction.sinceTimestamp, {
            mode: 'datetime',
            longMonthName: false,
          })}{' '}
          -{' '}
          {transaction.untilTimestamp
            ? formatTimestamp(transaction.untilTimestamp, {
                mode: 'datetime',
                longMonthName: false,
              })
            : 'Now'}
        </p>
      </div>

      <div className="border-divider border-l-2 pl-3">
        {transaction.params.formula === 'functionCall' && (
          <>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Address: </span>
              <EtherscanLink address={transaction.params.address} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Selector: </span>
              <span>{transaction.params.selector}</span>
            </div>
            <div className="rounded bg-surface-secondary p-2 text-xs">
              <code className="break-all">{transaction.params.signature}</code>
            </div>
          </>
        )}

        {transaction.params.formula === 'transfer' && (
          <>
            {transaction.params.from && (
              <div className="mb-1 text-sm">
                <span className="text-secondary">From: </span>
                <EtherscanLink address={transaction.params.from} />
              </div>
            )}
            <div className="mb-1 text-sm">
              <span className="text-secondary">To: </span>
              <EtherscanLink address={transaction.params.to} />
            </div>
          </>
        )}

        {transaction.params.formula === 'sharpSubmission' && (
          <div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Address: </span>
              <EtherscanLink address={transaction.params.address} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Selector: </span>
              <span>{transaction.params.selector}</span>
            </div>
            <div className="mb-1 text-secondary text-sm">Program Hashes:</div>
            {transaction.params.programHashes.map((hash, index) => (
              <div
                key={index}
                className="rounded bg-surface-secondary p-2 text-xs"
              >
                <code className="break-all">{hash}</code>
              </div>
            ))}
          </div>
        )}

        {transaction.params.formula === 'sharedBridge' && (
          <>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Address: </span>
              <EtherscanLink address={transaction.params.address} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Selector: </span>
              <span>{transaction.params.selector}</span>
            </div>
            <div className="rounded bg-surface-secondary p-2 text-xs">
              <code className="break-all">{transaction.params.signature}</code>
            </div>
          </>
        )}

        {transaction.costMultiplier && (
          <div className="mt-1 flex items-center gap-0.5 text-sm">
            <div>
              <span className="text-secondary">Multiplier: </span>
              <span>{transaction.costMultiplier}</span>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-3" />
              </TooltipTrigger>
              <TooltipContent>
                Multiple projects are included in the same function call.
                Therefore, transaction costs are split between the projects, and
                the multiplier shows how much of the cost is attributed to the
                specific project.
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}
