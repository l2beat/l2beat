import type { PrivacyAdversary } from '@l2beat/config'
import { useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import type { AdviceGoalId } from './advicePaths'
import { AdviceGoalPicker } from './components/AdviceGoalPicker'
import { AdvicePathCard } from './components/AdvicePathCard'
import { AdviceProtocolPicker } from './components/AdviceProtocolPicker'
import { STAY_PRIVATE } from './stayPrivateCopy'

interface Props extends AppLayoutProps {
  protocols: PrivacyAdviceProtocol[]
  adversaries: PrivacyAdversary[]
  waitWindowDays: number
  initialProtocol: string | undefined
  initialGoal: AdviceGoalId
}

export function PrivacyStayPrivatePage({
  protocols,
  adversaries,
  waitWindowDays,
  initialProtocol,
  initialGoal,
  ...props
}: Props) {
  const [slug, setSlug] = useState(initialProtocol)
  const [goal, setGoal] = useState(initialGoal)
  const protocol = protocols.find((p) => p.slug === slug)

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description={STAY_PRIVATE.description}>
          {STAY_PRIVATE.title}
        </MainPageHeader>
        <div className="flex flex-col gap-4">
          <PrimaryCard>
            <AdviceProtocolPicker
              protocols={protocols}
              selected={slug}
              onSelect={(next) => {
                setSlug(next)
                replaceQuery(next, goal)
              }}
            />
          </PrimaryCard>
          <PrimaryCard>
            <AdviceGoalPicker
              selected={goal}
              onSelect={(next) => {
                setGoal(next)
                replaceQuery(slug, next)
              }}
            />
          </PrimaryCard>
          {protocol ? (
            <AdvicePathCard
              protocol={protocol}
              goal={goal}
              adversaries={adversaries}
              waitWindowDays={waitWindowDays}
            />
          ) : (
            <PrimaryCard className="text-paragraph-15 text-secondary md:text-paragraph-16">
              {STAY_PRIVATE.pickProtocol}
            </PrimaryCard>
          )}
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

/**
 * Keeps the picks in the URL, so a link reopens the same path. Replaces rather
 * than pushes, so trying goals does not fill the back button.
 */
function replaceQuery(protocol: string | undefined, goal: AdviceGoalId) {
  const params = new URLSearchParams()
  if (protocol) params.set(STAY_PRIVATE.protocolParam, protocol)
  params.set(STAY_PRIVATE.goalParam, goal)
  window.history.replaceState(null, '', `?${params.toString()}`)
}
