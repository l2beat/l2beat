import { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react'

import { SimpleNode } from '../../api/SimpleNode'
import { onKeyDown } from '../events/onKeyDown'
import { onKeyUp } from '../events/onKeyUp'
import { onMouseDown } from '../events/onMouseDown'
import { onMouseMove } from '../events/onMouseMove'
import { onMouseUp } from '../events/onMouseUp'
import { onWheel } from '../events/onWheel'
import { INITIAL_STATE, State } from './State'
import { updateNodes } from './updateNodes'

export function useViewportState(
  nodes: SimpleNode[],
  containerRef: RefObject<HTMLElement>,
  viewRef: RefObject<HTMLElement>,
) {
  const [state, setState] = useState(INITIAL_STATE)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    setState((state) => updateNodes(state, nodes))
  }, [nodes, setState])

  useEffect(() => {
    return setupEventListeners(stateRef, setState, containerRef, viewRef)
  }, [setState])

  return state
}

function setupEventListeners(
  stateRef: MutableRefObject<State>,
  setState: (state: State) => void,
  containerRef: RefObject<HTMLElement>,
  viewRef: RefObject<HTMLElement>,
) {
  function handleWheel(event: WheelEvent) {
    if (!viewRef.current) return
    const newState = onWheel(event, stateRef.current, viewRef.current)
    setState(newState)
  }

  function handleMouseDown(event: MouseEvent) {
    if (!containerRef.current) return
    const newState = onMouseDown(event, stateRef.current, containerRef.current)
    newState && setState(newState)
  }

  function handleMouseMove(event: MouseEvent) {
    if (!containerRef.current) return
    const newState = onMouseMove(event, stateRef.current, containerRef.current)
    newState && setState(newState)
  }

  function handleMouseUp(event: MouseEvent) {
    const newState = onMouseUp(event, stateRef.current)
    newState && setState(newState)
  }

  function handleKeyDown(event: KeyboardEvent) {
    const newState = onKeyDown(event, stateRef.current)
    newState && setState(newState)
  }

  function handleKeyUp(event: KeyboardEvent) {
    const newState = onKeyUp(event, stateRef.current)
    newState && setState(newState)
  }

  const target = containerRef.current
  target?.addEventListener('wheel', handleWheel, { passive: false })
  target?.addEventListener('mousedown', handleMouseDown, { passive: false })
  window.addEventListener('mousemove', handleMouseMove, { passive: false })
  window.addEventListener('mouseup', handleMouseUp, { passive: false })
  window.addEventListener('keydown', handleKeyDown, { passive: false })
  window.addEventListener('keyup', handleKeyUp, { passive: false })
  return () => {
    target?.removeEventListener('wheel', handleWheel)
    target?.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
}
