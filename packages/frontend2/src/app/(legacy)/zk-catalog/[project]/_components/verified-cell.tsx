import { assertUnreachable } from '@l2beat/shared-pure'
import CircleQuestionMark from '~/icons/circle-question-mark.svg'
import UnverifiedIcon from '~/icons/unverified.svg'
import VerifiedIcon from '~/icons/verified.svg'

import { OutLink } from '~/app/_components/out-link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'

type Props = {
  askForVerificationLink: string
} & (
  | {
      verified: 'yes' | 'failed'
      performedBy: {
        name: string
        link: string
      }
    }
  | {
      verified: 'no'
    }
)

export function VerifiedCell(props: Props) {
  switch (props.verified) {
    case 'yes':
      return (
        <div className="flex w-max flex-col">
          <Tooltip>
            <TooltipTrigger className="w-max">
              <span className="flex items-center text-sm text-green-700 dark:text-green-450 md:text-base">
                <VerifiedIcon className="mr-1.5 size-5 dark:fill-green-450" />
                <span>Successful</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {props.performedBy.name} has tried the verification procedure and
              was able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap text-xs font-medium text-zinc-500 max-md:hidden">
            (performed by{' '}
            {
              <OutLink className="underline" href={props.performedBy.link}>
                {props.performedBy.name}
              </OutLink>
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
              <CircleQuestionMark className="mr-1.5 size-5" />
              Not verified
            </TooltipTrigger>
            <TooltipContent>
              Verification was not performed for this verifier.
            </TooltipContent>
          </Tooltip>
          <OutLink
            className="ml-[26px] text-xs max-md:hidden"
            href={props.askForVerificationLink}
          >
            Submit or ask for verification
          </OutLink>
        </span>
      )
    case 'failed':
      return (
        <div className="flex w-max flex-col">
          <Tooltip>
            <TooltipTrigger className="w-max">
              <span className="flex items-center text-sm text-red-700 dark:text-red-300 md:text-base">
                <UnverifiedIcon className="mr-1.5 size-5" />
                Unsuccessful
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {props.performedBy.name} has tried the verification procedure and
              wasn&apos;t able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap text-xs font-medium text-zinc-500 max-md:hidden">
            (performed by{' '}
            {
              <OutLink className="underline" href={props.performedBy.link}>
                {props.performedBy.name}
              </OutLink>
            }
            )
          </div>
        </div>
      )
    default:
      assertUnreachable(props)
  }
}
