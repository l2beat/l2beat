import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { useThemeTokens } from '~/hooks/useThemeTokens'
import { useImages } from '~/pages/blobs/components/live-blobs/hooks'
import { cn } from '~/utils/cn'
import type { EthereumHead, HeadBlock } from '../../../live/types'
import { formatPercentage, formatWhole } from '../format'
import type { Poster, PosterRow } from '../model'
import { CoreReadout } from './CoreReadout'
import { type Geometry, getGeometry, type MapMode } from './geometry'
import { HUD_WIDTH } from './hudLayout'
import { OrbitScene, type SceneBlock, type SceneBody } from './OrbitScene'

/** The innermost orbit, named on the map */
const LABELED_ON_MAP = 4

interface Props {
  live: EthereumHead
  rows: PosterRow[]
  posters: Map<string, Poster>
  /** The HUD, laid over the map's sides on wide screens and under it on phones */
  children?: ReactNode
}

/**
 * Ethereum at the centre, the systems that post blobs to it in orbit. Size
 * and closeness follow each one's share of blobs in the recent window, and
 * every block sends its blobs inward from whoever posted them.
 */
export function OrbitMap({ live, rows, posters, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<OrbitScene>(undefined)
  const [geometry, setGeometry] = useState<Geometry>()
  const [focus, setFocus] = useState<{ id: string; pinned: boolean }>()
  const reducedMotion = usePrefersReducedMotion()
  const tokens = useThemeTokens()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const scene = new OrbitScene(canvas)
    sceneRef.current = scene
    const wide = window.matchMedia('(min-width: 768px)')
    // the HUD sits over the map's sides from `lg`, matching its classes
    const hudBeside = window.matchMedia('(min-width: 1200px)')
    const measure = () => {
      const { width, height } = container.getBoundingClientRect()
      const mode: MapMode = wide.matches ? 'orbit' : 'arc'
      const reserve = hudBeside.matches ? HUD_WIDTH + 12 : 0
      scene.resize(width, height, mode, reserve)
      setGeometry(getGeometry(width, height, mode, reserve))
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(container)

    let onScreen = false
    const updateActive = () =>
      scene.setActive(onScreen && document.visibilityState === 'visible')
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? false
      updateActive()
    })
    intersection.observe(container)
    document.addEventListener('visibilitychange', updateActive)
    return () => {
      resize.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', updateActive)
      scene.destroy()
      sceneRef.current = undefined
    }
  }, [])

  useEffect(() => {
    const root = getComputedStyle(document.documentElement)
    sceneRef.current?.setPalette({
      primary: tokens.primary,
      secondary: tokens.secondary,
      surface: tokens.surface,
      track: tokens.surfaceSecondary,
      divider: tokens.divider,
      brand: tokens.brand,
      gas: root.getPropertyValue('--chart-ethereum').trim() || '#2a5bd8',
      font: getComputedStyle(document.body).fontFamily || 'sans-serif',
    })
  }, [tokens])

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  const { limits } = live
  useEffect(() => {
    sceneRef.current?.setLimits(
      limits.targetBlobs,
      limits.maxBlobs,
      limits.gasTarget / limits.gasLimit,
    )
  }, [limits])

  const shownRows = useMemo(
    () => rows.filter((row) => row.tier !== undefined),
    [rows],
  )
  // on the half-orbit the bodies sit too close for names: the legend under it names them
  const labeledCount = geometry?.mode === 'arc' ? 0 : LABELED_ON_MAP
  const bodies = useMemo(
    () =>
      shownRows.map(
        (row): SceneBody => ({
          id: row.poster.id,
          name: row.poster.name,
          color: row.poster.color,
          iconUrl: row.poster.iconUrl,
          share: row.share,
          tier: row.tier ?? 2,
          labeled: row.rank <= labeledCount,
          unattributed: row.poster.isUnattributed,
        }),
      ),
    [shownRows, labeledCount],
  )
  useEffect(() => {
    sceneRef.current?.setBodies(bodies)
  }, [bodies])

  const images = useImages(bodies.map((b) => b.iconUrl))
  useEffect(() => {
    sceneRef.current?.setImages(images)
  }, [images])

  useBlockFeed(sceneRef, live, posters)

  const focused = focus && rows.find((row) => row.poster.id === focus.id)
  const focusPosition =
    focus && geometry ? sceneRef.current?.bodyPosition(focus.id) : undefined

  function pointAt(event: React.MouseEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    return sceneRef.current?.hitTest(
      event.clientX - box.left,
      event.clientY - box.top,
    )
  }

  return (
    <div className="@container relative">
      <div
        ref={containerRef}
        className={cn(
          'relative h-[clamp(220px,64cqw,300px)] md:h-[clamp(420px,46cqw,540px)]',
          focused && 'cursor-pointer',
        )}
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse' || focus?.pinned) return
          const id = pointAt(event)
          if (id !== focus?.id) {
            setFocus(id ? { id, pinned: false } : undefined)
            sceneRef.current?.setHovered(id)
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'mouse' || focus?.pinned) return
          setFocus(undefined)
          sceneRef.current?.setHovered(undefined)
        }}
        onClick={(event) => {
          const id = pointAt(event)
          const row = id && rows.find((r) => r.poster.id === id)
          const isMouse =
            (event.nativeEvent as PointerEvent).pointerType === 'mouse'
          if (isMouse && row && row.poster.href) {
            window.location.href = row.poster.href
            return
          }
          const next = id && id !== focus?.id ? { id, pinned: true } : undefined
          setFocus(next)
          sceneRef.current?.setHovered(next?.id)
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 size-full"
        />
        <SkeletonOrbits visible={!geometry} />
        {geometry && <CoreReadout geometry={geometry} live={live} />}
        {focused && focusPosition && geometry && (
          <SystemTooltip
            row={focused}
            pinned={focus.pinned}
            x={focusPosition.x}
            y={focusPosition.y}
            radius={focusPosition.radius}
            geometry={geometry}
          />
        )}
      </div>
      <ArcLegend rows={shownRows.slice(0, LABELED_ON_MAP)} />
      {children}
      <ul className="sr-only">
        {shownRows.map((row) => (
          <li key={row.poster.id}>
            {row.poster.href ? (
              <a href={row.poster.href}>{row.poster.name}</a>
            ) : (
              row.poster.name
            )}
            : {formatPercentage(row.share, 1)} of blobs in the last{' '}
            {live.blocks.length} slots
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The systems the wide map labels, listed under the half-orbit instead */
function ArcLegend({ rows }: { rows: PosterRow[] }) {
  if (rows.length === 0) return null
  return (
    <ul className="-mt-1 mb-4 grid grid-cols-2 gap-x-4 gap-y-1.5 md:hidden">
      {rows.map((row) => (
        <li
          key={row.poster.id}
          className="flex min-w-0 items-center gap-2 text-label-value-13"
        >
          <span
            aria-hidden
            className={cn(
              'size-2.5 shrink-0 rounded-full',
              row.poster.isUnattributed &&
                'border border-secondary border-dashed',
            )}
            style={
              row.poster.isUnattributed
                ? undefined
                : { backgroundColor: row.poster.color }
            }
          />
          <span className="truncate font-medium">{row.poster.name}</span>
          <span className="ml-auto text-secondary tabular-nums">
            {formatPercentage(row.share, 1)}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Hands each head to the scene once, and a reorg as a rewind: the sim
 * replaces a block and moves on in one go, so both can arrive in one render
 */
function useBlockFeed(
  sceneRef: React.RefObject<OrbitScene | undefined>,
  live: EthereumHead,
  posters: Map<string, Poster>,
) {
  const shown = useRef<{ key: string; reorgSeenAt: number | undefined }>(
    undefined,
  )
  const clockStart = useRef(0)
  const { head, lastReorg, nextSlotAt } = live

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || !head) return
    const key = blockKey(head)
    const previous = shown.current
    const toScene = (block: HeadBlock) => toSceneBlock(block, posters)
    if (!previous) {
      scene.showBlock(toScene(head), false)
    } else if (lastReorg && lastReorg.seenAt !== previous.reorgSeenAt) {
      scene.rewindBlock(toScene(lastReorg.replaced), toScene(lastReorg.by))
      if (key !== blockKey(lastReorg.by)) scene.showBlock(toScene(head), true)
    } else if (key !== previous.key) {
      scene.showBlock(toScene(head), true)
    } else {
      return
    }
    shown.current = { key, reorgSeenAt: lastReorg?.seenAt }
    clockStart.current = previous ? Date.now() : head.timestamp * 1000
  }, [sceneRef, head, lastReorg, posters])

  useEffect(() => {
    if (!nextSlotAt) return
    const start = Math.max(clockStart.current, nextSlotAt - 12_000)
    sceneRef.current?.setClock(start, nextSlotAt)
  }, [sceneRef, nextSlotAt])
}

function blockKey(block: HeadBlock) {
  return `${block.slot}:${block.hash ?? 'missed'}`
}

function toSceneBlock(
  block: HeadBlock,
  posters: Map<string, Poster>,
): SceneBlock {
  return {
    slot: block.slot,
    missed: block.status === 'missed',
    gasFraction: block.gasLimit === 0 ? 0 : block.gasUsed / block.gasLimit,
    posters: block.blobs.map((b) => ({
      posterId: b.posterId,
      blobs: b.blobs,
      color: posters.get(b.posterId)?.color ?? '#8a909d',
    })),
  }
}

/** The orbits' outline before the canvas measures itself, so nothing moves when it does */
function SkeletonOrbits({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="absolute aspect-[2/1] w-[92%] rounded-[50%] border border-divider border-dashed md:w-[70%]" />
      <div className="absolute aspect-[2/1] w-[74%] rounded-[50%] border border-divider md:w-[55%]" />
      <div className="absolute aspect-[2/1] w-[58%] rounded-[50%] border border-divider md:w-[40%]" />
      <div className="size-28 animate-pulse rounded-full bg-surface-secondary md:size-44" />
    </div>
  )
}

/**
 * Beside the system, on the side away from the core, so the head block stays
 * readable. The half-orbit has no room beside a body, so there it goes below
 */
function placeTooltip(
  geometry: Geometry,
  x: number,
  y: number,
  radius: number,
  width: number,
): React.CSSProperties {
  const height = 150
  const gap = radius + 12
  if (geometry.mode === 'arc') {
    return {
      width,
      left: clampTo(x - width / 2, 8, geometry.width - width - 8),
      top: y + gap,
    }
  }
  const left = x < geometry.cx ? x - gap - width : x + gap
  return {
    width,
    left: clampTo(left, 8, geometry.width - width - 8),
    top: clampTo(y - height / 2, 8, geometry.height - height - 8),
  }
}

function clampTo(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function SystemTooltip({
  row,
  pinned,
  x,
  y,
  radius,
  geometry,
}: {
  row: PosterRow
  pinned: boolean
  x: number
  y: number
  radius: number
  geometry: Geometry
}) {
  const width = 220
  const style = placeTooltip(geometry, x, y, radius, width)
  return (
    <div
      role={pinned ? 'dialog' : 'tooltip'}
      className={cn(
        'absolute z-10 rounded-lg border border-divider bg-surface-primary p-3 shadow-popover',
        !pinned && 'pointer-events-none',
      )}
      style={style}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: row.poster.color }}
        />
        <span className="truncate font-bold text-label-value-15">
          {row.poster.name}
        </span>
        <span className="ml-auto text-label-value-13 text-secondary tabular-nums">
          #{row.rank}
        </span>
      </div>
      <dl className="mt-2.5 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-label-value-13">
        <dt className="text-secondary">Share of blobs</dt>
        <dd className="text-right font-medium tabular-nums">
          {formatPercentage(row.share, 1)}
        </dd>
        <dt className="text-secondary">Blobs, last 64 slots</dt>
        <dd className="text-right font-medium tabular-nums">
          {formatWhole(row.blobs)}
        </dd>
        <dt className="text-secondary">In the head block</dt>
        <dd className="text-right font-medium tabular-nums">
          {row.inHead === 0 ? 'none' : formatWhole(row.inHead)}
        </dd>
      </dl>
      {row.poster.href ? (
        pinned ? (
          <a
            href={row.poster.href}
            className="mt-3 block font-medium text-label-value-13 text-link underline"
          >
            Open {row.poster.name}'s page
          </a>
        ) : (
          <p className="mt-3 text-label-value-12 text-secondary">
            Click to open its page
          </p>
        )
      ) : (
        <p className="mt-3 text-label-value-12 text-secondary">
          {row.poster.isUnattributed
            ? 'Blobs no tracked project claims'
            : 'Tracked through Ethereum, no page of its own'}
        </p>
      )}
    </div>
  )
}
