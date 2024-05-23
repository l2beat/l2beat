import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'
import { Link } from '../../../../components/Link'
import { CircleQuestionMark } from '../../../../components/icons/symbols/CircleQuestionMark'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'

interface Props {
  verified: 'yes' | 'no' | 'failed'
  askForVerificationLink: string
}

export function VerifiedCell({ verified, askForVerificationLink }: Props) {
  switch (verified) {
    case 'yes':
      return (
        <span className="text-green-700 text-sm md:text-base dark:text-green-450 flex items-center">
          <VerifiedIcon className="mr-1.5 dark:fill-green-450" />
          <span>Successful</span>
        </span>
      )
    case 'no':
      return (
        <span className="flex items-center text-sm md:text-base">
          <CircleQuestionMark className="mr-1.5" />
          Not verified
          <Link className="ml-4 hidden md:inline" href={askForVerificationLink}>
            Ask for verification
          </Link>
        </span>
      )
    case 'failed':
      return (
        <span className="text-red-700 dark:text-red-300 flex items-center text-sm md:text-base">
          <UnverifiedIcon className="mr-1.5" />
          Unsuccessful
        </span>
      )
    default:
      assertUnreachable(verified)
  }
}
