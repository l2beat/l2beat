import { assert } from '@l2beat/shared-pure'
import CircleQuestionMark from '~/icons/circle-question-mark.svg'
import UnverifiedIcon from '~/icons/unverified.svg'
import VerifiedIcon from '~/icons/verified.svg'

import { type ZkCatalogProjectDetails } from './ZkCatalogProjectPage'

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

  const groupedByStatus = [
    { Icon: VerifiedIcon, count: successfullyVerifiedCount },
    { Icon: CircleQuestionMark, count: notVerifiedCount },
    { Icon: UnverifiedIcon, count: unsuccessfullyVerifiedCount },
  ].filter((item) => item.count > 0)

  const isOnlyOneStatus = groupedByStatus.length === 1

  if (isOnlyOneStatus) {
    const status = groupedByStatus[0]
    assert(status, 'status should be defined')
    const { count, Icon } = status
    return (
      <div className="flex items-center">
        <span>{count}</span>
        {<Icon />}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 leading-none">
      <span>{props.verifiers.length}</span>
      <div className="select-none font-medium text-base text-zinc-500 dark:text-gray-50">
        (
        <div className="inline-flex items-center gap-1">
          {successfullyVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{successfullyVerifiedCount}</span>
              <VerifiedIcon className="inline size-4" />
            </div>
          ) : null}
          {notVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{notVerifiedCount}</span>
              <CircleQuestionMark className="inline size-4" />
            </div>
          ) : null}
          {unsuccessfullyVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{unsuccessfullyVerifiedCount}</span>
              <UnverifiedIcon className="inline size-4 fill-red-700 dark:fill-red-300" />
            </div>
          ) : null}
        </div>
        )
      </div>
    </div>
  )
}
