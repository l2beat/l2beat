import type { PrivacyAdversarySentiment } from '@l2beat/config'
import * as Tabs from '@radix-ui/react-tabs'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '~/components/rosette/RosetteTooltipContext'
import type { RosetteValue } from '~/components/rosette/types'
import { SentimentText } from '~/components/SentimentText'
import { useAnimationFrame } from '~/hooks/useAnimationFrame'
import { useElementSize } from '~/hooks/useElementSize'
import { useThemeTokens } from '~/hooks/useThemeTokens'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'
import { prepareCanvas } from '~/utils/prepareCanvas'
import { PRIVACY_ADVERSARY_VERDICT } from '../../adversaries/privacyAdversaryUi'
import { PrivacySentimentDot } from '../../PrivacySentimentDot'
import type { PrivacyMethodologyFigureData } from '../getPrivacyMethodologyFigureData'
import { MethodologyFigure } from './MethodologyFigure'
import {
  createPoolScene,
  drawPoolScene,
  estimateCaughtShare,
  type Lens,
  type PoolDesign,
  type PoolScene,
  stepPoolScene,
} from './poolLensScene'
import { getPoolVerdicts } from './poolVerdicts'

type PoolVerdicts = ReturnType<typeof getPoolVerdicts>

import { useFigureAutoplay } from './useFigureAutoplay'

const INTERVAL_MS = 9000

const INITIAL_DESIGN: PoolDesign = {
  linksDeposit: false,
  traffic: 0.38,
  publicRpc: false,
  viewingKeys: true,
  ellipticCurves: true,
}

export function PoolLensFigure({
  data,
}: {
  data: PrivacyMethodologyFigureData
}) {
  return (
    <MethodologyFigure>
      <RosetteTooltipContextProvider>
        <PoolLens data={data} />
      </RosetteTooltipContextProvider>
    </MethodologyFigure>
  )
}

const caughtShares = new Map<number, number>()

/** Same traffic, same answer: the estimate is a random run. */
function cachedCaughtShare(traffic: number) {
  const key = Math.round(traffic * 50) / 50
  let share = caughtShares.get(key)
  if (share === undefined) {
    share = estimateCaughtShare(key)
    caughtShares.set(key, share)
  }
  return share
}

