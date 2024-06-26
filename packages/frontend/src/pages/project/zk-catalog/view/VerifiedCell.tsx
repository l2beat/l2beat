import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'
import { PlainLink } from '../../../../components'
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
  performedBy?: {
    name: string
    link: string
  }
}

export function VerifiedCell({
  verified,
  askForVerificationLink,
  performedBy,
}: Props) {
  switch (verified) {
    case 'yes':
      return (
        <div className="flex w-max flex-col gap-1">
          <Tooltip>
            <TooltipTrigger className="w-max">
              <span className="flex items-center text-green-700 text-sm dark:text-green-450 md:text-base">
                <VerifiedIcon className="mr-1.5 dark:fill-green-450" />
                <span>Successful</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {performedBy?.name} has tried the verification procedure and was
              able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap font-medium text-xs text-zinc-500">
            (performed by{' '}
            {
              <PlainLink className="underline" href={performedBy?.link}>
                {performedBy?.name}
              </PlainLink>
            }
            )
          </div>
        </div>
      )
    case 'no':
      return (
        <span className="flex flex-col items-start text-sm md:text-base">
          <Tooltip>
            <TooltipTrigger className="flex w-max items-center text-sm md:text-base">
              <CircleQuestionMark className="mr-1.5" />
              Not verified
            </TooltipTrigger>
            <TooltipContent>
              Verification was not performed for this verifier.
            </TooltipContent>
          </Tooltip>
          <Link
            className="ml-[26px] hidden text-xs md:inline"
            href={askForVerificationLink}
          >
            Submit or ask for verification
          </Link>
        </span>
      )
    case 'failed':
      return (
        <div className="flex w-max flex-col gap-1">
          <Tooltip>
            <TooltipTrigger className="w-max">
              <span className="flex items-center text-red-700 text-sm dark:text-red-300 md:text-base">
                <UnverifiedIcon className="mr-1.5" />
                Unsuccessful
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {performedBy?.name} has tried the verification procedure and
              wasn't able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap font-medium text-xs text-zinc-500">
            (performed by{' '}
            {
              <PlainLink className="underline" href={performedBy?.link}>
                {performedBy?.name}
              </PlainLink>
            }
            )
          </div>
        </div>
      )
    default:
      assertUnreachable(verified)
  }
}
