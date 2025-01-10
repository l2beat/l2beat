import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Tooltip, TooltipContent } from '~/components/core/tooltip/tooltip'
import { HighlightableLink } from '~/components/link/highlightable/highlightable-link'
import { UnverifiedIcon } from '~/icons/unverified'
import { type VerificationStatus } from '~/utils/project/contracts-and-permissions/to-verification-status'

export interface Participant {
  name: string
  href: string
  verificationStatus: VerificationStatus
}

export function ParticipantsEntry({
  participants,
}: { participants: Participant[] }) {
  return (
    <div className="mt-2 flex flex-row flex-wrap items-center gap-x-2 !leading-[1.15]">
      <p className="text-gray-850 dark:text-gray-400">
        <strong className="text-primary">{`Participants (${participants.length}): `}</strong>
      </p>
      {participants.map((address, i) => (
        <HighlightableLink
          key={i}
          variant={
            address.verificationStatus === 'unverified' ? 'danger' : undefined
          }
          href={address.href}
          className="flex items-center gap-0.5"
        >
          {address.verificationStatus === 'unverified' ? (
            <Tooltip>
              <TooltipTrigger>
                <UnverifiedIcon className="fill-red-300" />
              </TooltipTrigger>
              <TooltipContent>This contract is not verified</TooltipContent>
            </Tooltip>
          ) : null}
          {address.name}
        </HighlightableLink>
      ))}
    </div>
  )
}