function PoolLens({ data }: { data: PrivacyMethodologyFigureData }) {
  const { step, pick, animate, reducedMotion, containerProps } =
    useFigureAutoplay(data.adversaries.length, INTERVAL_MS)
  const { track } = useTracking()
  const adversary = data.adversaries[step] ?? data.adversaries[0]

  const [design, setDesign] = useState(INITIAL_DESIGN)
  const sceneRef = useRef<PoolScene>(undefined)
  const scene = () => {
    sceneRef.current ??= createPoolScene(design)
    return sceneRef.current
  }

  const caughtShare = useMemo(
    () => cachedCaughtShare(design.traffic),
    [design.traffic],
  )
  const verdicts = getPoolVerdicts(design, caughtShare)

  const tabsRef = useRef<HTMLDivElement>(null)
  // On phones the tabs scroll sideways; keep the current one in view without
  // moving the page, which scrollIntoView would do.
  useEffect(() => {
    const list = tabsRef.current
    const tab = list?.children[step]
    if (!list || !(tab instanceof HTMLElement)) return
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }, [step, reducedMotion])

  if (!adversary) return null
  const verdict = verdicts[adversary.id]

  const change = (next: Partial<PoolDesign>) => {
    pick(step)
    setDesign((current) => ({ ...current, ...next }))
  }

  return (
    <Tabs.Root
      {...containerProps}
      value={adversary.id}
      onValueChange={(id) => {
        pick(data.adversaries.findIndex((a) => a.id === id))
        track('tabsChanged', { name: 'privacyPoolAdversary', value: id })
      }}
    >
      <Tabs.List
        ref={tabsRef}
        className="scrollbar-hide -mx-4 relative flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {data.adversaries.map(({ id, label }, i) => {
          const current = i === step
          return (
            <Tabs.Trigger
              key={id}
              value={id}
              // Tabs only report a change; picking the current one still
              // stops the autoplay.
              onClick={() => pick(i)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border py-1 pr-3 pl-1.5 font-semibold text-label-value-13 transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.97]',
                current
                  ? 'border-brand bg-brand text-primary-invert'
                  : 'border-divider bg-surface-primary text-secondary hover:border-brand/50 hover:text-primary',
              )}
            >
              <PrivacySentimentDot
                key={verdicts[id].sentiment}
                sentiment={verdicts[id].sentiment}
                className="motion-safe:zoom-in-50 motion-safe:fade-in motion-safe:animate-in"
              />
              {label}
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
      {/* One panel that follows the tab, so the canvas is never remounted.
          It holds controls, so it needs no tab stop of its own. */}
      <Tabs.Content value={adversary.id} tabIndex={-1} className="outline-none">
        <DesignControl lens={adversary.id} design={design} onChange={change} />
        <PoolCanvas
          lens={adversary.id}
          design={design}
          scene={scene}
          running={animate}
        />
        {/* On phones the rosette floats, so the text keeps the full width below it. */}
        <div className="mt-3 flow-root sm:flex sm:items-center sm:gap-4">
          <VerdictRosette
            data={data}
            verdicts={verdicts}
            selected={adversary.label}
          />
          <div
            key={adversary.id}
            className="motion-safe:fade-in motion-safe:slide-in-from-bottom-1 min-w-0 flex-1 motion-safe:animate-in motion-safe:duration-300"
          >
            <p className="font-bold text-label-value-16">
              {adversary.label}:{' '}
              <SentimentText
                key={verdict.sentiment}
                sentiment={verdict.sentiment}
                vibrant
                className="motion-safe:fade-in font-bold motion-safe:animate-in"
              >
                {PRIVACY_ADVERSARY_VERDICT[verdict.sentiment]}
              </SentimentText>
            </p>
            <p className="mt-1 text-paragraph-14">{verdict.sees}</p>
            {verdict.inheritedFrom && (
              <InheritedNote
                label={adversary.label}
                from={
                  data.adversaries.find((a) => a.id === verdict.inheritedFrom)
                    ?.label ?? ''
                }
                sentiment={verdict.sentiment}
                onGo={() =>
                  pick(
                    data.adversaries.findIndex(
                      (a) => a.id === verdict.inheritedFrom,
                    ),
                  )
                }
              />
            )}
            <p className="mt-1 text-paragraph-13 text-secondary">
              {adversary.label} {adversary.text}
            </p>
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}

/** The one design choice the current adversary's verdict depends on. */
function DesignControl({
  lens,
  design,
  onChange,
}: {
  lens: Lens
  design: PoolDesign
  onChange: (next: Partial<PoolDesign>) => void
}) {
  let control: ReactNode
  switch (lens) {
    case 'publicObserver':
      control = (
        <Choice
          name="privacyPoolLinkage"
          label="Withdrawals can be linked to their deposit"
          value={design.linksDeposit}
          options={[
            [false, 'No'],
            [true, 'Yes'],
          ]}
          onChange={(linksDeposit) => onChange({ linksDeposit })}
        />
      )
      break
    case 'chainAnalyst':
      control = (
        <label className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-label-value-13">
            Pool traffic
          </span>
          <span className="flex min-w-48 flex-1 items-center gap-2 text-label-value-12 text-secondary">
            Quiet
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={design.traffic}
              onChange={(e) => onChange({ traffic: Number(e.target.value) })}
              className="flex-1 accent-brand"
            />
            Busy
          </span>
        </label>
      )
      break
    case 'networkObserver':
      control = (
        <Choice
          name="privacyPoolConnection"
          label="The client connects through"
          value={design.publicRpc}
          options={[
            [false, 'Tor and a relayer'],
            [true, 'A public RPC, from home'],
          ]}
          onChange={(publicRpc) => onChange({ publicRpc })}
        />
      )
      break
    case 'privilegedInsider':
      control = (
        <Choice
          name="privacyPoolViewingKeys"
          label="The operator holds viewing keys"
          value={design.viewingKeys}
          options={[
            [false, 'No'],
            [true, 'Yes'],
          ]}
          onChange={(viewingKeys) => onChange({ viewingKeys })}
        />
      )
      break
    case 'futureAdversary':
      control = (
        <Choice
          name="privacyPoolNoteCrypto"
          label="Notes are protected by"
          value={design.ellipticCurves}
          options={[
            [false, 'Post-quantum crypto'],
            [true, 'Elliptic curves'],
          ]}
          onChange={(ellipticCurves) => onChange({ ellipticCurves })}
        />
      )
      break
  }
  return (
    <div
      key={lens}
      // As tall for a slider as for a choice, so the scene below never moves.
      className="motion-safe:fade-in mt-3 flex min-h-[50px] flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-surface-primary px-3 py-2 motion-safe:animate-in"
    >
      {control}
    </div>
  )
}

