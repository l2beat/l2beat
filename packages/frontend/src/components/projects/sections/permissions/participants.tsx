import { HighlightableLink } from '~/components/link/highlightable/highlightable-link'

export interface Participant {
  name: string
  href: string
  address: string
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
          href={address.href}
          address={address.address}
          className="flex items-center gap-0.5"
        >
          {address.name}
        </HighlightableLink>
      ))}
    </div>
  )
}
