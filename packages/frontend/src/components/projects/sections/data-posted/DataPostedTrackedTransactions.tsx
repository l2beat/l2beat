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
import { formatTimestamp } from '~/utils/dates'
import type { DataPostedSectionProps } from './DataPostedSection'

export function DataPostedTrackedTransactions({
  daTrackingConfig,
}: {
  daTrackingConfig: DataPostedSectionProps['daTrackingConfig']
}) {
  const [showHistoricalTransactions, setShowHistoricalTransactions] =
    useState(false)

  if (!daTrackingConfig) {
    return null
  }

  const transactions = showHistoricalTransactions
    ? daTrackingConfig
    : daTrackingConfig.filter((x) =>
        x.type === 'eigen-da' ? !x.untilTimestamp : !x.untilBlock,
      )

  const hasHistoricalTransactions = daTrackingConfig.some((x) =>
    x.type === 'eigen-da' ? !!x.untilTimestamp : !!x.untilBlock,
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
  transaction: DataPostedSectionProps['daTrackingConfig'][number]
  showHistoricalTransactions: boolean
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between max-lg:flex-col lg:gap-2">
        <div className="flex items-center gap-2">
          {showHistoricalTransactions ? (
            (
              transaction.type === 'eigen-da'
                ? transaction.untilTimestamp
                : transaction.untilBlock
            ) ? (
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
          DA layer: {transaction.daLayerName}
        </p>
        {transaction.type === 'eigen-da' ? (
          <p className="mb-1 text-secondary text-sm">
            From:{' '}
            {formatTimestamp(transaction.sinceTimestamp, {
              mode: 'datetime',
              longMonthName: false,
            })}{' '}
            - To:{' '}
            {transaction.untilTimestamp
              ? formatTimestamp(transaction.untilTimestamp, {
                  mode: 'datetime',
                  longMonthName: false,
                })
              : 'Now'}
          </p>
        ) : (
          <p className="mb-1 text-secondary text-sm">
            From: {transaction.sinceBlock} block - To:{' '}
            {transaction.untilBlock ?? 'Now'}
          </p>
        )}
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

        {transaction.type === 'eigen-da' && (
          <div className="mb-1 text-secondary text-sm">
            <span>Customer ID: </span>
            <span className="wrap-break-word">{transaction.customerId}</span>
          </div>
        )}
      </div>
    </div>
  )
}
