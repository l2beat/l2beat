import type { PrivacyAdversary } from '@l2beat/config'
import { useMemo, useRef, useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type {
  PrivacyAdviceData,
  PrivacyAdviceProtocol,
} from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { AdviceCriteriaPicker } from './components/AdviceCriteriaPicker'
import { AdvicePathCard } from './components/AdvicePathCard'
import { ProtocolRankingCard } from './components/ProtocolRankingCard'
import { type RankingCriteria, rankProtocols } from './rankProtocols'
import { STAY_PRIVATE } from './stayPrivateCopy'

interface Props extends AppLayoutProps {
  protocols: PrivacyAdviceProtocol[]
  adversaries: PrivacyAdversary[]
  waitWindowDays: number
  options: PrivacyAdviceData['options']
  initialCriteria: RankingCriteria
  initialProtocol: string | undefined
}

export function PrivacyStayPrivatePage({
  protocols,
  adversaries,
  waitWindowDays,
  options,
  initialCriteria,
  initialProtocol,
  ...props
}: Props) {
  const [criteria, setCriteria] = useState(initialCriteria)
  const [slug, setSlug] = useState(initialProtocol)
  const pathRef = useRef<HTMLDivElement>(null)
  const ranking = useMemo(
    () => rankProtocols(protocols, criteria),
    [protocols, criteria],
  )
  const protocol = protocols.find((p) => p.slug === slug)

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description={STAY_PRIVATE.description}>
          {STAY_PRIVATE.title}
        </MainPageHeader>
        <div className="flex flex-col gap-4">
          <PrimaryCard>
            <AdviceCriteriaPicker
              criteria={criteria}
              options={options}
              onChange={(next) => {
                setCriteria(next)
                replaceQuery(next, slug)
              }}
            />
          </PrimaryCard>
          <ProtocolRankingCard
            ranking={ranking}
            adversaries={adversaries}
            selected={slug}
            onSelect={(next) => {
              setSlug(next)
              replaceQuery(criteria, next)
              requestAnimationFrame(() =>
                pathRef.current?.scrollIntoView({ block: 'start' }),
              )
            }}
          />
          <div ref={pathRef} className="scroll-mt-4">
            {protocol ? (
              <AdvicePathCard
                protocol={protocol}
                goal={criteria.goal}
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

/**
 * Keeps the criteria and the chosen protocol in the URL, so a link reopens the
 * same comparison. Replaces rather than pushes, so trying criteria does not
 * fill the back button.
 */
function replaceQuery(criteria: RankingCriteria, protocol: string | undefined) {
  const params = new URLSearchParams()
  params.set(STAY_PRIVATE.goalParam, criteria.goal)
  if (criteria.kind) params.set(STAY_PRIVATE.kindParam, criteria.kind)
  if (criteria.asset) params.set(STAY_PRIVATE.assetParam, criteria.asset)
  if (criteria.chain) params.set(STAY_PRIVATE.chainParam, criteria.chain)
  if (protocol) params.set(STAY_PRIVATE.protocolParam, protocol)
  window.history.replaceState(null, '', `?${params.toString()}`)
}
