import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'
import { Link } from '../../../../components/Link'
import { CircleQuestionMark } from '../../../../components/icons/symbols/CircleQuestionMark'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { VerifiedIcon } from '../../../../components/icons/symbols/VerifiedIcon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'

interface Props {
  verified: 'yes' | 'no' | 'failed'
  askForVerificationLink: string
}

export function VerifiedCell({ verified, askForVerificationLink }: Props) {
  switch (verified) {
    case 'yes':
      return (
        <Tooltip>
          <TooltipTrigger className="w-max">
            <span className="flex items-center text-green-700 text-sm dark:text-green-450 md:text-base">
              <VerifiedIcon className="mr-1.5 dark:fill-green-450" />
              <span>Successful</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            L2BEAT has tried the verification procedure and was able to
            regenerate the onchain verifier.
          </TooltipContent>
        </Tooltip>
      )
    case 'no':
      return (
        <span className="flex items-center text-sm md:text-base">
          <Tooltip>
            <TooltipTrigger className="flex w-max items-center text-sm md:text-base">
              <CircleQuestionMark className="mr-1.5" />
              Not verified
            </TooltipTrigger>
            <TooltipContent>
              Verification was not performed for this verifier.
            </TooltipContent>
          </Tooltip>
          <Link className="ml-4 hidden md:inline" href={askForVerificationLink}>
            Ask for verification
          </Link>
        </span>
      )
    case 'failed':
      return (
        <Tooltip>
          <TooltipTrigger className="w-max">
            <span className="flex items-center text-red-700 text-sm dark:text-red-300 md:text-base">
              <UnverifiedIcon className="mr-1.5" />
              Unsuccessful
            </span>
          </TooltipTrigger>
          <TooltipContent>
            L2BEAT has tried the verification procedure and wasn't able to
            regenerate the onchain verifier.
          </TooltipContent>
        </Tooltip>
      )
    default:
      assertUnreachable(verified)
  }
}