/** Why a verdict is worse than its own setting would make it. */
function InheritedNote({
  label,
  from,
  sentiment,
  onGo,
}: {
  label: string
  from: string
  sentiment: PrivacyAdversarySentiment
  onGo: () => void
}) {
  return (
    <p className="motion-safe:fade-in mt-1 text-label-value-13 text-secondary motion-safe:animate-in">
      <SentimentText sentiment={sentiment} vibrant className="font-bold">
        {`${PRIVACY_ADVERSARY_VERDICT[sentiment]} anyway:`}
      </SentimentText>{' '}
      the {label.toLowerCase()} sees everything the {from.toLowerCase()} sees.{' '}
      <button
        type="button"
        onClick={onGo}
        className="font-semibold text-brand underline underline-offset-2"
      >
        See the {from.toLowerCase()}
      </button>
    </p>
  )
}

function Choice({
  name,
  label,
  value,
  options,
  onChange,
}: {
  name: string
  label: string
  value: boolean
  options: [boolean, string][]
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="font-semibold text-label-value-13">{label}</span>
      <RadioGroup
        name={name}
        aria-label={label}
        value={String(value)}
        onValueChange={(next) => onChange(next === 'true')}
      >
        {options.map(([option, text]) => (
          <RadioGroupItem key={text} value={String(option)}>
            {text}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  )
}

function PoolCanvas({
  lens,
  design,
  scene,
  running,
}: {
  lens: Lens
  design: PoolDesign
  scene: () => PoolScene
  running: boolean
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = useElementSize(boxRef)
  const tokens = useThemeTokens()

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const ctx = prepareCanvas(canvas, size.width, size.height)
    if (!ctx) return
    drawPoolScene(ctx, scene(), {
      width: size.width,
      height: size.height,
      lens,
      tokens,
      design,
    })
  }

  useAnimationFrame((dt) => {
    stepPoolScene(scene(), dt, design)
    draw()
  }, running)

  // A still frame when paused, reduced motion or off screen.
  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw on any input change
  useEffect(() => {
    if (!running) draw()
  }, [running, lens, size, tokens, design])

  return (
    <div ref={boxRef} className="relative mt-3 h-[300px] w-full sm:h-[320px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
        role="img"
        aria-label="A live pool: senders deposit coins, which wait inside and leave to fresh addresses."
      />
    </div>
  )
}

/** The rosette of this made-up pool, following its design. */
function VerdictRosette({
  data,
  verdicts,
  selected,
}: {
  data: PrivacyMethodologyFigureData
  verdicts: PoolVerdicts
  selected: string
}) {
  const rosette = useRosetteTooltipContext()
  const setSelected = rosette?.setSelectedRisk
  const key = data.adversaries.map(({ id }) => verdicts[id].sentiment).join()
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for the verdicts
  const values: RosetteValue[] = useMemo(
    () =>
      data.adversaries.map(({ id, label }) => ({
        name: label,
        value: PRIVACY_ADVERSARY_VERDICT[verdicts[id].sentiment],
        sentiment: verdicts[id].sentiment,
      })),
    [data, key],
  )
  const value = values.find((v) => v.name === selected)

  // The rosette clears its selection on scroll; keep the current adversary.
  const current = rosette?.selectedRisk
  useEffect(() => {
    if (current !== value) setSelected?.(value)
  }, [current, value, setSelected])

  return (
    <PizzaRosetteIcon
      values={values}
      className="float-right mb-1 ml-3 size-16 shrink-0 sm:order-last sm:float-none sm:mb-0 sm:ml-0 sm:size-20"
      background={false}
      disableSectionLinking
    />
  )
}
