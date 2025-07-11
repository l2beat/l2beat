import { assertUnreachable } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'
import { CircleQuestionMarkIcon } from '~/icons/CircleQuestionMark'
import { UnverifiedIcon } from '~/icons/Unverified'
import { VerifiedIcon } from '~/icons/Verified'

type Props =
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

export function VerifiedCell(props: Props) {
  switch (props.verified) {
    case 'yes':
      return (
        <div className="flex w-max flex-col">
          <Tooltip>
            <TooltipTrigger className="w-max">
              <span className="flex items-center text-green-700 text-sm md:text-base dark:text-green-450">
                <VerifiedIcon className="mr-1.5 size-5 dark:fill-green-450" />
                <span>Successful</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {props.performedBy.name} has tried the verification procedure and
              was able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap font-medium text-secondary text-xs max-md:hidden">
            (performed by{' '}
            {
              <CustomLink className="underline" href={props.performedBy.link}>
                {props.performedBy.name}
              </CustomLink>
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
              <CircleQuestionMarkIcon className="mr-1.5 size-5" />
              Not verified
            </TooltipTrigger>
            <TooltipContent>
              Verification was not performed for this verifier.
            </TooltipContent>
          </Tooltip>
          <CustomLink
            className="ml-[26px] text-xs max-md:hidden"
            href={externalLinks.askForZkCatalogVerification}
          >
            Submit or ask for verification
          </CustomLink>
        </span>
      )
    case 'failed':
      return (
        <div className="flex w-max flex-col">
          <Tooltip>
            <TooltipTrigger className="w-max">
              <span className="flex items-center text-red-700 text-sm md:text-base dark:text-red-300">
                <UnverifiedIcon className="mr-1.5 size-5" />
                Unsuccessful
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {props.performedBy.name} has tried the verification procedure and
              wasn&apos;t able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap font-medium text-secondary text-xs max-md:hidden">
            (performed by{' '}
            {
              <CustomLink className="underline" href={props.performedBy.link}>
                {props.performedBy.name}
              </CustomLink>
            }
            )
          </div>
        </div>
      )
    default:
      assertUnreachable(props)
  }
}
