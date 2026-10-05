import { type PointerEvent, type RefObject, useRef, useState } from 'react'
import type { LabPoster } from '../../model'
import {
  findPlanetAt,
  isOverSun,
  type Orrery,
  type PlacedPlanet,
  placePlanets,
} from './orrery'
import type { Simulation } from './simulation'

interface Pointer {
  x: number
  y: number
  isTouch: boolean
}

/**
 * What the pointer is over: a planet, Ethereum or empty sky. Planets move
 * under a pointer that stands still, so the drawing asks again every frame
 * through `track`; state changes only when the answer does.
 */
export function usePointedPlanet({
  orrery,
  sim,
  posters,
  highlighted,
  onSelect,
  canvasRef,
}: {
  orrery: Orrery
  sim: Simulation
  posters: LabPoster[]
  highlighted: string | undefined
  onSelect: (posterId: string) => void
  canvasRef: RefObject<HTMLCanvasElement | null>
}) {
  const pointerRef = useRef<Pointer>(undefined)
  const hoveredRef = useRef<number>(undefined)
  const isSunHoveredRef = useRef(false)
  const [hovered, setHovered] = useState<number>()
  const [isSunHovered, setIsSunHovered] = useState(false)
  const [pointedAt, setPointedAt] = useState<{ x: number; y: number }>()

  const findPointedPlanet = (placed: PlacedPlanet[]) => {
    const pointer = pointerRef.current
    if (!pointer) return undefined
    // a fingertip is less precise than a mouse
    const extraReach = pointer.isTouch ? 8 : 0
    return findPlanetAt(
      placed,
      pointer.x,
      pointer.y,
      hoveredRef.current,
      extraReach,
    )
  }

  const track = (placed: PlacedPlanet[]) => {
    const pointer = pointerRef.current
    const next = findPointedPlanet(placed)
    // planets cross in front of Ethereum, and then they are what is pointed at
    const isOnSun =
      next === undefined &&
      pointer !== undefined &&
      isOverSun(orrery, pointer.x, pointer.y)
    if (isOnSun !== isSunHoveredRef.current) {
      isSunHoveredRef.current = isOnSun
      setIsSunHovered(isOnSun)
    }
    if (next === hoveredRef.current) return
    hoveredRef.current = next
    setHovered(next)
    if (canvasRef.current) {
      canvasRef.current.style.cursor = next === undefined ? '' : 'pointer'
    }
  }

  const pointAt = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    pointerRef.current = { x, y, isTouch: event.pointerType === 'touch' }
    setPointedAt({ x, y })
  }
  const forget = () => {
    pointerRef.current = undefined
    setPointedAt(undefined)
  }
  const select = () => {
    // a quick tap can land before a frame has looked under the finger
    const index = findPointedPlanet(placePlanets(orrery, sim.clock))
    const poster = index !== undefined ? posters[index] : undefined
    // a click on empty sky lets the picked poster go
    const id = poster?.id ?? highlighted
    if (id !== undefined) onSelect(id)
  }

  return {
    /** Index of the planet under the pointer, as of the last frame */
    hoveredRef,
    hovered,
    isSunHovered,
    /** Where the pointer is, for the tooltip to follow */
    pointedAt,
    track,
    handlers: {
      onPointerMove: pointAt,
      onPointerDown: pointAt,
      onPointerLeave: (event: PointerEvent<HTMLCanvasElement>) => {
        // a tapped planet keeps its tooltip until the next tap
        if (event.pointerType !== 'touch') forget()
      },
      // the page scrolled under a finger rather than a planet being tapped
      onPointerCancel: forget,
      onClick: select,
    },
  }
}
