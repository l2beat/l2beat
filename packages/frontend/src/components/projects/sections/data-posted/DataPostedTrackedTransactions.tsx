import type {
  BlockDaTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import { useState } from 'react'
import { Badge } from '~/components/badge/Badge'
import { Checkbox } from '~/components/core/Checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { EtherscanLink } from '~/components/EtherscanLink'
import { ChevronIcon } from '~/icons/Chevron'

export function DataPostedTrackedTransactions({
  daTrackingConfig,
}: {
  daTrackingConfig: ProjectDaTrackingConfig[]
}) {
  const [showHistoricalTransactions, setShowHistoricalTransactions] =
    useState(false)

  if (
    !daTrackingConfig ||
    daTrackingConfig.every((x) => x.type === 'eigen-da')
  ) {
    return null
  }

  const configsWithoutEigenDa = daTrackingConfig.filter(
    (x) => x.type !== 'eigen-da',
  )

  const transactions = showHistoricalTransactions
    ? configsWithoutEigenDa
    : configsWithoutEigenDa.filter((x) => !x.untilBlock)

  const hasHistoricalTransactions = configsWithoutEigenDa.some(
    (x) => x.untilBlock,
  )

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
        <div className="mb-6">
          <h2 className="font-medium text-base text-secondary">
            Blob submissions
          </h2>
          {transactions.map((transaction, index) => (
            <TransactionDetails
              key={index}
              transaction={transaction}
              showHistoricalTransactions={showHistoricalTransactions}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function TransactionDetails({
  transaction,
  showHistoricalTransactions,
}: {
  transaction: BlockDaTrackingConfig
  showHistoricalTransactions: boolean
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between max-lg:flex-col lg:gap-2">
        <div className="flex items-center gap-2">
          {showHistoricalTransactions ? (
            transaction.untilBlock ? (
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
      </div>

      <div className="border-divider border-l-2 pl-3">
        <p className="mb-1 text-secondary text-sm">
          From: {transaction.sinceBlock} block - To:{' '}
          {transaction.untilBlock ?? 'Now'}
        </p>
        {transaction.type === 'ethereum' && (
          <>
            <div className="mb-1 text-sm">
              <span className="text-secondary">Inbox: </span>
              <EtherscanLink address={transaction.inbox} />
            </div>
            {transaction.sequencers && transaction.sequencers.length > 0 && (
              <div className="mb-1 text-sm">
                <span className="text-secondary">Sequencers: </span>
                <div className="inline-flex gap-2">
                  {transaction.sequencers?.map((sequencer) => (
                    <EtherscanLink
                      key={sequencer}
                      address={sequencer}
                      className="whitespace-nowrap"
                    />
                  ))}
                </div>
              </div>
            )}
            {transaction.topics && transaction.topics.length > 0 && (
              <div className="mb-1 text-sm">
                <span className="text-secondary">Topics: </span>
                <div>
                  {transaction.topics?.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {transaction.type === 'celestia' && (
          <div className="mb-1 text-secondary text-sm">
            <span>Namespace: </span>
            <span className="wrap-break-word">{transaction.namespace}</span>
          </div>
        )}

        {transaction.type === 'avail' && (
          <div className="mb-1 text-secondary text-sm">
            <span>App IDs: </span>
            <span>{transaction.appIds.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
