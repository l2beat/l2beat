'use client'
import { useState } from 'react'
import { Badge } from '~/components/badge/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/collapsible'
import { Switch } from '~/components/core/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { EtherscanLink } from '~/components/etherscan-link'
import { ChevronIcon } from '~/icons/chevron'
import { InfoIcon } from '~/icons/info'
import { formatTimestamp } from '~/utils/dates'
import type {
  TrackedTransaction,
  TrackedTransactionsByType,
} from '~/utils/project/costs/get-tracked-transactions'

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
        <ChevronIcon className="size-4 transition-transform duration-300 group-data-[state=open]:-rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6">
        {hasHistoricalTransactions && (
          <div className="mb-4 flex items-center gap-2">
            <Switch
              id="show-historical-transactions"
              name="show-historical-transactions"
              checked={showHistoricalTransactions}
              onCheckedChange={setShowHistoricalTransactions}
            />
            <label
              htmlFor="show-historical-transactions"
              className="text-base leading-none"
            >
              Show historical transactions
            </label>
          </div>
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
      <h2 className="mb-3 text-base font-medium text-secondary">{title}</h2>
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
            <p className="text-xs font-medium capitalize">
              {transaction.formula}
            </p>
            {transaction.formula === 'sharedBridge' && (
              <Tooltip>
                <TooltipTrigger className="inline size-4">
                  <InfoIcon />
                </TooltipTrigger>
                <TooltipContent>
                  Tracked function calls are those ones with chain ID in
                  calldata equal to project&apos;s chain ID (
                  {transaction.chainId})
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

      <div className="border-l-2 border-divider pl-3">
        {transaction.formula === 'functionCall' && (
          <>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Address: </span>
              <EtherscanLink address={transaction.address} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Selector: </span>
              <span>{transaction.selector}</span>
            </div>
            <div className="rounded bg-surface-secondary p-2 text-xs">
              <code className="break-all">{transaction.functionSignature}</code>
            </div>
          </>
        )}

        {transaction.formula === 'transfer' && (
          <>
            <div className="mb-1 text-sm">
              <span className="text-secondary">From: </span>
              <EtherscanLink address={transaction.from} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">To: </span>
              <EtherscanLink address={transaction.to} />
            </div>
          </>
        )}

        {transaction.formula === 'sharpSubmission' && (
          <div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Address: </span>
              <EtherscanLink address={transaction.address} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Selector: </span>
              <span>{transaction.selector}</span>
            </div>
            <div className="mb-1 text-sm text-secondary">Program Hashes:</div>
            {transaction.programHashes.map((hash, index) => (
              <div
                key={index}
                className="rounded bg-surface-secondary p-2 text-xs"
              >
                <code className="break-all">{hash}</code>
              </div>
            ))}
          </div>
        )}

        {transaction.formula === 'sharedBridge' && (
          <>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Address: </span>
              <EtherscanLink address={transaction.address} />
            </div>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Selector: </span>
              <span>{transaction.selector}</span>
            </div>
            <div className="rounded bg-surface-secondary p-2 text-xs">
              <code className="break-all">{transaction.functionSignature}</code>
            </div>
          </>
        )}

        {transaction.multiplier && (
          <div className="mt-1 flex items-center gap-0.5 text-sm">
            <div>
              <span className="text-secondary">Multiplier: </span>
              <span>{transaction.multiplier}</span>
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
