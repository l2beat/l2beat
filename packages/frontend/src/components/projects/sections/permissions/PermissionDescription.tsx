import type { ProjectPermissionImpactScenario } from '@l2beat/config'
import type { ReactNode } from 'react'
import { Markdown } from '~/components/markdown/Markdown'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

interface PermissionDescriptionProps {
  children: string
  impactScenarios?: ProjectPermissionImpactScenario[]
  className?: string
}

type ImpactValue = ProjectPermissionImpactScenario['impacts'][number]
type ProtectionValue = ProjectPermissionImpactScenario['protections'][number]
type Capability = ProjectPermissionImpactScenario['capabilities'][number]
type ImpactTraceData = ImpactValue['paths'][number]

interface OutcomeRoute {
  id: string
  capabilities: Capability[]
  requires?: string[]
  components: string[]
  paths: ImpactTraceData[]
}

interface ImpactOutcome {
  id: string
  description: string
  mitigation?: string
  routes: OutcomeRoute[]
}

interface ProtectionOutcome {
  id: string
  description: string
  routes: OutcomeRoute[]
}

export function PermissionDescription({
  children,
  impactScenarios,
  className,
}: PermissionDescriptionProps) {
  const impactOutcomes = groupImpactOutcomes(impactScenarios ?? [])
  const protectionOutcomes = groupProtectionOutcomes(impactScenarios ?? [])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Markdown is wrapped in an inline container by GlossaryTooltipWrapper,
          so it needs a block wrapper for space-y margins to apply. */}
      <div>
        <Markdown className="word-break-word text-paragraph-15 md:text-paragraph-16">
          {children}
        </Markdown>
      </div>
      {impactOutcomes.length > 0 && (
        <section>
          <DetailLabel sentiment="negative">Impact if compromised</DetailLabel>
          <div className="mt-2 space-y-3">
            {impactOutcomes.map((outcome) => (
              <ImpactOutcomeEntry key={outcome.id} outcome={outcome} />
            ))}
          </div>
        </section>
      )}
      {protectionOutcomes.length > 0 && (
        <section>
          <DetailLabel sentiment="positive">Remaining protections</DetailLabel>
          <div className="mt-2 space-y-3">
            {protectionOutcomes.map((outcome) => (
              <ProtectionOutcomeEntry key={outcome.id} outcome={outcome} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ImpactOutcomeEntry({ outcome }: { outcome: ImpactOutcome }) {
  return (
    <article className="rounded-lg border border-divider">
      <div className="p-3 text-paragraph-14 md:text-paragraph-15">
        <Markdown className="border-negative border-l-2 pl-3 text-primary">
          {outcome.description}
        </Markdown>
        {outcome.mitigation ? (
          <LinkedMitigation description={outcome.mitigation} />
        ) : (
          <MissingMitigation
            localSafeguardRoutes={
              outcome.routes.filter((route) =>
                pathsHaveLocalMitigations(route.paths),
              ).length
            }
            totalRoutes={outcome.routes.length}
          />
        )}
      </div>
      <PermissionDetail label="This can happen through">
        <OutcomeRoutes
          routes={outcome.routes}
          suppressRootMitigation={outcome.mitigation !== undefined}
        />
      </PermissionDetail>
    </article>
  )
}

function ProtectionOutcomeEntry({ outcome }: { outcome: ProtectionOutcome }) {
  return (
    <article className="rounded-lg border border-divider">
      <div className="p-3 text-paragraph-14 md:text-paragraph-15">
        <Markdown className="border-positive border-l-2 pl-3 text-primary">
          {outcome.description}
        </Markdown>
      </div>
      <PermissionDetail label="This remains available through">
        <OutcomeRoutes
          routes={outcome.routes}
          protection
          suppressRootMitigation
        />
      </PermissionDetail>
    </article>
  )
}

function PermissionDetail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="border-divider border-t p-3">
      <DetailLabel>{label}</DetailLabel>
      <div className="mt-2 min-w-0 text-paragraph-14 text-primary md:text-paragraph-15">
        {children}
      </div>
    </div>
  )
}

function DetailLabel({
  children,
  sentiment = 'neutral',
  className,
}: {
  children: ReactNode
  sentiment?: 'neutral' | 'negative' | 'positive'
  className?: string
}) {
  return (
    <div
      className={cn(
        'text-subtitle-12 uppercase',
        sentiment === 'neutral' && 'text-secondary',
        sentiment === 'negative' && 'text-negative',
        sentiment === 'positive' && 'text-positive',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Bullet() {
  return (
    <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-secondary" />
  )
}

function OutcomeRoutes({
  routes,
  protection = false,
  suppressRootMitigation = false,
}: {
  routes: OutcomeRoute[]
  protection?: boolean
  suppressRootMitigation?: boolean
}) {
  return (
    <div className="space-y-2">
      {routes.map((route) => (
        <CapabilityRoute
          key={route.id}
          route={route}
          protection={protection}
          suppressRootMitigation={suppressRootMitigation}
        />
      ))}
    </div>
  )
}

function CapabilityRoute({
  route,
  protection,
  suppressRootMitigation,
}: {
  route: OutcomeRoute
  protection: boolean
  suppressRootMitigation: boolean
}) {
  const componentCount = route.components.length

  return (
    <Disclosure
      className="overflow-hidden rounded-md border border-divider"
      summaryClassName="items-start gap-2.5 px-3 py-2.5 text-secondary transition-colors hover:bg-surface-primary-hover"
      chevronClassName="mt-1"
      summary={
        <>
          <span className="min-w-0 flex-1">
            {route.capabilities.map((capability, index) => (
              <span
                key={`${capability.actor}-${capability.component}-${index}`}
                className={cn('block', index > 0 && 'mt-2')}
              >
                <span className="block font-semibold text-primary text-xs">
                  {capability.actor}{' '}
                  <span className="font-normal text-secondary">through</span>{' '}
                  {capability.component}
                </span>
                <span className="mt-0.5 block text-paragraph-14 text-secondary">
                  <Markdown inline ignoreGlossary>
                    {capability.descriptions.join(' ')}
                  </Markdown>
                </span>
              </span>
            ))}
          </span>
          <span className="mt-0.5 hidden shrink-0 font-medium text-2xs sm:block">
            {componentCount} affected{' '}
            {componentCount === 1 ? 'component' : 'components'}
          </span>
        </>
      }
    >
      <div className="space-y-3 border-divider border-t px-3 py-2.5">
        {route.requires && route.requires.length > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <DetailLabel className="shrink-0">Also requires</DetailLabel>
            <span className="text-primary">{route.requires.join(', ')}</span>
          </div>
        )}
        <OutcomeComponents
          components={route.components}
          label={protection ? 'Protects' : 'Affects'}
        />
        {route.paths.length > 0 && (
          <>
            <ImpactConditions
              paths={route.paths}
              label={protection ? 'This remains available when' : undefined}
            />
            <ImpactPropagation
              paths={route.paths}
              suppressRootMitigation={suppressRootMitigation}
            />
          </>
        )}
      </div>
    </Disclosure>
  )
}

function OutcomeComponents({
  components,
  label = 'Affects',
}: {
  components: string[]
  label?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <DetailLabel className="shrink-0">{label}</DetailLabel>
      {components.map((component) => (
        <span
          key={component}
          className="min-w-0 break-words rounded bg-surface-secondary px-1.5 py-1 font-medium text-label-value-13 text-primary"
        >
          {component}
        </span>
      ))}
    </div>
  )
}

function LinkedMitigation({ description }: { description: string }) {
  return (
    <div className="mt-3 rounded-r-md border-positive border-l-2 bg-surface-positive px-3 py-2.5">
      <DetailLabel sentiment="positive">Mitigation</DetailLabel>
      <Markdown className="mt-1.5 text-primary">{description}</Markdown>
    </div>
  )
}

function MissingMitigation({
  localSafeguardRoutes,
  totalRoutes,
}: {
  localSafeguardRoutes: number
  totalRoutes: number
}) {
  const description =
    localSafeguardRoutes === 0
      ? 'No mitigation identified for this impact or its propagation paths.'
      : localSafeguardRoutes === totalRoutes
        ? 'No direct mitigation identified. Local safeguards are documented in each propagation route.'
        : `No direct mitigation identified. Local safeguards are documented in ${localSafeguardRoutes} of ${totalRoutes} capability routes.`

  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <DetailLabel className="shrink-0">Mitigation</DetailLabel>
      <span className="text-secondary">{description}</span>
    </div>
  )
}

function ImpactConditions({
  paths,
  label = 'This can happen when',
}: {
  paths: ImpactTraceData[]
  label?: string
}) {
  const alternatives = uniqueConditionSets(
    paths.map((path) => getSourceConditions(path)),
  )

  return (
    <div>
      <DetailLabel>{label}</DetailLabel>
      {alternatives.length === 1 ? (
        <ConditionSet conditions={alternatives[0] ?? []} className="mt-1.5" />
      ) : (
        <ol className="mt-1.5 space-y-2.5 border-divider border-l pl-3">
          {alternatives.map((conditions, index) => (
            <li key={conditionSetKey(conditions)}>
              <DetailLabel className="mb-1.5">
                Alternative {index + 1}
              </DetailLabel>
              <ConditionSet conditions={conditions} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function ConditionSet({
  conditions,
  className,
}: {
  conditions: ImpactTraceData[]
  className?: string
}) {
  return (
    <div className={className}>
      {conditions.length > 1 && (
        <div className="mb-1 text-secondary">All of the following:</div>
      )}
      <ul className="space-y-1.5">
        {conditions.map((condition) => (
          <li key={conditionKey(condition)} className="flex items-start gap-2">
            <Bullet />
            <div className="min-w-0">
              <span className="font-semibold text-primary">
                {condition.component}:{' '}
              </span>
              {condition.description ? (
                <Markdown inline className="text-primary">
                  {condition.description}
                </Markdown>
              ) : (
                <span className="text-primary">{condition.effect}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Disclosure({
  summary,
  children,
  className,
  summaryClassName,
  chevronClassName,
}: {
  summary: ReactNode
  children: ReactNode
  className?: string
  summaryClassName?: string
  chevronClassName?: string
}) {
  return (
    <details className={cn('[&[open]>summary>svg]:-rotate-180', className)}>
      <summary
        className={cn(
          'flex cursor-pointer select-none list-none items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset [&::-webkit-details-marker]:hidden',
          summaryClassName,
        )}
      >
        <ChevronIcon
          className={cn(
            'size-3 shrink-0 fill-current transition-transform duration-200',
            chevronClassName,
          )}
        />
        {summary}
      </summary>
      {children}
    </details>
  )
}

function ImpactPropagation({
  paths,
  suppressRootMitigation = false,
}: {
  paths: ImpactTraceData[]
  suppressRootMitigation?: boolean
}) {
  const pathsByComponent = groupPathsByComponent(paths)
  const summary =
    pathsByComponent.length > 1
      ? `${pathsByComponent.length} component paths`
      : paths.length > 1
        ? `${paths.length} alternative paths`
        : undefined

  return (
    <Disclosure
      summaryClassName="gap-2 rounded-sm py-1.5 font-semibold text-secondary text-xs transition-colors hover:text-primary"
      summary={
        <>
          <span>How it propagates</span>
          {summary && (
            <span className="ml-auto font-medium text-2xs">{summary}</span>
          )}
        </>
      }
    >
      {pathsByComponent.length > 1 ? (
        <div className="mt-1 space-y-0.5">
          {pathsByComponent.map(({ component, paths }) => (
            <ComponentPathDisclosure
              key={component}
              component={component}
              paths={paths}
              suppressRootMitigation={suppressRootMitigation}
            />
          ))}
        </div>
      ) : (
        <div className="mt-1 border-divider border-l pl-3">
          <ImpactPaths
            paths={paths}
            suppressRootMitigation={suppressRootMitigation}
          />
        </div>
      )}
    </Disclosure>
  )
}

function ComponentPathDisclosure({
  component,
  paths,
  suppressRootMitigation,
}: {
  component: string
  paths: ImpactTraceData[]
  suppressRootMitigation: boolean
}) {
  return (
    <Disclosure
      summaryClassName="-mx-1 gap-2 rounded-sm px-1 py-1 text-secondary transition-colors hover:bg-surface-primary-hover"
      summary={
        <>
          <span className="min-w-0 break-words font-semibold text-primary text-xs">
            {component}
          </span>
          {paths.length > 1 && (
            <span className="ml-auto shrink-0 font-medium text-2xs">
              {paths.length} alternatives
            </span>
          )}
        </>
      }
    >
      <div className="mt-1 mb-2 border-divider border-l pl-3">
        <ImpactPaths
          paths={paths}
          suppressRootMitigation={suppressRootMitigation}
        />
      </div>
    </Disclosure>
  )
}

function ImpactPaths({
  paths,
  suppressRootMitigation,
}: {
  paths: ImpactTraceData[]
  suppressRootMitigation: boolean
}) {
  return (
    <div className="space-y-2.5">
      {paths.map((path, index) => (
        <div key={index}>
          {paths.length > 1 && (
            <DetailLabel className="mb-1.5">
              Alternative path {index + 1}
            </DetailLabel>
          )}
          <ImpactTrace
            trace={path}
            suppressOwnMitigation={suppressRootMitigation}
          />
        </div>
      ))}
    </div>
  )
}

function ImpactTrace({
  trace,
  suppressOwnMitigation = false,
}: {
  trace: ImpactTraceData
  suppressOwnMitigation?: boolean
}) {
  return (
    <div>
      {trace.inputs.length > 0 && (
        <>
          <div
            className={cn(
              'gap-2',
              trace.inputs.length > 1 && 'grid md:grid-cols-2',
            )}
          >
            {trace.inputs.map((input, index) => (
              <ImpactTrace key={index} trace={input} />
            ))}
          </div>
          <TraceConnector conjunctive={trace.inputs.length > 1} />
        </>
      )}
      <div className="rounded-md border border-divider px-3 py-2">
        <div className="font-semibold text-primary text-xs">
          {trace.component}
        </div>
        {trace.description && (
          <Markdown className="mt-1 text-paragraph-14 text-secondary">
            {trace.description}
          </Markdown>
        )}
        {trace.mitigation && !suppressOwnMitigation && (
          <div className="mt-2 border-positive border-l-2 pl-2.5">
            <DetailLabel sentiment="positive">Local mitigation</DetailLabel>
            <Markdown className="mt-1 text-paragraph-14 text-primary">
              {trace.mitigation}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  )
}

function TraceConnector({ conjunctive }: { conjunctive: boolean }) {
  return (
    <div className="flex h-6 items-center gap-2 pl-3 text-secondary">
      <span className="h-full w-px bg-divider" />
      <span className="font-medium text-2xs leading-none">
        {conjunctive ? 'All are required for' : 'Which leads to'}
      </span>
    </div>
  )
}

function getSourceConditions(trace: ImpactTraceData): ImpactTraceData[] {
  if (trace.inputs.length === 0) {
    return [trace]
  }
  return uniqueConditions(trace.inputs.flatMap(getSourceConditions))
}

function pathsHaveLocalMitigations(paths: ImpactTraceData[]): boolean {
  return paths.some((path) => path.inputs.some(traceHasMitigation))
}

function traceHasMitigation(trace: ImpactTraceData): boolean {
  return trace.mitigation !== undefined || trace.inputs.some(traceHasMitigation)
}

function groupPathsByComponent(
  paths: ImpactTraceData[],
): { component: string; paths: ImpactTraceData[] }[] {
  const grouped = new Map<string, ImpactTraceData[]>()
  for (const path of paths) {
    grouped.set(path.component, [...(grouped.get(path.component) ?? []), path])
  }
  return Array.from(grouped, ([component, paths]) => ({ component, paths }))
}

function uniqueConditionSets(sets: ImpactTraceData[][]): ImpactTraceData[][] {
  const seen = new Set<string>()
  return sets.filter((set) => {
    const key = conditionSetKey(set)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function uniqueConditions(conditions: ImpactTraceData[]): ImpactTraceData[] {
  const seen = new Set<string>()
  return conditions.filter((condition) => {
    const key = conditionKey(condition)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function conditionSetKey(conditions: ImpactTraceData[]): string {
  return conditions.map(conditionKey).sort().join('|')
}

function conditionKey(condition: ImpactTraceData): string {
  return JSON.stringify([
    condition.component,
    condition.effect,
    condition.description,
  ])
}

function groupImpactOutcomes(
  scenarios: ProjectPermissionImpactScenario[],
): ImpactOutcome[] {
  const outcomes = new Map<string, ImpactOutcome>()

  for (const scenario of scenarios) {
    for (const impact of scenario.impacts) {
      const route = toOutcomeRoute(scenario, impact)
      const existing = outcomes.get(impact.id)
      if (existing) {
        existing.routes.push(route)
      } else {
        outcomes.set(impact.id, {
          id: impact.id,
          description: impact.description,
          mitigation: impact.mitigation,
          routes: [route],
        })
      }
    }
  }

  return Array.from(outcomes.values())
}

function groupProtectionOutcomes(
  scenarios: ProjectPermissionImpactScenario[],
): ProtectionOutcome[] {
  const outcomes = new Map<string, ProtectionOutcome>()

  for (const scenario of scenarios) {
    for (const protection of scenario.protections) {
      const route = toOutcomeRoute(scenario, protection)
      const existing = outcomes.get(protection.id)
      if (existing) {
        existing.routes.push(route)
      } else {
        outcomes.set(protection.id, {
          id: protection.id,
          description: protection.description,
          routes: [route],
        })
      }
    }
  }

  return Array.from(outcomes.values())
}

function toOutcomeRoute(
  scenario: ProjectPermissionImpactScenario,
  outcome: ImpactValue | ProtectionValue,
): OutcomeRoute {
  return {
    id: `${scenario.id}:${outcome.id}`,
    capabilities: scenario.capabilities,
    requires: scenario.requires,
    components: outcome.components,
    paths: outcome.paths,
  }
}
