import type { PrivacyAdversary, PrivacyNeed } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { ChoicesPicker } from './components/ChoicesPicker'
import { ProtocolMatchesCard } from './components/ProtocolMatchesCard'
import { type MatchChoices, matchProtocols } from './matchProtocols'
import { STAY_PRIVATE } from './stayPrivateCopy'
import { toStayPrivateQuery } from './stayPrivateQuery'

interface Props extends AppLayoutProps {
  protocols: PrivacyAdviceProtocol[]
  adversaries: PrivacyAdversary[]
  needs: PrivacyNeed[]
  waitWindowDays: number
  initialChoices: MatchChoices
  initialProtocol: string | undefined
}

export function PrivacyStayPrivatePage({
  protocols,
  adversaries,
  needs,
  waitWindowDays,
  initialChoices,
  initialProtocol,
  ...props
}: Props) {
  const [choices, setChoices] = useState(initialChoices)
  const [slug, setSlug] = useState(initialProtocol)
  const matches = useMemo(
    () => matchProtocols(protocols, adversaries, choices),
    [protocols, adversaries, choices],
  )

  /** Keeps the choices and the open setup in the URL, so a link reopens them. */
  const update = (next: MatchChoices, nextSlug: string | undefined) => {
    setChoices(next)
    setSlug(nextSlug)
    const query = toStayPrivateQuery(next, nextSlug, adversaries)
    // Replaces rather than pushes, so trying choices does not fill the back button.
    window.history.replaceState(
      null,
      '',
      `?${new URLSearchParams({ ...query }).toString()}`,
    )
  }
  // A setup of another need answers a question no longer asked.
  const changeChoices = (next: MatchChoices) =>
    update(
      next,
      protocols.find((p) => p.slug === slug)?.needId === next.need
        ? slug
        : undefined,
    )

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description={STAY_PRIVATE.description}>
          {STAY_PRIVATE.title}
        </MainPageHeader>
        {/* Side by side from xl, so changing a choice shows its effect without scrolling. */}
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
          <PrimaryCard className="xl:sticky xl:top-4 xl:max-h-[calc(100dvh-2rem)] xl:overflow-y-auto">
            <h2 className="sr-only">{STAY_PRIVATE.choicesTitle}</h2>
            <ChoicesPicker
              choices={choices}
              needs={needs}
              adversaries={adversaries}
              protocols={protocols}
              waitWindowDays={waitWindowDays}
              onChange={changeChoices}
            />
          </PrimaryCard>
          <ProtocolMatchesCard
            matches={matches}
            choices={choices}
            protocols={protocols}
            adversaries={adversaries}
            waitWindowDays={waitWindowDays}
            selected={slug}
            onSelect={(next) => update(choices, next)}
            onChange={changeChoices}
          />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
