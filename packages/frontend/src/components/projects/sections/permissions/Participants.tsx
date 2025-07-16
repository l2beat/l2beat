import { HighlightableLink } from '~/components/link/highlightable/HighlightableLink'

export interface Participant {
  name: string
  href: string
  address: string
}

export function ParticipantsEntry({
  participants,
}: {
  participants: Participant[]
}) {
  return (
    <div className="mt-2 flex flex-row flex-wrap items-center gap-x-1.5 text-paragraph-15 md:text-paragraph-16">
      <p>
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
