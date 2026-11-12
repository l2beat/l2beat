import type { PrivacyAdversary, PrivacyNeed } from '@l2beat/config'
import { useMemo, useRef, useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { ChoicesPicker } from './components/ChoicesPicker'
import { ProtocolMatchesCard } from './components/ProtocolMatchesCard'
import { SetupCard } from './components/SetupCard'
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
  const setupRef = useRef<HTMLDivElement>(null)
  const matches = useMemo(
    () => matchProtocols(protocols, adversaries, choices),
    [protocols, adversaries, choices],
  )
  const protocol = protocols.find((p) => p.slug === slug)

  /** Keeps the choices and the chosen protocol in the URL, so a link reopens them. */
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

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description={STAY_PRIVATE.description}>
          {STAY_PRIVATE.title}
        </MainPageHeader>
        <div className="flex flex-col gap-4">
          <PrimaryCard>
            <ChoicesPicker
              choices={choices}
              needs={needs}
              adversaries={adversaries}
              protocols={protocols}
              waitWindowDays={waitWindowDays}
              onChange={(next) =>
                // A setup of another need answers a question no longer asked.
                update(next, protocol?.needId === next.need ? slug : undefined)
              }
            />
          </PrimaryCard>
          <ProtocolMatchesCard
            matches={matches}
            from={choices.from}
            waitWindowDays={waitWindowDays}
            selected={slug}
            onSelect={(next) => {
              update(choices, next)
              requestAnimationFrame(() =>
                setupRef.current?.scrollIntoView({ block: 'start' }),
              )
            }}
          />
          <div ref={setupRef} className="scroll-mt-4">
            {protocol ? (
              <SetupCard
                protocol={protocol}
                accepts={choices.accepts}
                from={choices.from}
                adversaries={adversaries}
                waitWindowDays={waitWindowDays}
              />
            ) : (
              <PrimaryCard className="text-paragraph-15 text-secondary md:text-paragraph-16">
                {STAY_PRIVATE.pickProtocol}
              </PrimaryCard>
            )}
          </div>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
