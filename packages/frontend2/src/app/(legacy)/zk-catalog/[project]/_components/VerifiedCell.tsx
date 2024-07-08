import { assertUnreachable } from '@l2beat/shared-pure';
import CircleQuestionMark from '~/icons/circle-question-mark.svg';
import UnverifiedIcon from '~/icons/unverified.svg';
import VerifiedIcon from '~/icons/verified.svg';

import { OutLink } from '~/app/_components/out-link';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip';

interface Props {
  verified: 'yes' | 'no' | 'failed';
  askForVerificationLink: string;
  performedBy?: {
    name: string;
    link: string;
  };
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
              <OutLink className="underline" href={performedBy?.link}>
                {performedBy?.name}
              </OutLink>
            }
            )
          </div>
        </div>
      );
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
          <OutLink className="ml-[26px] text-xs" href={askForVerificationLink}>
            Submit or ask for verification
          </OutLink>
        </span>
      );
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
              wasn&apos;t able to regenerate the onchain verifier.
            </TooltipContent>
          </Tooltip>
          <div className="ml-[26px] w-full flex-nowrap whitespace-nowrap font-medium text-xs text-zinc-500">
            (performed by{' '}
            {
              <OutLink className="underline" href={performedBy?.link}>
                {performedBy?.name}
              </OutLink>
            }
            )
          </div>
        </div>
      );
    default:
      assertUnreachable(verified);
  }
}
