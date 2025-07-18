import { assert } from '@l2beat/shared-pure'
import { CircleQuestionMarkIcon } from '~/icons/CircleQuestionMark'
import { UnverifiedIcon } from '~/icons/Unverified'
import { VerifiedIcon } from '~/icons/Verified'

interface Props {
  successfulCount: number
  unsuccessfulCount: number
  notVerifiedCount: number
}

export function VerifiedCountWithDetails({
  successfulCount,
  unsuccessfulCount,
  notVerifiedCount,
}: Props) {
  const totalCount = successfulCount + unsuccessfulCount + notVerifiedCount

  const groupedByStatus = [
    { Icon: VerifiedIcon, count: successfulCount },
    { Icon: CircleQuestionMarkIcon, count: notVerifiedCount },
    { Icon: UnverifiedIcon, count: unsuccessfulCount },
  ].filter((item) => item.count > 0)

  const isOnlyOneStatus = groupedByStatus.length === 1

  if (isOnlyOneStatus) {
    const status = groupedByStatus[0]
    assert(status, 'status should be defined')
    const { count, Icon } = status
    return (
      <div className="flex items-center gap-0.5">
        <span>{count}</span>
        {<Icon />}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 leading-none">
      <span>{totalCount}</span>
      <div className="select-none font-medium text-base text-secondary">
        (
        <div className="inline-flex items-center gap-1">
          {successfulCount > 0 ? (
            <div className="flex items-center">
              <span>{successfulCount}</span>
              <VerifiedIcon className="inline size-4" />
            </div>
          ) : null}
          {notVerifiedCount > 0 ? (
            <div className="flex items-center">
              <span>{notVerifiedCount}</span>
              <CircleQuestionMarkIcon className="inline size-4" />
            </div>
          ) : null}
          {unsuccessfulCount > 0 ? (
            <div className="flex items-center">
              <span>{unsuccessfulCount}</span>
              <UnverifiedIcon className="inline size-4 fill-red-700 dark:fill-red-300" />
            </div>
          ) : null}
        </div>
        )
      </div>
    </div>
  )
}
