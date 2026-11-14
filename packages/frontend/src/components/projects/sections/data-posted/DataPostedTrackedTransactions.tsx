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
import { SubsectionHeading } from '../Subsection'
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
    : daTrackingConfig.filter((x) => !x.untilBlock)

  const hasHistoricalTransactions = daTrackingConfig.some((x) => !!x.untilBlock)

  return (
    <Collapsible className="group rounded-lg border border-divider">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 font-semibold text-label-value-16 md:px-6">
        Tracked transactions
        <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 fill-secondary transition-transform duration-300" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 md:px-6">
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
          <SubsectionHeading className="mb-3 font-semibold text-label-value-15">
            Blob submissions
          </SubsectionHeading>
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
      {showHistoricalTransactions && (
        <div className="mb-2 flex items-center gap-2">
          <Badge type={transaction.untilBlock ? 'gray' : 'pink'} size="small">
            {transaction.untilBlock ? 'Historical' : 'Currently used'}
          </Badge>
        </div>
      )}

      <div className="border-divider border-l-2 pl-3">
        <p className="mb-1 text-sm">
          <span className="font-medium">DA layer: </span>
          {transaction.daLayerName}
        </p>
        <p className="mb-1 text-sm">
          <span className="font-medium">Blocks: </span>
          {transaction.untilBlock
            ? `${transaction.sinceBlock} – ${transaction.untilBlock}`
            : `from ${transaction.sinceBlock}`}
        </p>
        <div className="mb-1 text-sm">
          <span className="font-medium">Inbox: </span>
          <EtherscanLink address={transaction.inbox} />
        </div>
        {transaction.sequencers && transaction.sequencers.length > 0 && (
          <div className="mb-1 text-sm">
            <span className="font-medium">Sequencers: </span>
            <div className="inline-flex flex-wrap gap-x-1.5">
              {transaction.sequencers?.map((sequencer, i, all) => (
                <span key={sequencer} className="whitespace-nowrap">
                  <EtherscanLink address={sequencer} />
                  {i < all.length - 1 && ','}
                </span>
              ))}
            </div>
          </div>
        )}
        {transaction.topics && transaction.topics.length > 0 && (
          <div className="mb-1 text-sm">
            <span className="font-medium">Topics: </span>
            <div>
              {transaction.topics?.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
