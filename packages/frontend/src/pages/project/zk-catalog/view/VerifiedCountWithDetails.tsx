import React from 'react'
import { CircleQuestionMark } from '../../../../components/icons/symbols/CircleQuestionMark'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import { ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

interface Props {
  verifiers: ZkCatalogProjectDetails['verifiers']
}

export function VerifiedCountWithDetails(props: Props) {
  const successfullyVerifiedCount = props.verifiers.filter(
    (verifier) => verifier.verified === 'yes',
  ).length
  const unsuccessfullyVerifiedCount = props.verifiers.filter(
    (verifier) => verifier.verified === 'failed',
  ).length
  const notVerifiedCount = props.verifiers.filter(
    (verifier) => verifier.verified === 'no',
  ).length

  return (
    <div className="flex gap-1.5 items-center">
      {props.verifiers.length}
      <div className="flex items-center gap-1 text-zinc-500 dark:text-gray-50 font-medium text-base select-none">
        <div className="flex items-center">
          ({successfullyVerifiedCount}
          <VerifiedIcon className="size-4 inline" />
        </div>
        <div className="flex items-center">
          {notVerifiedCount}
          <CircleQuestionMark className="size-4 inline" />
        </div>
        <div className="flex items-center">
          {unsuccessfullyVerifiedCount}
          <UnverifiedIcon className="size-4 inline fill-red-700 dark:fill-red-300" />
          )
        </div>
      </div>
    </div>
  )
}
